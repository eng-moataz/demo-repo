import logging
import logging.handlers
import os

from wsgiref.simple_server import make_server, WSGIServer
from SocketServer import ThreadingMixIn

# Create logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Handler 
LOG_FILE = '/var/log/sample-app.log'
handler = logging.handlers.RotatingFileHandler(LOG_FILE, maxBytes=1048576, backupCount=5)
handler.setLevel(logging.INFO)

# Formatter
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')

# Add Formatter to Handler
handler.setFormatter(formatter)

# add Handler to Logger
logger.addHandler(handler)

welcome = """
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <!--
    Copyright 2012 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.Amazon/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
  -->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Welcome</title>
  <style>
  body {
    margin:0px;
    color: #ffffff;
    background-color: #E0E0E0;
    font-family: Arial, sans-serif;
    font-size:14px;
    -moz-transition-property: text-shadow;
    -moz-transition-duration: 4s;
    -webkit-transition-property: text-shadow;
    -webkit-transition-duration: 4s;
    text-shadow: none;
  }
  body.blurry {
    -moz-transition-property: text-shadow;
    -moz-transition-duration: 4s;
    -webkit-transition-property: text-shadow;
    -webkit-transition-duration: 4s;
    text-shadow: #fff 0px 0px 25px;
  }
  a {
    color: green;
  }
  .textColumn, .linksColumn {
    padding: 2em;
  }
  .textColumn {
    position: absolute;
    top: 0px;
    right: 50%;
    bottom: 0px;
    left: 0px;

    text-align: right;
    padding-top: 11em;
    background-color: #24B8EB;
  }
  .textColumn p {
    width: 75%;
    float:right;
  }
  .linksColumn {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 50%;
    background-color: #A9A9A9;
    padding-top: 3em;
  }

  h1 {
    font-size: 400%;
    font-weight: normal;
    margin-bottom: 0em;
  }
  h2 {
    font-size: 200%;
    font-weight: normal;
    margin-bottom: 0em;
  }
  ul {
    padding-left: 1em;
    margin: 0px;
  }
  li {
    margin: 1em 0em;
  }
  .father{
    position: relative;
    right: 0px;
    left: 0px;
    bottom: 0px;
  }
  .tab {
    position: relative;
    overflow: hidden;
    border: 1px solid #ccc;
    background-color: #f1f1f1;
    z-index: 100;
  }
  /* Style the buttons inside the tab */
  .tab button {
   background-color: inherit;
   float: left;
   border: none;
   outline: none;
   cursor: pointer;
   padding: 14px 16px;
   transition: 0.3s;
   font-size: 17px;
 }
 /* Change background color of buttons on hover */
.tab button:hover {
  background-color: #ddd;
}

</style>
</head>
<body id="sample">
  <div class="tab">
      <button class="tablinks" onclick="openTab(event, 'Tab1')">Tab1</button>
      <button class="tablinks" onclick="openTab(event, 'Tab2')">Tab2</button>
      <button class="tablinks" onclick="openTab(event, 'Tab3')">Tab3</button>
      <button class="tablinks" onclick="openTab(event, 'Tab4')">Tab4</button>
  </div>
  <div calss="father">
    <div class="textColumn">
      <h1>Congratulations!</h1>
      <p>Your Docker Container is now running in the AWS Cloud.</p>
    </div>
  
    <div class="linksColumn"> 
      <h2>Video Tutorials</h2>
      <ul>
      <li>YouTube: <a href="https://www.youtube.com/watch?v=lBu7Ov3Rt-M&feature=youtu.be">Run a Docker Container from the Docker Registry</a></li>
      <li>YouTube: <a href="https://www.youtube.com/watch?v=pLw6MLqwmew&feature=youtu.be">Use Private Docker Repositories</a></li>
      </ul>
      <h2>Sample Apps</h2>
      <ul>
      <li>GitHub: <a href="https://github.com/awslabs/eb-demo-php-simple-app/tree/docker-apache">PHP and Amazon RDS</a></li>
      <li>GitHub: <a href="https://github.com/awslabs/eb-py-flask-signup/tree/docker">Python, DynamoDB, and SNS</a></li>
      </ul>
    </div>
  </div>
  <script>
       function openTab(evt, tabName) {
         //console.log(tabName.concat('.html'))
         window.location.href= tabName.concat('.html');
       }
  </script>
</body>

</html>
"""

def application(environ, start_response):
    path    = environ['PATH_INFO']
    method  = environ['REQUEST_METHOD']
    if method == 'POST':
        try:
            if path == '/':
                request_body_size = int(environ['CONTENT_LENGTH'])
                request_body = environ['wsgi.input'].read(request_body_size)
                logger.info("Received message: %s" % request_body)
            elif path == '/scheduled':
                logger.info("Received task %s scheduled at %s", environ['HTTP_X_AWS_SQSD_TASKNAME'], environ['HTTP_X_AWS_SQSD_SCHEDULED_AT'])
        except (TypeError, ValueError):
            logger.warning('Error retrieving request body for async work.')
        response = ''
    else:
      if method == 'GET':
         try:
            if path == '/':
              response = welcome
            else:
              dir_path = os.path.dirname(os.path.realpath(__file__))
              f=str(path)
              filename=f.replace('/','')
              location=os.path.join(dir_path, filename)
              print(location)
              contents=open(location,"r")
              response =  contents.read()
         except (TypeError, ValueError):
            logger.warning('Error reading file')
    status = '200 OK'
    headers = [('Content-type', 'text/html')]

    start_response(status, headers)
    logger.info("%s %s %s", status,environ['REQUEST_METHOD'],environ['PATH_INFO'])
    return [response]

class ThreadingWSGIServer(ThreadingMixIn, WSGIServer): 
    pass

if __name__ == '__main__':
    httpd = make_server('', 80, application, ThreadingWSGIServer)
    print "Serving on port 80..."
    httpd.serve_forever()
