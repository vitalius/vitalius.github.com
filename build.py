import json
import os
from datetime import datetime
from collections import OrderedDict


def read_json(fname):
    with open(fname) as data_file:    
        data = json.load(data_file)
    return data  

def read_file(fname):
    with open(fname) as f:
        content = f.readlines()
    return "".join([x for x in content])

def write_file(fname, content):
    target = open(fname, 'w')
    target.write(content)
    target.close()

def delete_file(fname):
    try:
        os.remove(fname)
    except OSError:
        pass

def render_post(title, date, content, fname):
    delete_file(fname)
    post = '<div><h2 id="post_title">'+title+'</h2><p id="post_date">'+date+'</p><div id="post_body" class="page_body">'+content+'</div></div>'
    post = TEMPLATE.replace('<div id="content"></div>', '<div id="content">' + post + '</div>')
    write_file(fname, post)

def render_archive(fname, posts):
    content = '<div><dl class="archive" id="arch">'
    for f in posts:
        date = posts[f]['date']
        title = posts[f]['title']
        content += '<dt>' + date + '</dt><dd><a href="./' + f + '">' + title + '</a></dd>'
    content += '</dl></div>'  
    render_post('Archive', '', content, fname)

def render_about(fname):
    render_post('About', '', read_file(PREF + 'about.html'), fname)

def rw_replace(fname, old, new):
    c = read_file(fname)
    delete_file(fname)
    c = c.replace(old, new)
    write_file(fname, c);



MAINTEMPLATE = 'assets/template.html'
INDEXJSON = 'content/index.json'
PREF = 'content/'
RESULT_PREF = 'posts/'

TEMPLATE = read_file(MAINTEMPLATE)

posts = {k:v for k,v in read_json(INDEXJSON).iteritems() if 'date' in v.keys()}
posts = OrderedDict(sorted(posts.items(), key=lambda t: datetime.strptime(t[1]['date'], '%B %d, %Y'), reverse=True))

rw_replace('index.html', '???', posts.items()[0][0])
rw_replace('assets/template.html', '???', posts.items()[0][0])
render_archive(RESULT_PREF + 'archive.html', posts)
render_about(RESULT_PREF + 'about.html')

for f in posts:
    if ('date' not in posts[f]):
        continue
    render_post(posts[f]['title'], posts[f]['date'], read_file(PREF + f), RESULT_PREF + f)
