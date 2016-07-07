import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import Input from "metabase/components/Input.jsx";
import HeaderModal from "metabase/components/HeaderModal.jsx";

export default class Header extends Component {
    static defaultProps = {
        headerButtons: [],
        editingTitle: "",
        editingSubtitle: "",
        editingButtons: [],
        headerClassName: "py1 lg-py2 xl-py3 wrapper"
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            headerHeight: 0
        };
    }

    componentDidMount() {
        this.componentDidUpdate();
    }
    componentDidUpdate() {
        if (this.refs.header) {
            const rect = ReactDOM.findDOMNode(this.refs.header).getBoundingClientRect();
            const headerHeight = rect.top + window.scrollY;
            if (this.state.headerHeight !== headerHeight) {
                this.setState({ headerHeight });
            }
        }
    }

    setItemAttribute(attribute, event) {
        this.props.setItemAttributeFn(attribute, event.target.value);
    }

    renderEditHeader() {
        if (this.props.isEditing) {
            return (
                <div className="EditHeader wrapper py1 flex align-center" ref="editHeader">
                    <span className="EditHeader-title">{this.props.editingTitle}</span>
                    <span className="EditHeader-subtitle mx1">{this.props.editingSubtitle}</span>
                    <span className="flex-align-right">
                        {this.props.editingButtons}
                    </span>
                </div>
            );
        }
    }

    renderHeaderModal() {
        return (
            <HeaderModal
                isOpen={!!this.props.headerModalMessage}
                height={this.state.headerHeight}
                title={this.props.headerModalMessage}
                onDone={this.props.onHeaderModalDone}
                onCancel={this.props.onHeaderModalCancel}
            />
        );
    }

    render() {
        var titleAndDescription;
        if (this.props.isEditingInfo) {
            titleAndDescription = (
                <div className="Header-title flex flex-column flex-full bordered rounded my1">
                    <Input className="AdminInput text-bold border-bottom rounded-top h3" type="text" value={this.props.item.name} onChange={this.setItemAttribute.bind(this, "name")}/>
                    <Input className="AdminInput rounded-bottom h4" type="text" value={this.props.item.description} onChange={this.setItemAttribute.bind(this, "description")} placeholder="No description yet" />
                </div>
            );
        } else {
            if (this.props.item && this.props.item.id != null) {
                titleAndDescription = (
                    <div className="Header-title my1 py2">
                        <h2 className="Header-title-name">{this.props.item.name}</h2>
                        <h4 className="Header-title-description text-grey-3">{this.props.item.description || "No description yet"}</h4>
                    </div>
                );
            } else {
                titleAndDescription = (
                    <div className="Header-title flex align-center">
                        <h1 className="Header-title-name my1">{"New " + this.props.objectType}</h1>
                    </div>
                );
            }
        }

        var attribution;
        if (this.props.item && this.props.item.creator) {
            attribution = (
                <div className="Header-attribution">
                    Asked by {this.props.item.creator.common_name}
                </div>
            );
        }

        var headerButtons = this.props.headerButtons.map((section, sectionIndex) => {
            return section && section.length > 0 && (
                <span key={sectionIndex} className="Header-buttonSection flex align-center">
                    {section.map((button, buttonIndex) =>
                        <span key={buttonIndex} className="Header-button">
                            {button}
                        </span>
                    )}
                </span>
            );
        });

        return (
            <div>
                {this.renderEditHeader()}
                {this.renderHeaderModal()}
                <div className={"QueryBuilder-section flex align-center " + this.props.headerClassName} ref="header">
                    <div className="Entity">
                        {titleAndDescription}
                        {attribution}
                    </div>

                    <div className="flex align-center flex-align-right">
                        {headerButtons}
                    </div>
                </div>
                {this.props.children}
            </div>
        );
    }
}