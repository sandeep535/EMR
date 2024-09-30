
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
                <div className="print-wrapper">
                    <div className="header" >Header Content</div>
                    <div className="content">{text}</div>

                    <div className="footer">Footer Content</div>
                </div>

            </div>
        );
    }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
    return <ComponentToPrint ref={ref} text={props.children} />;
});
