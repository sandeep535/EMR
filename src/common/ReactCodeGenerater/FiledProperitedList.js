const dynamicComponentCommonProps = [{
    key: 'gridSize',
    displaylabel: 'Size',
    value: 6
}];
const apiCallFileds = [{
    key: 'url',
    displaylabel: 'Url',
    value: "",
}, {
    key: 'method',
    displaylabel: 'Method',
    value: "",
}, {
    key: 'paramas',
    displaylabel: 'paramas',
    value: [],
}, {
    key: 'stateKey',
    displaylabel: 'State',
    value: "",
}, {
    key: 'triggerpoint',
    displaylabel: 'Trigger on',
    options: [{
        id: 1,
        value: "onload"
    }, {
        id: 2,
        value: "change"
    }],
    value: "",
}];
const FiledProperitedList = {
    "SLTextField": {
        "label": 'Text filed',
        "icon": 'text_fields',
        "type": 'SLTextField',
        "isControl": true,
        "props": [{
            key: 'name',
            displaylabel: 'Name',
            value: 'Sample1'
        }, {
            key: 'placeholder',
            displaylabel: 'Place Holder',
            value: 'Sample1'
        }, {
            key: 'label',
            displaylabel: 'Label',
            value: 'Sample1'
        }],
        "dynamicComponentProps": dynamicComponentCommonProps
    },
    "SLTitle": {
        "label": 'Title',
        "icon": 'titlecase',
        "type": 'SLTitle',
        "props": [{
            key: 'variant',
            displaylabel: 'Variant',
            value: 'h1'
        }, {
            key: 'title',
            displaylabel: 'Heading',
            value: 'Heading'
        }, {
            key: 'justifyContent',
            displaylabel: 'Allign',
            value: 'left'
        },{
            key: 'multiline',
            displaylabel: 'is Multiline',
            value: 'false'
        },{
            key: 'rows',
            displaylabel: 'Rows',
            value: '1'
        }],
        "dynamicComponentProps": dynamicComponentCommonProps
    },
    "SLFORM": {
        "label": 'Form/Container',
        "icon": 'titlecase',
        "type": 'SLFORM',
        "props": [{
            key: 'name',
            displaylabel: 'Name',
            value: ''
        },{
            key: 'forapi',
            displaylabel: 'Form Submit',
            isStateValue: true,
            value: [],
            apiCallForState: {
                key: 'apiEndpoint',
                displaylabel: 'API',
                isDynamicObject: true,
                onload:1,
                value: {
                    METHOD: "",
                    URL: "",
                },
            },
        },{
            key: 'Styles',
            displaylabel: 'Variant',
            isDynamicObject: true,
            value: {
                CSSProp: "",
                value: "",
            }
        }],
        "dynamicComponentProps": dynamicComponentCommonProps
    },
    "SLSelectDropDown": {
        "label": 'Drop Down',
        "icon": 'open_in_new',
        "type": 'SLSelectDropDown',
        "isControl": true,
        "props": [{
            key: 'name',
            displaylabel: 'Name',
            value: 'Sample'
        }, {
            key: 'label',
            displaylabel: 'label',
            value: 'Sample'
        }, {
            key: 'options',
            displaylabel: 'Options State',
            isStateValue: true,
            value: [],
            apiCallForState: {
                key: 'apiEndpoint',
                displaylabel: 'API',
                isDynamicObject: true,
                value: {
                    METHOD: "",
                    URL: "",
                    PARAM:""
                  
                },
            },
        }, {
            key: 'mapvalues',
            displaylabel: 'Map values',
            isDynamicObject: true,
            value: {
                id: "",
                value: ""
            },
        }, {
            key: 'onchangeEventCallBack',
            displaylabel: 'Call Back After Select',
            isMethod: true,
            value: "",
        }],
        "dynamicComponentProps": dynamicComponentCommonProps
    },
    "SLRadioButton": {
        "label": 'Radio',
        "icon": 'radio_button_checked',
        "type": 'SLRadioButton',
        "isControl": true,
        "props": [{
            key: 'name',
            displaylabel: 'Name',
            value: 'Sample'
        }, {
            key: 'label',
            displaylabel: 'label',
            value: 'Sample'
        }, {
            key: 'options',
            isApiCall: 'NO',
            displaylabel: 'Options',
            isDynamicArray: true,
            value: [{
                id: '',
                value: ''
            }]
        }],
        "dynamicComponentProps": dynamicComponentCommonProps
    },
    "SLCheckbox": {
        "label": 'Check Box',
        "icon": 'library_add',
        "type": 'SLCheckbox',
        "isControl": true,
        "props": [{
            key: 'name',
            displaylabel: 'Name',
            value: 'Sample'
        }, {
            key: 'options',
            displaylabel: 'Options',
            value: [{
                label: "",
                value: "",
            }],
            isDynamicArray: true,

        }],
        "dynamicComponentProps": dynamicComponentCommonProps
    },
    "SLAutocomplete": {
        "label": 'Auto Complte ',
        "icon": 'library_add',
        "type": 'SLAutocomplete',
        "isControl": true,
        "props": [{
            key: 'name',
            displaylabel: 'Name',
            value: 'Sample'
        }, {
            key: 'label',
            displaylabel: 'label',
            value: 'Sample'
        }, {
            key: 'mapvalues',
            displaylabel: 'Map values',
            isDynamicObject: true,
            value: {
                id: "",
                value: ""
            },
        }, {
            key: 'apiEndpoint',
            displaylabel: 'API',
            isDynamicObject: true,
            value: {
                METHOD: "",
                URL: ""
            },
        }],
        "dynamicComponentProps": dynamicComponentCommonProps
    },
    "CustomDataGrid": {
        "label": 'Table',
        "icon": 'library_add',
        "type": 'CustomDataGrid',
        "isControl": false,
        "props": [{
            key: 'tableHeaders',
            displaylabel: 'Headers:',
            value: [{
                name: "",
                datakey: "",
                width:"",
                mappingData:"",
                actions:[]
            }],
            isDynamicArray: true,
        }, {
            key: 'tableData',
            displaylabel: 'Data',
            isStateValue: true,
            apiCallForState: {
                key: 'apiEndpoint',
                displaylabel: 'API',
                isDynamicObject: true,
                value: {
                    METHOD: "",
                    URL: "",
                    PARAM:""
                },
            },
            value: []
        }, {
            key: 'totalcount',
            displaylabel: 'Total Count',
            isStateValue: true,
            value: ""
        }, {
            key: 'rowsPerPage',
            displaylabel: 'Page Size',
            isStateValue: true,
            value: 0,
        },{
            key: 'paginationChangeEvent',
            displaylabel: 'after select page call back',
            isMethod: true,
            value: "",
        },{
            key: 'triggerEvent',
            displaylabel: 'selected icon',
            isMethod: true,
            value: "",
        }],
        "dynamicComponentProps": dynamicComponentCommonProps
    }
}


export default FiledProperitedList;