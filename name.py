""" Module to automate message deletion. """

import traceback
from asyncio import sleep
from datetime import datetime, timedelta, timezone
from pagermaid.utils import pip_install

pip_install("emoji")

from emoji import emojize
from pagermaid import logs, scheduler, bot

auto_change_name_init = False

# 在这里替换成您的歌词列表
lyrics_list = ["山川壮丽，物产丰隆", "炎黄世胄，东亚称雄", "毋自暴自弃，毋故步自封""光我民族，促进大同", "创业维艰，缅怀诸先烈", "守成不易，莫徒务近功""同心同德，贯彻始终", "青天白日满地红"]  # 您可以添加更多歌词

@scheduler.scheduled_job("interval", seconds=30, id="autochangename")
async def change_name_auto():
    try:
        new_name = random.choice(lyrics_list)  # 每次更改为随机的歌词
        await bot.update_profile(last_name=new_name)
        me = await bot.get_me()
        if me.last_name != new_name:
            raise Exception("修改 last_name 失败")
    except Exception as e:
        trac = "\n".join(traceback.format_exception(e))
        await logs.info(f"更新失败! \n{trac}")
