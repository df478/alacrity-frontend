import UploaderPlainTextBase from './UploaderPlainTextBase'

export default class UploaderPlainTextAlacranDefinition extends UploaderPlainTextBase {
    protected getPlaceHolderValue() {
        return `{
    "schemaVersion" :2 ,
    "imageName" : "mysql:5.7
}`
    }

    protected convertDataToAlacranDefinition(userEnteredValue: string) {
        return userEnteredValue.trim()
    }
}
