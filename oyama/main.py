import random
import schedule
import time
import traceback
from telegram.ext import Updater

# 在这里替换成您的 Telegram Bot Token
TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'

# 在这里替换成您的歌词列表
lyrics_list = ["山川壮丽，物产丰隆", "炎黄世胄，东亚称雄", "毋自暴自弃，毋故步自封","光我民族，促进大同", "创业维艰，缅怀诸先烈", "守成不易，莫徒务近功","同心同德，贯彻始终", "青天白日满地红"]  # 您可以添加更多歌词

def change_last_name(updater):
    try:
        new_name = random.choice(lyrics_list)  # 每次更改为随机的歌词
        updater.bot.set_my_commands([("start", "Hello!")])  # 更改bot的命令，确保至少有一个命令保持不变
        updater.bot.set_my_commands([("start", "Hello!"), ("help", "I can help!")])  # 更新bot的命令列表
        updater.bot.set_my_user_name(new_name)
    except Exception as e:
        trac = "\n".join(traceback.format_exception(e))
        print(f"更新失败! \n{trac}")

def job():
    updater = Updater(TOKEN, use_context=True)
    change_last_name(updater)

# 每30秒调度一次任务
schedule.every(30).seconds.do(job)

def main():
    while True:
        schedule.run_pending()
        time.sleep(1)

if name == '__main__':
    main()
