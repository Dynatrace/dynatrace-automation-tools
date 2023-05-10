FROM ubuntu:20.04

COPY ./executables/dt-automation-cli-linux .
RUN chmod +x dta-linux
#CI/CD's need an entrypoint to run the container 
ENTRYPOINT [ "/bin/bash", "-l", "-c"]
