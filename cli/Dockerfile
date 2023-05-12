FROM ubuntu:20.04

COPY ./executables/dta-linux dta
RUN chmod +x dta
#CI/CD's need an entrypoint to run the container 
ENTRYPOINT [ "/bin/bash", "-l", "-c"]
