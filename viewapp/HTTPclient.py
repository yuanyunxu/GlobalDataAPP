import httplib2 as http
import json

try:
    from urlparse import urlparse
except ImportError:
    from urllib.parse import urlparse
def http_request(url, method='GET', body='', headers={}, auth=None):

    th = {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
    }

    for (k,v) in  headers.items():
        th[k]=v

    target = urlparse(url)

    h = http.Http()

    # If you need authentication some example:
    if auth:
        h.add_credentials(auth.user, auth.password)

    response, content = h.request(
            target.geturl(),
            method,
            body,
            th)
    content=content.replace('\xef\xbb\xbf','')
    # assume that content is a json reply
    # parse content with the json module
    data = json.loads(content)
    return response["status"], data
