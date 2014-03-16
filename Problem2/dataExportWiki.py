from lxml import html, cssselect
import requests

if __name__ == '__main__':
	link = 'http://en.wikipedia.org/wiki/World_population_estimates'
	page = requests.get(link)
	tree = html.fromstring(page.text)

	table = tree.cssselect('table')[0]
	rows = table.cssselect('tr')
	start = False

	f = open('data.csv','w')
	f.write('year,USCensus,PopulationBureau,UN,HYDE,Maddison\n')
	for row in (rows[1:]):
		blocks = row.cssselect('td')[:6] # take first five cols
		
		# start at year 0
		try:
			if int(blocks[0].text_content() ) == 0:
				start = True
		except Exception, e:
			print 'Error handling'

		if not start:
			continue
		line = ''
		for b in blocks:
			num = ''
			if b.text_content() == '':
				num='-1'
			else:
				b_num = b.text_content()
				num = ''
				for d in b_num:
					if d.isdigit():
						num += d
			line += num+','
		f.write(line[:-1]+'\n')