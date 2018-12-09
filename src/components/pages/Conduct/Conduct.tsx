import * as React from 'react';

export default class CodeOfConduct extends React.PureComponent {

    private conduct;

    constructor(props: any) {
        super(props);

        this.conduct = require('../../../assets/code_of_conduct.md');
    }

    render() {
        return(
            <div className="container code-of-conduct"
                dangerouslySetInnerHTML={{ __html: this.conduct }} />
        );
    }

}