import React, {useMemo} from 'react';
import {parseDiff, Diff, Hunk} from 'react-diff-view';
import tokenize from './tokenize';
import {diffLines, formatLines} from 'unidiff';
import 'react-diff-view/style/index.css';
import Container from 'react-bootstrap/esm/Container';

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
    const diffText = formatLines(diffLines(props.oldStr, props.newStr), {context: 3});
    const [diffArr] = parseDiff(diffText, {nearbySequences: 'zip'});
    const diff = diffArr
    
    const type = diff.type
    const hunks = diff.hunks
    const tokens = useMemo(() => tokenize(hunks), [hunks]);
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