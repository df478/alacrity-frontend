import {
    Button,
    Card,
    Collapse,
    CollapseProps,
    Modal,
    Space,
    Typography,
} from 'antd'
import { Component } from 'react'
import Toaster from '../../../../utils/Toaster'
import { AppDetailsTabProps } from './../AppDetails'

import { ExportOutlined } from '@ant-design/icons'
import { localize } from '../../../../utils/Language'

const { Text } = Typography
interface GoAccessReport {
    name: string
    lastModifiedTime: string
    domainName: string
    url: string
}
interface LogReportState {
    reportList: GoAccessReport[]
    reportOpen: string | undefined
    reportHtml: string | undefined
}
export default class GoAccessLogs extends Component<
    AppDetailsTabProps,
    LogReportState
> {
    constructor(props: any) {
        super(props)
        this.state = {
            reportList: [],
            reportOpen: undefined,
            reportHtml: undefined,
        }
    }

    createReportButton(report: GoAccessReport) {
        return (
            <Button
                key={report.name}
                style={{ margin: 5 }}
                onClick={() => this.onReportClick(report)}
            >
                <Space>
                    <Text strong>
                        {new Date(report.lastModifiedTime).toLocaleDateString()}
                    </Text>
                    <Text type="secondary">
                        {new Date(report.lastModifiedTime).toLocaleTimeString(
                            [],
                            {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                            }
                        )}
                    </Text>
                </Space>
            </Button>
        )
    }

    createSiteCard(reports: GoAccessReport[], site: string) {
        const self = this
        reports = reports.filter((report) => report.domainName === site)
        const liveReport = reports.find((report) =>
            report.name.includes('Live')
        )

        if (liveReport) {
            reports = reports.filter(
                (report) => report.name !== liveReport.name
            )
        }

        const items: CollapseProps['items'] = [
            {
                key: 'Past Snapshots' + site,
                label: localize('goaccess.past_snapshots', 'Past Snapshots'),
                children: (
                    <div>
                        {reports.map((report) =>
                            this.createReportButton(report)
                        )}
                    </div>
                ),
            },
        ]

        return (
            <>
                <Card
                    key={site}
                    style={{ marginBottom: 30 }}
                    bordered={true}
                    extra={
                        liveReport && (
                            <Button
                                onClick={() => {
                                    self.onReportClick(liveReport)
                                }}
                            >
                                {localize(
                                    'goaccess.live_logs',
                                    'Open Live Logs'
                                )}{' '}
                                <ExportOutlined />
                            </Button>
                        )
                    }
                    title={site}
                >
                    <div>
                        <Collapse
                            bordered={false}
                            items={items}
                            defaultActiveKey={[]}
                            onChange={() => {}}
                        />
                    </div>
                </Card>
            </>
        )
    }
    render() {
        const sitesSet = new Set<string>()
        this.state.reportList
            .map((report) => report.domainName)
            .forEach((it) => sitesSet.add(it))
        const sites = Array.from(sitesSet)

        return (
            <>
                <div style={{ marginTop: 40 }}>
                    <h3>GoAccess Logs</h3>
                    {sites.map((site) =>
                        this.createSiteCard(this.state.reportList, site)
                    )}
                </div>

                <Modal
                    closable={true}
                    footer={<div />}
                    title={this.state.reportOpen}
                    open={this.state.reportOpen !== undefined}
                    onCancel={() => this.onModalClose()}
                    loading={!this.state.reportHtml}
                    width="90vw"
                    style={{ top: 20 }}
                >
                    {this.state.reportHtml && (
                        <iframe
                            title="GoAccess"
                            style={{
                                width: '100%',
                                minHeight: 'calc(85vh - 20px)',
                            }}
                            srcDoc={this.state.reportHtml}
                        ></iframe>
                    )}
                </Modal>
            </>
        )
    }

    componentDidMount() {
        this.reFetchData()
    }

    reFetchData() {
        const self = this
        this.props.setLoading(true)

        this.props.apiManager
            .getGoAccessReports(this.props.apiData!.appDefinition.appName!)
            .then((response) => {
                self.setState({ reportList: response })
            })
            .catch(Toaster.createCatcher())
            .then(() => {
                self.props.setLoading(false)
            })
    }

    onReportClick(report: GoAccessReport) {
        const reportUrl = report.url
        this.setState({ reportOpen: report.name })

        fetch(`https://alacran.alacran.codelabnow.tech/api/v1/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-namespace': 'alacran',
            },
            body: new URLSearchParams({
                password: 'alacran42',
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Login failed: ${response.status}`)
                }
                return response.json()
            })
            .then((loginData: any) => {
                const token = loginData.data.token
                if (!token) {
                    throw new Error('No token returned from login')
                }

                return fetch(
                    `https://alacran.alacran.codelabnow.tech/api/v1` +
                        reportUrl,
                    {
                        method: 'GET',
                        headers: {
                            'x-alacran-auth': token,
                            'Content-Type': 'application/json',
                            'x-namespace': 'alacran',
                        },
                    }
                )
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Fetch report failed: ${response.status}`)
                }
                return response.text()
            })
            .then((html: string) => {
                const modifiedHtml = html.replace(
                    '</head>',
                    `<style>.nav-bars{ display: none;} nav .nav-gears{ top: 30px;}</style></head>`
                )
                this.setState({ reportHtml: modifiedHtml })
            })
            .catch((error) => {
                Toaster.toastError(error)
                this.setState({ reportOpen: undefined })
            })
    }

    onModalClose() {
        this.setState({ reportOpen: undefined, reportHtml: undefined })
    }
}
