/**
 * Native extension for nodejs to request
 * dss server with libcurl.
 * 
 * AUTHOR: Andree andreek@tzi.de
 */
#include <v8.h>
#include <node.h>
#include <node_events.h>
#include <curl/curl.h>
#include <string.h>
#include <stdlib.h>
#include <iostream>

using namespace v8;
using namespace node;
using namespace std;

static Persistent<String> connect_symbol;

/*
 * Callback to fetch chunk into a string 
 */
int writer(char *data, size_t size, size_t nmemb, std::string *buffer) {
  int result = 0;

  if(buffer != NULL)
  {
    buffer->append(data, size*nmemb);

    result = size * nmemb;
  }
  
  return result;
}

/*
 * Converts v8::Utf8Value to cstring
 */
const char* ToCString(const v8::String::Utf8Value& value) {
  return *value ? *value : "<string conversion failed>";
}

/*
 * Seems to be bullshit, but current nodejs https modul doesn't
 * work with dss.
 */
class Dss : public EventEmitter {
  public:
    static void
    Initialize (v8::Handle<v8::Object> target)
    {
      HandleScope scope;

      Local<FunctionTemplate> t = FunctionTemplate::New(New);
      
      connect_symbol = NODE_PSYMBOL("Request"); 

      t->Inherit(EventEmitter::constructor_template); 
      t->InstanceTemplate()->SetInternalFieldCount(1);

      NODE_SET_PROTOTYPE_METHOD(t, "request", Request);

      target->Set(String::NewSymbol("Connection"), t->GetFunction());
    }

  protected:
    /*
     * Create a new javascript object of Dss
     */
    static Handle<Value> New (const Arguments& args)
    {
      HandleScope scope;

      Dss *dss = new Dss();

      return args.This();
    }

    /*
     * Requests dss with curl
     */
    static Handle<Value> Request (const Arguments& args)
    {
      HandleScope scope;
      char *url;
      char *cookie;
      v8::String::Utf8Value urls(args[0]->ToString());
      url = (char *) ToCString(urls);
      v8::String::Utf8Value token(args[1]->ToString());
      cookie = (char *) ToCString(token);
      CURL *curl;
      CURLcode res;
      curl = curl_easy_init();
      if(curl)
      {
        curl_easy_setopt(curl, CURLOPT_URL, url);
        // disable certificate check
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYHOST, 0L);

        // save response body to string
        string buffer;
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writer);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &buffer);

        // Digest authentication
        //curl_easy_setopt(curl, CURLOPT_HTTPAUTH, CURLAUTH_DIGEST);     
		
      	// convert username|password
        v8::String::Utf8Value username(args[2]->ToString());
        v8::String::Utf8Value password(args[3]->ToString());
	 
        curl_easy_setopt(curl, CURLOPT_USERNAME, ((char *) ToCString(username)));
        curl_easy_setopt(curl, CURLOPT_PASSWORD, ((char *) ToCString(password)));
        
        // set cookie
        curl_easy_setopt(curl, CURLOPT_COOKIE, cookie);

        // send res
        res = curl_easy_perform(curl);
        /* always cleanup */
        curl_easy_cleanup(curl);

        // TODO emit event!
        const string &value = buffer;
        return String::New(value.c_str(), value.length());
      }
    }
};

/*
 * Required to use this in nodeJS
 */
extern "C" void
init (Handle<Object> target)
{
  HandleScope scope;
  Dss::Initialize(target);
};
