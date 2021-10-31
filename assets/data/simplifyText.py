import os,glob

def convertFile(inputFile):

    outputFile = inputFile.replace(".","_2_.")
    rawFile = inputFile.replace(".csv",".raw")

    if (os.path.exists(rawFile)):
        print("Skipping {}".format(inputFile))
        return True

    decimalPlaces = 6
    out = open(outputFile,'w')
    def is_number(s):
        try:
            float(s)
            return True
        except ValueError:
            return False

    with open(inputFile) as f:
        lines = f.readlines()


    for i in lines:
        newLine = ""
        for j in i.split(","):
            j2 = j
            if (is_number(j)):
                j2 = format(float(j), '.{}f'.format(decimalPlaces))
            newLine+=j2+","
        newLine = newLine.rstrip(",")
        out.write(newLine)
        #out.write(",add1,add2")
        out.write("\n")
        print newLine

    f.close()
    out.close()

    os.rename(inputFile,rawFile)
    os.rename(outputFile,outputFile.replace("_2_.","."))

convertFile("lodging.csv")

for i in glob.glob("*.csv"):
    convertFile(i)