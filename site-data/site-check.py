import asyncio
import subprocess
import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

res = requests.get("https://semblueinc.com")
code = res.status_code

smtp_server = 'smtp.gmail.com'
smtp_port = 587
smtp_username = 'noreply.semblueinc@gmail.com'
smtp_password = 'zosb bsqw fyci vhkb'

admin_email = "wcouture17@gmail.com"

alert_message = "Semblueinc.com no longer responding!!"

def send_email(sender_email, receiver_email, subject, message):
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject

    msg.attach(MIMEText(message, 'plain'))

    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(smtp_username, smtp_password)

    server.sendmail(sender_email, receiver_email, msg.as_string())

    server.quit()

async def restart_site():
    log = open("/home/ubuntu/site/semblueinc/site-data/check-log.txt", "a")
    try:
        res = asyncio.create_task(asyncio.create_subprocess_shell("node index.js &"))
        log.write('Attempting to restart site...\n' + str(res) + '\n')
    except subprocess.CalledProcessError as e: 
        log.write('Failed to execute restart command\n' + str(e) + '\n')

if code != 200:
    # Site is down, send email to fix
    send_email(smtp_username, admin_email, "Semblueinc Website Alert", alert_message)
    asyncio.run(restart_site())
