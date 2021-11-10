import React, {useState, useCallback, useMemo} from 'react';
import {parseDiff, Diff, Hunk} from 'react-diff-view';
import tokenize from './tokenize';
import {diffLines, formatLines} from 'unidiff';
import 'react-diff-view/style/index.css';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

const EMPTY_HUNKS = [];

const renderToken = (token, defaultRender, i) => {
    switch (token.type) {
        case 'space':
            console.log(token);
            return (
                <span key={i} className="space">
                    {token.children && token.children.map((token, i) => renderToken(token, defaultRender, i))}
                </span>
            );
        default:
            return defaultRender(token, i);
    }
};

function DiffView (props){
    //var diff = formatLines(diffLines(props.oldStr, props.newStr), {context: 2});
    //console.log(diff)
    //const files = parseDiff(diff);

    const diffText = formatLines(diffLines(props.oldStr, props.newStr), {context: 3});
    const [diffArr] = parseDiff(diffText, {nearbySequences: 'zip'});
    const diff = diffArr
    
    const type = diff.type
    const hunks = diff.hunks
    const tokens = useMemo(() => tokenize(hunks), [hunks]);
    //const renderFile = ({oldRevision, newRevision, type, hunks}) => (
    //    <Diff key={oldRevision + '-' + newRevision} viewType="split" diffType={type} hunks={hunks} tokens={tokens} renderToken={renderToken}>
    //        {hunks => hunks.map(hunk => <Hunk key={hunk.content} hunk={hunk} />)}
    //    </Diff>
    //);
    console.log(diff)
    return (
        <div style={{color:"black"}}>
            <Container className = "bt-5"style={{backgroundColor:"white"}}>
                <p style={{color:"black", marginBottom:0,borderBottom:"solid"}}><b>Code Diff</b></p>
            </Container>
            <Container className="mb-3" style={{backgroundColor:"white"}}>
                <Diff
                    viewType="unified"
                    diffType={type}
                    hunks={hunks || EMPTY_HUNKS}
                    tokens={tokens}
                    renderToken={renderToken}
                >
                    {hunks => hunks.map(hunk => <Hunk key={hunk.content} hunk={hunk} />)}
                </Diff>
            </Container>
        </div>
    );
};

export default DiffView;