FROM python:2.7

# Add sample application
ADD application.py /tmp/application.py
ADD Tab* /tmp/
ADD favicon.ico /tmp/

EXPOSE 80

# Run it
ENTRYPOINT ["python", "/tmp/application.py"]
