import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Switch, Route, IndexRedirect, Redirect} from "react-router-dom"

import { isLoggedIn } from '../../utils/login.js'

import Topbar from "../../components/Topbar";

import Errors from '../../containers/Errors'

// import getMuiTheme from 'material-ui/styles/getMuiTheme';
import getMuiTheme from '../../containers/App/muitheme.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { HotKeys } from 'react-hotkeys'


// import CollectionOverview from "../CollectionOverview"
import NodeView from '../NodeView'
import CollectionDetailEditor from '../CollectionDetailEditor'
import NodeExploreEditor from '../NodeExploreEditor'

import SourceDetail from '../../components/SourceDetail'

import ErrorBoundary from '../ErrorPage'

const keyMapping = {
    'escape': 'esc',
    'explore': 'ctrl+alt+e',
    'addRelation': 'ctrl+alt+r',
    'duplicate': 'ctrl+alt+d',
    'trash': 'ctrl+alt+g',
    'addCollection': 'ctrl+alt+c',
    'focusSearch': 'ctrl+alt+f',
    "navigateMode": "n",
    "editMode": "e",
    "abstractMode": "a",
    "focusMode": "f",
    "deleteMode": "d"
}

class App extends React.Component {

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        if (window.ga) {
            this.props.history.listen((location) => {
                window.ga('set', 'page', location.pathname + location.search);
                window.ga('send', 'pageview')
            })
        }
    }

    render() {
        const { match, location, isLoggedIn, rootCollectionId } = this.props

        return (
            <ErrorBoundary>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <HotKeys keyMap={keyMapping}>
                        <div style={{display: 'flex', flexDirection: 'column' }}>
                            <Errors />
                            <Topbar />

                            <Switch>
                                <Route exact path={'/app/sources'} component={SourceDetail} />

                                <Route exact path={'/app/nodes/:nodeId/edit'} component={NodeExploreEditor} />
                                <Route exact path={'/app/nodes/:nodeId/edit'} component={NodeExploreEditor} />
                                <Route exact path={'/app/nodes/:focusNodeId/graph'} component={NodeView} />
                                { /* focusNode is the focused node in the graph, node is the node that is edited */ }
                                <Route exact path={'/app/nodes/:focusNodeId/graph/:nodeId'} component={NodeView}/>

                                <Route exact path={'/app/nodes'} render={(props) => (
                                    <Redirect to={{
                                        pathname: `/app/nodes/${rootCollectionId}/graph`,
                                        search: props.location.search
                                    }} />
                                )}/>

                                <Route path="/app" render={(props) => (
                                    <Redirect to={{
                                        pathname: '/app/nodes',
                                        search: props.location.search
                                    }} />
                                )} />
                            </Switch>
                        </div>
                    </HotKeys>
                </MuiThemeProvider>
            </ErrorBoundary>
        )
    }
}

function mapStateToProps(state, props) {
    return {
        isLoggedIn: isLoggedIn(),
        rootCollectionId: state.user.rootCollectionId,
    }
}

export default connect(mapStateToProps, {})(withRouter(App))
