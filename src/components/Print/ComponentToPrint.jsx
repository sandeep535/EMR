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
                            size: landscape;
                        
                        }
                        .header {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 50px; /* Adjust as needed */
                            background: #f8f9fa;
                            text-align: center;
                            border-bottom: 1px solid #ddd;
                            padding: 10px;
                        }
                        .footer {
                            position: fixed;
                            bottom: 0;
                            left: 0;
                            width: 100%;
                            height: 50px; /* Adjust as needed */
                            background: #f8f9fa;
                            text-align: center;
                            border-top: 1px solid #ddd;
                            padding: 10px;
                        }
                        .print-wrapper {
                            margin-top: 60px; /* Match header height */
                            margin-bottom: 60px; /* Match footer height */
                        }
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
