echo "tsc"
tsc

find ./app -name '*.map' -type f -delete

echo "copy to server"
username="www"
server="203.157.88"
# server="192.168.0"
IPS=("89:/app_data/public/api/hospdata" "88:/var/www/app/api/hospdata")
for IP in "${IPS[@]}"
do
  echo "  => $server.$IP "
  scp -r app/* $username@$server.$IP/app
  # scp *.ts $username@$server.$IP
  # scp -r src/* $username@$server.$IP/src
  scp *.json $username@$server.$IP
  # scp .env $username@$server.$IP:$folderName
  # scp -r templates/* $username@$server.$IP:$folderName/templates
done
