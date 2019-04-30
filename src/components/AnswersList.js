import React, { Component } from 'react';

const base = 'answers-list';

export default class AnswersList extends Component {
    render() {
        const { answers } = this.props;
        return (
            <ul className={ base }>
                { answers.map((answer, i) => (
                    <li key={ i }>{ answer }</li>
                ))}
            </ul>
        )
    }
}