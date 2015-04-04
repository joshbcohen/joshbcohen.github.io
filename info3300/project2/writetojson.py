import json
import csv

def main():
	dictobject = {}
	statelist = []

	for num in xrange(1990, 2011):
		dictobject[str(num)] = {}

	with open('generation_annual.csv', 'rU') as generationfile:
		generationreader = csv.reader(generationfile)
		for row in generationreader:
			if ((row[1] != '  ') and (row[1] != 'STATE_CODE')):
				statelist.append(row[1])

	stateset = sorted(set(statelist))

	for obj in dictobject:
		for state in stateset:
			dictobject[obj][state] = {}


	with open('generation_annual.csv', 'rU') as generationfile:
		generationreader = csv.reader(generationfile)
		for row in generationreader:
			if ((row[0] != 'YEAR') 
				and (row[1] !=  '  ')
				and (row[1] != 'STATE_CODE')
				and (dictobject[row[0]][row[1]].get(row[2]) == None)):
				dictobject[row[0]][row[1]][row[2]] = {}

	with open('generation_annual.csv', 'rU') as generationfile:
		generationreader = csv.reader(generationfile)
		for row in generationreader:
			if ((row[0] != 'YEAR') 
				and (row[1] !=  '  ')
				and (row[1] != 'STATE_CODE')):
				dictobject[row[0]][row[1]][row[2]].update({row[3] : row[4]})

	with open('generation_annual.json', 'w') as generationjson:
		json.dump(dictobject, generationjson, sort_keys = True, indent = 4, separators =(',', ': '))


	
			

	
	generationfile.close()


		

if __name__ == "__main__":
	main()
