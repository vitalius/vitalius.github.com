import json
import os
import re
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

def rw_replace(fname, old, new):
    c = read_file(fname)
    delete_file(fname)
    c = re.sub(old, new, c)
    write_file(fname, c);



def render_post(template, title, date, content, fname):
    delete_file(fname)
    post = '<div><h2 id="post_title">'+title+'</h2>'
    post += '<p id="post_date">'+date+'</p>'
    post += '<div id="post_body" class="page_body">'+content+'</div></div>'
    post = template.replace('<div id="content"></div>',
                            '<div id="content">'+post+'</div>')
    write_file(fname, post)

def render_archive(template, fname, posts):
    content = '<div><dl class="archive" id="arch">'
    for f in posts:
        date = posts[f]['date']
        title = posts[f]['title']
        content += '<dt>'+date+'</dt><dd><a href="./' + f + '">'+title+'</a></dd>'
    content += '</dl></div>'  
    render_post(template, 'Archive', '', content, fname)

def render_about(template, source, target):
    render_post(template, 'About', '', read_file(source), target)


MAINTEMPLATEFILE = 'assets/template.html'
INDEXJSONFILE = 'content/index.json'
PREF = 'content/'
RESULT_PREF = 'posts/'

posts = {k:v for k,v in read_json(INDEXJSONFILE).iteritems() if 'date' in v.keys()}
posts = OrderedDict(sorted(posts.items(), key=lambda t: datetime.strptime(t[1]['date'], '%B %d, %Y'), reverse=True))

rw_replace('assets/template.html', '<a href="(.*).html"><img src=', '<a href="' + posts.items()[0][0] + '"><img src=')
rw_replace('index.html', '/(.*).html', '/' + posts.items()[0][0])

TEMPLATE = read_file(MAINTEMPLATEFILE)
render_archive(TEMPLATE, RESULT_PREF + 'archive.html', posts)
render_about(TEMPLATE, PREF + 'about.html', RESULT_PREF + 'about.html')

for f in posts:
    render_post(TEMPLATE, 
                posts[f]['title'], 
                posts[f]['date'], 
                read_file(PREF + f), RESULT_PREF + f)
