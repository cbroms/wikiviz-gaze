import React from "react";
import parse, { domToReact } from "html-react-parser";

class WikiContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            wikiTarget: "Pittsburgh",
        };

        this.getWikiPage = this.getWikiPage.bind(this);
    }

    componentDidMount() {
        this.getWikiPage();
    }

    getWikiPage() {
        //    console.log("fetch ", this.state.wikiTarget);
        fetch(
            `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${this.state.wikiTarget}&origin=*`
        )
            .then((value) => {
                return value.json();
            })
            .then((data) => {
                if (data.parse && data.parse.sections.length === 0) {
                    // page is a redirect, extract the new target
                    const redir = data.parse.text["*"].match(
                        /\/wiki\/([A-Z])\w+/
                    )[0];

                    const newLoc = redir.substr(
                        redir.lastIndexOf("/") + 1,
                        redir.length
                    );

                    this.setState({ wikiTarget: newLoc }, () => {
                        this.getWikiPage();
                    });
                } else if (data.parse) {
                    try {
                        // parse the content and set it in state
                        const parsed = parse(data.parse.text["*"]);
                        this.setState({
                            title: data.parse.title,
                            content: parsed,
                        });

                        // // parese and add page categories to trail
                        // const cats = data.parse.categories.filter((obj) => {
                        //     return obj.hidden === undefined;
                        // });
                        // this.props.addCategories(cats, this.state.wikiTarget);
                    } catch (e) {
                        this.setState({ content: "Error parsing page" });
                    }
                } else {
                    this.setState({
                        content: "Page does not exist",
                    });
                }
            });
    }

    render() {
        return (
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
                {this.state.content}
            </div>
        );
    }
}

export default WikiContent;
