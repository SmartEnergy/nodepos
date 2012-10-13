#!/usr/bin/env python
# Script to deploy nodePos to a remote server
# via ssh.
# 
# Required:
#   scp
#
# Required libs:
#   pysvn
#   paramiko
#   
#   Ubuntu/Debian:
#       sudo apt-get install python-subversion python-paramiko
#
# AUTHOR: Andree Klattenhoff - andreek@tzi.de
# LAST UPDATE: 2012-08-04
import getpass
import os
import paramiko
import pysvn
import sys
import time

SVN_URL = "https://nyx.informatik.uni-bremen.de/svn/SmartEnergy/groups/kinect/"\
        + "src/server/branches/v0.5"

SSH_HOST = "baall-server-2.informatik.uni-bremen.de"
SSH_USER = "smartenergy"
SSH_KEYFILE = "" # path to keyfile for ssh host

TIME = str(time.time())
TMP_CO_PATH = "/tmp/nodepos/"+TIME # TMP local checkout path
DEPLOY_PATH = "/home/smartenergy/kinect/deploy/" # Remote deploy path
CURRENT_PATH = DEPLOY_PATH+"current" # Remote current path

def get_login(realm, username, may_save):
    """ callback for svn login prompt"""
    
    print "\n[INFO] SVN authentication"
    name = raw_input("[SVN-USERNAME]: ")
    password = getpass.getpass("[SVN-PASSWORD]: ")
    print ""
    return True, name, password, False

def checkout(url, path):
    """ checkout nodepos from svn repository """

    svnclient = pysvn.Client()
    svnclient.exception_style = 0

    # define login callback
    svnclient.callback_get_login = get_login

    # checkout svn
    try:
        print "[INFO] Checkout current revision of nodePos from svn"
        svnclient.checkout(url, path)
        print "[INFO] Checkout finished"

    except pysvn.ClientError, e:
        print "[ERROR] Can\'t checkout SVN Repository:\n"+str(e)
        sys.exit();

def copy(ssh):
    """ copy local version to remote server via scp """

    # remove svn directories
    os.system("rm -rf `find "+TMP_CO_PATH+" -type d -name .svn`")

    print "[INFO] Upload src files"
    os.system("scp -r "+TMP_CO_PATH+" "+SSH_USER+"@"+SSH_HOST+":"+DEPLOY_PATH)

def upgrade():
    """ makes ssh connection and run commands via ssh on server (like stop/start
    ) to execute deploy """

    ssh = paramiko.SSHClient()
    ssh.load_system_host_keys()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy()) 

    try:
        print "[INFO] Create ssh connection to "+SSH_HOST
        ssh.connect(SSH_HOST, username=SSH_USER, key_filename=SSH_KEYFILE)
    except paramiko.BadHostKeyException, e:
        print "[ERROR] Bad SSH HostKey:\n"+str(e)
        ssh.close()
        sys.exit()
    except paramiko.AuthenticationException, e:
        print "[ERROR] Can't authenticate with remote server:\n"+str(e)
        ssh.close()
        sys.exit()
    except paramiko.SSHException, e:
        print "[ERROR] Error occured with ssh connection:\n"+str(e)
        ssh.close()
        sys.exit()
    
    copy(ssh)

    print "[INFO] Copy conf.json"
    # backup config
    exec_command(ssh, "cp -d "+CURRENT_PATH+"/conf.json /tmp/conf.json")

    print "[INFO] Stop server"
    # stop server
    exec_command(ssh, "forever stop 0")

    print "[INFO] Update current symbolic link"
    # update current symbolic link
    exec_command(ssh, "rm "+CURRENT_PATH)
    exec_command(ssh, "ln -s "+DEPLOY_PATH+""+TIME+" "+CURRENT_PATH)
   
    print "[INFO] Copy conf.json"
    # copy config back
    exec_command(ssh, "cp -d /tmp/conf.json "+CURRENT_PATH+"/conf.json")
    
    print "[INFO] Install depended nodejs modules. This can take some minutes!"
    # npm install
    exec_command(ssh, "cd "+CURRENT_PATH+" && npm install")
    
    print "[INFO] Start server"
    # start server
    exec_command(ssh, "cd "+CURRENT_PATH + " && forever start "
                                         +  CURRENT_PATH+"/bin/nodepos")

    ssh.close()

def exec_command(ssh, cmd):
    """ default ssh command handler """
    try:
        stdin, stdout, stderr = ssh.exec_command("source ~/.bash_profile && " + cmd)
        
        error_data = stderr.read().splitlines()
        
        if(len(error_data) > 0):
            print "[ERROR] Error on executing command: "+cmd
            for line in error_data:
                print "["+SSH_HOST[:10]+"..] "+line
        else:
            data = stdout.read().splitlines()
            for line in data:
                print "["+SSH_HOST[:10]+"..] "+line

    except paramiko.SSHException, e:
        print "[ERROR] Can't execute command:\n"+str(e)
        ssh.close()
        sys.exit()

def housekeeping():
    """ cleanup directories etc. """
    os.system("rm -rf "+TMP_CO_PATH)

def main():
    """ main function """

    print "="*80+"\n"
    
    #test_result = os.system("make test")
    test_result = 0; 
    if(test_result == 0):

        checkout(SVN_URL, TMP_CO_PATH)

        upgrade()

        housekeeping()
    else:
        print "[ERROR] Test failed"

    print "\n"+"="*80

if __name__ == '__main__':
    main()
