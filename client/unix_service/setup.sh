#!/bin/bash
 CURRENT_DIR="../../../RpiTracker"
 INSTALL_LOC="/usr/local/sbin"
 WORK_DIR=$(pwd)

if [ "$EUID" -ne 0 ] ; then 
    echo "This script must run as << root >>"    
    exit
fi
if ! [ -x "$(command -v curl)" ] ; then
    apt install -y  curl 
fi    
if ! [ -x "$(command -v git)" ] ; then
    apt install -y  git 
fi
if ! [ -x "$(command -v nodejs)" ] ; then
    echo "Installing Nodejs v10.x"
    bash <(curl -s https://deb.nodesource.com/setup_10.x  )
    apt-get install -y nodejs npm
fi

function help(){
    echo "
Setup Client/Server background service.

Usage

--help , -h         : Prints this help.
--uninstall , -r    : Removes installed service from system

                    : Default installs systemd service."
}
function install()  {
    echo "[Installing]  Use Default[d] install location (/usr/local/sbin) or Current[c] ?"
    read -e -p "Enter [ c OR d ] : " loc
    if [  "$loc" == "c" ]  || [ "$loc" == "d" ]  &&   ! [ -d  "$WORK_DIR/../node_modules" ]   ; then        
        echo "Installing modules"
        cd ".."
        npm install
        cd unix_service
    fi 
    if [ "$loc" == "c" ] ; then
        echo "Using current project location."
        xx="/usr/local/sbin/RpiTracker/client"
        cc=$(dirname "$(pwd)")
        sed -i "s~$xx~$cc~" ./rpi_tracker_client.service 
    elif [ "$loc" ==  "d" ] ; then
        echo "Installing RpiTracker Client to $INSTALL_LOC"
        cp -r  "$CURRENT_DIR"  "$INSTALL_LOC"
        echo "[Unit]
Description=RpiTracker Client

[Service]
ExecStart=/usr/bin/node  /usr/local/sbin/RpiTracker/client/client.js
Restart=always

[Install]
WantedBy=multi-user.target" > rpi_tracker_client.service

    else
        echo "Unknown option.Abort"
        exit
    fi
    echo "Installing rpi_tracker_client.service"
    cp ./rpi_tracker_client.service /etc/systemd/system
    systemctl  daemon-reload
    systemctl enable rpi_tracker_client
    read -e -p  "Starting service now ? [ y/n ] : " start
    if [ "$start" == "y" ] ; then 
        service rpi_tracker_client start
    fi
    echo "Done"
}
function remove(){
    if [ -f "/etc/systemd/system/rpi_tracker_client.service" ] ; then
        isActive=$(systemctl is-active --quiet rpi_tracker_client && echo 'yes')
        if [ "$isActive" == "yes" ] ; then
            echo "Service is running.Stoping it.."
            service rpi_tracker_client stop
        fi
        echo "Removing service"
        systemctl disable rpi_tracker_client
        rm /etc/systemd/system/rpi_tracker_client.service
        systemctl  daemon-reload        
    else
        echo "Service not found installed."
    fi
    if [ -d /usr/local/sbin/RpiTracker ] ; then
        read -e -p  "Removing folder /usr/local/sbin/RpiTracker/ ? [y/n] : " delete
        if [    "$delete" == "y" ] ; then        
            rm -r /usr/local/sbin/RpiTracker/
            echo "Done"
        fi   
    fi  
    exit  
}

for i in "$@"
do
    case $i in
        --uninstall|-r )
            remove
            exit            
        ;;
        --help|-h )
            help
            exit
        ;;
    esac
done

 install #default