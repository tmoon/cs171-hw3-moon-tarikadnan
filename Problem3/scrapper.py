from lxml import html, cssselect
import requests

if __name__ == '__main__':
	link = 'http://unglobalpulse.net/ewec/'
	page = requests.get(link)
	tree = html.fromstring(page.text)

	table = tree.cssselect('table')[0]
	rows = table.cssselect('tr')
	start = False

	f = open('data.csv','w')
	
	f.write('date,count\n')
	for row in (rows[1:]):
		blocks = row.cssselect('td') # take first five cols
		f.write(blocks[0].text_content()+',')
		num = blocks[3]. text_content().replace(',','')
		f.write(num+'\n')