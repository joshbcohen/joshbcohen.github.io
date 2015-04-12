import json
import csv


def main():
    dictobject = {}
    state_list = []
    year_list = []

    for num in xrange(1990, 2011):
        dictobject[str(num)] = {}

    with open('generation_annual.csv', 'rU') as generationcsv:
        generationreader = csv.reader(generationcsv)
        for row in generationreader:
            if (row[0] != 'YEAR'):
                year_list.append(row[0])
            if ((row[1] != '  ') and (row[1] != 'STATE_CODE')):
                state_list.append(row[1])

    year_set = sorted(set(year_list))
    state_set = sorted(set(state_list))

    for year in year_set:
        dictobject[year] = {}
        for state in state_set:
            dictobject[year][state] = {}

    with open('generation_annual.csv', 'rU') as generationcsv:
        generationreader = csv.reader(generationcsv)
        for row in generationreader:
            if ((row[0] != 'YEAR') and
                    (row[1] != '  ') and
                    (row[1] != 'STATE_CODE') and
                    (row[2] == 'Total Electric Power Industry')):
                dictobject[row[0]][row[1]].update({row[3]: row[4]})

    with open('generation_annual.json', 'w') as generationjson:
        json.dump(dictobject, generationjson, sort_keys=True, indent=4, separators=(',', ': '))
        generationjson.write('\n')

    generationcsv.close()
    generationjson.close()

if __name__ == "__main__":
    main()
