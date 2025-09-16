import { IAlacranDefinition } from '../../../../models/IAlacranDefinition'
import UploaderPlainTextBase from './UploaderPlainTextBase'

export default class UploaderPlainTextImageName extends UploaderPlainTextBase {
    protected getPlaceHolderValue() {
        return `nginxdemos/hello:latest`
    }

    protected isSingleLine() {
        return true
    }

    protected convertDataToAlacranDefinition(userEnteredValue: string) {
        const capDefinition: IAlacranDefinition = {
            schemaVersion: 2,
            imageName: userEnteredValue.trim(),
        }

        return JSON.stringify(capDefinition)
    }
}
