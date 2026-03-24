import * as React from "react";

export class ComponentToPrint extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const { text } = this.props;

        return (
            <div className="relativeCSS">
                <style type="text/css" media="print">
                    {`
                        @page {
                            size: A4 portrait;
                            margin: 16mm;
                        }
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        .header { display: none; }
                        .footer { display: none; }
                        .print-wrapper { margin: 0; }
                    `}
                </style>
                <div className="header">Header Content</div>
                <div className="print-wrapper">
                    <div className="content">{text}</div>
                </div>
                <div className="footer">Footer Content</div>
            </div>
        );
    }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
    return <ComponentToPrint ref={ref} text={props.children} />;
});
