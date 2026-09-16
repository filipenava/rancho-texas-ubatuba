import requests
from pathlib import Path
from bs4 import BeautifulSoup
s=Path('research/home.html').read_text(encoding='utf8')
i=s.find('function Salvar')
for match in ['a +=', 'var o =', 'child_age_input, #ag']:
    i=s.find(match,s.find('idadelabel'))
    print(s[max(0,i-220):i+500])
url='https://book.omnibees.com/hotelresults?c=6369&q=10889&lang=pt-BR&currencyId=16&CheckIn=12112026&CheckOut=15112026&NRooms=1&ad=2&ch=2&ag=0%3B8'
r=requests.get(url,headers={'User-Agent':'Mozilla/5.0'},timeout=40)
Path('research/omnibees.html').write_bytes(r.content)
doc=BeautifulSoup(r.content,'html.parser')
print('Engine response:',r.status_code)
print('Title:',doc.title.get_text() if doc.title else '')
for inp in doc.select('input[name],select[name]'):
    name=inp.get('name','')
    if name.lower() in ['ag','ch','ad','q','c','checkin','checkout','nrooms']:
        print(str(inp)[:1500])
print('Rancho identity:', 'Rancho Texas' in r.text)
