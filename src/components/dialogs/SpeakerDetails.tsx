import React, { Fragment } from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import createDOMPurity from 'dompurify';

import { Speaker } from 'models/speaker';
import { ApplicationState } from 'models/states';
import { closeDialogWindow } from 'store/dialogs/actions';

import { Typography, DialogContent, Divider, Button } from '@mui/material';
import { Link, Clear } from '@mui/icons-material';

import Github from 'assets/github.svg';
import Medium from 'assets/medium.svg';
import Twitter from 'assets/twitter.svg';
import Facebook from 'assets/facebook.svg';
import Linkedin from 'assets/linkedin.svg';

import './SpeakerDetails.scss';

type SpeakerDetailsProps = SpeakerDetailsAttribs & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

type SpeakerDetailsAttribs = {
    speaker: Speaker;
};

type SocialType = 'github' | 'medium' | 'twitter' | 'linkedin' | 'facebook' | 'blog';

const DOMPurify = createDOMPurity(window);

class SpeakerDetails extends React.Component<SpeakerDetailsProps> {

  constructor(props: SpeakerDetailsProps) {
    super(props);
  }

  onSocialClicked = (type: SocialType, baseUri: string) => e => {
    const {speaker} = this.props;

    if (type === 'blog') {
      window.open(speaker[type]);
    } else if (type === 'medium' && !speaker[type].startsWith('@')) {
      window.open([baseUri, speaker[type]].join('/@'));
    } else {
      window.open([baseUri, speaker[type]].join('/'));
    }
  }

  getSocialIcon = (type: SocialType) => {
    const props = {
      key: type,
      className: type
    };

    switch (type) {
      case 'github':
        return <Github {...props} onClick={this.onSocialClicked(type, 'https://github.com')} />;
      case 'medium':
        return <Medium {...props} onClick={this.onSocialClicked(type, 'https://medium.com')} />;
      case 'twitter':
        return <Twitter {...props} onClick={this.onSocialClicked(type, 'https://twitter.com')} />;
      case 'linkedin':
        return <Linkedin {...props} onClick={this.onSocialClicked(type, 'https://linkedin.com/in')} />;
      case 'facebook':
        return <Facebook {...props} onClick={this.onSocialClicked(type, 'https://facebook.com')}/>;
      case 'blog':
        return <Link {...props} onClick={this.onSocialClicked(type, 'https://facebook.com')}/>;
      default:
        return null;
    }
  }

  buildSubTitle = () => {
    const {company, title} = this.props.speaker;
    let subTitle = '';

    if (company && title) {
      subTitle = `${title} @ ${company}`;
    } else if (title) {
      subTitle = `${title}`;
    } else if (company) {
      subTitle = `${company}`;
    }

    if (subTitle) {
      return (
        <Typography variant="subtitle1" >
          {subTitle}
        </Typography>
      );
    }

    return null;
  }

  buildSocialButtons = (speaker: Speaker) => {
    const social: SocialType[] = ['github', 'medium', 'twitter', 'linkedin', 'facebook', 'blog'];
    const buttons = [];

    for (let type of social) {
      let username = speaker[type];

      if (username) {
        buttons.push(this.getSocialIcon(type));
      }
    }

    if (buttons?.length) {
      return (
        <Fragment>
          <Divider />
          <div className="social">
            {buttons}
          </div>
        </Fragment>
      );
    }
  }

  render() {
    const {speaker} = this.props;

    return(
      <Fragment>
        <DialogContent className="speaker-details">
          <Button className="action close" onClick={this.props.closeDialogWindow}>
            <Clear />
          </Button>

          <div className="header">
            <img className="portrait-image portrait-avatar" src={speaker.portraitUrl} />
          </div>
          <div className="content">
            <Typography variant="h6">{speaker.name}</Typography>
            {this.buildSubTitle()}
          </div>
          {this.buildSocialButtons(speaker)}
          {speaker.bio && (
            <Fragment>
              <Divider />
              <div className="bio" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(speaker.bio) }} />
            </Fragment>
          )}
        </DialogContent>
      </Fragment>
    );
  }
}

const mapStateToProps = (_: ApplicationState) => ({ });

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  closeDialogWindow
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SpeakerDetails);