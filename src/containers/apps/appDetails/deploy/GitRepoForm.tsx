import { Col, Input, Row } from 'antd'
import { Component } from 'react'
import Utils from '../../../../utils/Utils'
import PasswordField from '../../../global/PasswordField'
import { RepoInfo } from '../../AppDefinition'

export default class GitRepoForm extends Component<{
    gitRepoValues: RepoInfo
    updateRepoInfo: (newRepoInfo: RepoInfo) => void
}> {
    render() {
        return (
            <div>
                <form action="/" autoComplete="off">
                    <Row gutter={20}>
                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Input
                                style={{ marginBottom: 20 }}
                                value={this.props.gitRepoValues.repo}
                                addonBefore="Repository"
                                placeholder="github.com/someone/something"
                                type="url"
                                spellCheck={false}
                                autoCorrect="off"
                                autoComplete="off"
                                autoCapitalize="off"
                                onChange={(e) => {
                                    const newObj = Utils.copyObject(
                                        this.props.gitRepoValues
                                    )
                                    newObj.repo = e.target.value
                                    this.props.updateRepoInfo(newObj)
                                }}
                            />
                        </Col>
                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                            <Input
                                style={{ marginBottom: 20 }}
                                value={this.props.gitRepoValues.branch}
                                addonBefore={
                                    <span>Branch&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                }
                                placeholder="master"
                                type="text"
                                spellCheck={false}
                                autoCorrect="off"
                                autoComplete="off"
                                autoCapitalize="off"
                                onChange={(e) => {
                                    const newObj = Utils.copyObject(
                                        this.props.gitRepoValues
                                    )
                                    newObj.branch = e.target.value
                                    this.props.updateRepoInfo(newObj)
                                }}
                            />
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            lg={{ span: 12 }}
                            className={
                                this.props.gitRepoValues.sshKey
                                    ? 'hide-on-demand'
                                    : ''
                            }
                        >
                            <Input
                                style={{ marginBottom: 20 }}
                                value={this.props.gitRepoValues.user}
                                addonBefore={<span>Username&nbsp;</span>}
                                placeholder="mygithubuser"
                                type="email"
                                onChange={(e) => {
                                    const newObj = Utils.copyObject(
                                        this.props.gitRepoValues
                                    )
                                    newObj.user = e.target.value
                                    this.props.updateRepoInfo(newObj)
                                }}
                            />
                        </Col>
                        <Col
                            xs={{ span: 24 }}
                            lg={{ span: 12 }}
                            className={
                                this.props.gitRepoValues.sshKey
                                    ? 'hide-on-demand'
                                    : ''
                            }
                        >
                            <PasswordField
                                defaultValue={this.props.gitRepoValues.password}
                                addonBefore="Password"
                                placeholder="123456"
                                onChange={(e) => {
                                    const newObj = Utils.copyObject(
                                        this.props.gitRepoValues
                                    )
                                    newObj.password = e.target.value
                                    this.props.updateRepoInfo(newObj)
                                }}
                            />
                        </Col>
                    </Row>
                </form>
            </div>
        )
    }
}
