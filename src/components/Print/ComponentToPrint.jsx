
import * as React from "react";
export class ComponentToPrint extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    render() {
        const { text } = this.props;

        return (
            <div className="relativeCSS">
                <style type="text/css" media="print">
                    {"\
   @page { size: landscape; }\
"}
                </style>
                <div className="flash" />
                <table className="print-component" style={{ width: '100%' }}>
                    <thead >
                        <tr>
                            <div style={{ height: '50px', width: '100%', border: '2px solid blue', fontSize: 18, display: 'flex', justifyContent: 'center' }}>
                                Page Header
                            </div>
                        </tr>
                    </thead>
                    <tbody >
                        {text}
                    </tbody>
                    <tfoot className="table-footer">
                        <tr>
                            <td>
                                <div style={{ height: '50px', width: '100%', border: '2px solid blue', fontSize: 18, display: 'flex', justifyContent: 'center' }}>
                                    Page Footer
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        );
    }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
    return <ComponentToPrint ref={ref} text={props.children} />;
});
