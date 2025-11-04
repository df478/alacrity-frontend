import { BarsOutlined, GlobalOutlined, LogoutOutlined } from '@ant-design/icons'
import { Button, Col, Layout, Row } from 'antd'
import React, { RefObject } from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch } from 'react-router'
import ApiManager from '../api/ApiManager'
import * as GlobalActions from '../redux/actions/GlobalActions'
import { localize } from '../utils/Language'
import StorageHelper from '../utils/StorageHelper'
import Dashboard from './Dashboard'
import LoggedInCatchAll from './LoggedInCatchAll'
import Sidebar from './Sidebar'
import Apps from './apps/Apps'
import ProjectDetailsEdit from './apps/ProjectDetailsEdit'
import AppDetails from './apps/appDetails/AppDetails'
import ApiComponent from './global/ApiComponent'
import DarkModeSwitch from './global/DarkModeSwitch'
import LanguageSelector from './global/LanguageSelector'
import NewTabLink from './global/NewTabLink'
import Maintenance from './maintenance/Maintenance'
import Monitoring from './monitoring/Monitoring'
import Cluster from './nodes/Cluster'
import Settings from './settings/Settings'

const { Header, Content } = Layout

interface RootPageInterface extends RouteComponentProps<any> {
    rootElementKey: string
    emitSizeChanged: () => void
    isMobile: boolean
}

class PageRoot extends ApiComponent<
    RootPageInterface,
    {
        collapsed: boolean
        showLanguageSelector: boolean
    }
> {
    private mainContainer: RefObject<HTMLDivElement>

    constructor(props: any) {
        super(props)
        this.mainContainer = React.createRef()
        this.state = {
            collapsed: false,
            showLanguageSelector: false,
        }
    }

    updateDimensions = () => this.props.emitSizeChanged()

    componentWillUnmount() {
        // @ts-ignore
        if (super.componentWillUnmount) super.componentWillUnmount()
        this.updateDimensions()
        window.removeEventListener('resize', this.updateDimensions)
    }

    componentDidUpdate(prevProps: any) {
        // Typical usage (don't forget to compare props):
        if (
            this.props.location.pathname !== prevProps.location.pathname &&
            this.props.isMobile
        ) {
            this.setState({ collapsed: true })
        }
    }

    componentDidMount() {
        this.updateDimensions()

        window.addEventListener('resize', this.updateDimensions)

        if (!ApiManager.isLoggedIn()) {
            this.goToLogin()
        } else {
            this.setState({
                collapsed:
                    StorageHelper.getSiderCollapsedStateFromLocalStorage(),
            })
        }
    }

    goToLogin() {
        this.props.history.push('/login')
    }

    toggleSider = () => {
        StorageHelper.setSiderCollapsedStateInLocalStorage(
            !this.state.collapsed
        )
        this.setState({ collapsed: !this.state.collapsed })
    }

    render() {
        const self = this

        return (
            <Layout className="full-screen" key={self.props.rootElementKey}>
                <Header
                    className="header"
                    style={{
                        padding: `0 ${this.props.isMobile ? 15 : 50}px`,
                    }}
                >
                    <Row>
                        {this.props.isMobile && (
                            <Col span={4}>
                                <Button
                                    ghost
                                    icon={<BarsOutlined />}
                                    onClick={this.toggleSider}
                                />
                            </Col>
                        )}
                        {this.props.isMobile || (
                            <Col lg={{ span: 12 }} xs={{ span: 12 }}>
                                <Row align="middle">
                                    <img
                                        alt="logo"
                                        src="/icon-512x512.png"
                                        style={{
                                            height: 45,
                                            marginInlineEnd: 10,
                                        }}
                                    />
                                    <h3 style={{ color: '#fff', margin: 0 }}>
                                        AlaCrity
                                    </h3>
                                </Row>
                            </Col>
                        )}
                        {!self.props.isMobile && (
                            <Col span={12}>
                                <Row justify="end">
                                    <NewTabLink url="https://github.com/df478/alacrity">
                                        <span style={{ marginInlineEnd: 20 }}>
                                            {localize(
                                                'page_root.github_link',
                                                'Github'
                                            )}
                                        </span>
                                    </NewTabLink>

                                    <span
                                        style={{
                                            marginInlineEnd: 30,
                                        }}
                                    >
                                        <NewTabLink url="https://alacrity-website.vercel.app/">
                                            {localize(
                                                'page_root.docs_link',
                                                'Docs'
                                            )}
                                        </NewTabLink>
                                    </span>
                                    <span
                                        style={{
                                            marginInlineEnd: 20,
                                        }}
                                    >
                                        <DarkModeSwitch />
                                    </span>
                                    <span
                                        style={{
                                            marginInlineEnd: 50,
                                        }}
                                    >
                                        {self.createLanguageSelector()}
                                    </span>
                                    <span>
                                        <Button
                                            type="primary"
                                            ghost
                                            onClick={() => {
                                                ApiManager.clearAuthKeys()
                                                self.goToLogin()
                                            }}
                                        >
                                            {localize(
                                                'page_root.logout',
                                                'Logout'
                                            )}
                                            <LogoutOutlined />
                                        </Button>
                                    </span>
                                </Row>
                            </Col>
                        )}
                    </Row>
                </Header>

                <Layout>
                    <Sidebar
                        isMobile={this.props.isMobile}
                        collapsed={this.state.collapsed}
                        toggleSider={this.toggleSider}
                        location={this.props.location}
                        history={this.props.history}
                        onLogoutClicked={() => {
                            ApiManager.clearAuthKeys()
                            self.goToLogin()
                        }}
                    />
                    <Content>
                        <div
                            ref={self.mainContainer}
                            style={{
                                paddingTop: 12,
                                paddingBottom: 36,
                                height: '100%',
                                overflowY: 'scroll',
                                marginInlineEnd: self.state.collapsed
                                    ? 0
                                    : self.props.isMobile
                                      ? -200
                                      : 0,
                                transition: 'margin-right 0.3s ease',
                            }}
                            id="main-content-layout"
                        >
                            <Switch>
                                <Route
                                    path="/dashboard/"
                                    component={Dashboard}
                                />

                                <Route
                                    path="/apps/projects/new"
                                    render={(props) => (
                                        <ProjectDetailsEdit
                                            {...props}
                                            createNewProject={true}
                                            mainContainer={self.mainContainer}
                                        />
                                    )}
                                />

                                <Route
                                    path="/apps/projects/:projectId"
                                    render={(props) => (
                                        <ProjectDetailsEdit
                                            {...props}
                                            createNewProject={false}
                                            mainContainer={self.mainContainer}
                                        />
                                    )}
                                />
                                <Route
                                    path="/apps/details/:appName"
                                    render={(props) => (
                                        <AppDetails
                                            {...props}
                                            mainContainer={self.mainContainer}
                                        />
                                    )}
                                />
                                <Route path="/apps/" component={Apps} />
                                <Route
                                    path="/monitoring/"
                                    component={Monitoring}
                                />
                                <Route path="/cluster/" component={Cluster} />
                                <Route
                                    path="/maintenance/"
                                    component={Maintenance}
                                />
                                <Route path="/settings/" component={Settings} />
                                <Route path="/" component={LoggedInCatchAll} />
                            </Switch>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        )
    }
    createLanguageSelector(): React.ReactNode {
        const self = this
        return self.state.showLanguageSelector ? (
            <LanguageSelector />
        ) : (
            <Button
                onClick={() => self.setState({ showLanguageSelector: true })}
                shape="circle"
                icon={<GlobalOutlined />}
            />
        )
    }
}

function mapStateToProps(state: any) {
    return {
        rootElementKey: state.globalReducer.rootElementKey,
        isMobile: state.globalReducer.isMobile,
    }
}

export default connect(mapStateToProps, {
    emitSizeChanged: GlobalActions.emitSizeChanged,
})(PageRoot)
