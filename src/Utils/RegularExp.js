const RegularExp={
    ALLOW_ONLY_NUMBERS_WITH_DICIMALS:/(?<=^| )\d+(\.\d+)?(?=$| )|(?<=^| )\.\d+(?=$| )/,
    ALLOW_ONLY_NUMBERS_WITH_TWO_DIDGITS:/^\d+\.\d{1,2}$/g
}
export default RegularExp;