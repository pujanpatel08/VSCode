FROM rockylinux:9

WORKDIR /home/user

RUN ["dnf", "upgrade", "--refresh", "-y"]
RUN ["dnf", "group", "install", "Development Tools",  "-y"]
RUN ["dnf", "install", "-y", "vim"]
RUN ["dnf", "install", "-y", "tmux"]
RUN ["dnf", "install", "-y", "tree"]
RUN ["dnf", "install", "-y", "man"]
RUN ["dnf", "install", "-y", "man-pages"]

RUN ["dnf", "upgrade", "--refresh", "-y"]

