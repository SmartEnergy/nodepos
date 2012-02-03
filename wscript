srcdir = '.'
blddir = 'build'
VERSION = '0.0.1'

def set_options(opt):
  opt.tool_options('compiler_cxx')

def configure(conf):
  conf.check_tool('compiler_cxx')
  conf.check_tool('node_addon')
  conf.check_cxx(lib='curl', mandatory=True, uselib_store='Curl')

def build(bld):
  obj = bld.new_task_gen('cxx', 'shlib', 'node_addon')
  obj.target = 'dsscurl'
  obj.source = './actions/dsscurl.cc'
  obj.uselib = 'Curl'
