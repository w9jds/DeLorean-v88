import React, { FC, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { doc, updateDoc } from 'firebase/firestore';

import { Loader } from '@googlemaps/js-api-loader';

import Configuration from 'models/config';
import { ApplicationState } from 'models/states';
import { MapsConfig } from 'config/delorean.config';
import { closeConfigDialog } from 'store/config/actions';
import { isConfigDialogOpen } from 'store/config/selectors';
import { getDatabase, getCurrentConfig } from 'store/current/selectors';

import { Close } from '@mui/icons-material';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Button, TextField, Dialog, AppBar, Toolbar, IconButton, Typography, Slide, FormControl } from '@mui/material';

import './SiteConfig.scss';

const Transition = (props) => <Slide direction="up" {...props} />;
type SiteConfigProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const initialState = {
  name: '',
  email: '',
  twitter: '',
  facebook: '',
  meetup: '',
  github: '',
  venueName: '',
  address: '',
  picture: '',
  papercall: '',
};

const SiteConfig: FC<SiteConfigProps> = ({
  db,
  open,
  config,

  closeConfigDialog
}) => {
  const ref = useRef();
  const [autocomplete, setAutoComplete] = useState<google.maps.places.Autocomplete>();
  const [fields, setFields] = useState<Record<string, any>>(initialState);

  const loader = new Loader({
    apiKey: MapsConfig.apiKey,
    version: "weekly",
  });

  useEffect(() => {
    setFields({
      name: config?.org?.name,
      email: config?.org?.email,
      twitter: config?.org?.twitter,
      facebook: config?.org?.facebook,
      meetup: config?.org?.meetup,
      github: config?.org?.github,
      venueName: config?.venue?.name,
      address: config?.venue?.address,
      picture: config?.venue?.pictureUrl,
      papercall: config?.event?.papercall?.url,
      startDate: config?.event?.startDate?.toDate(),
      speakerClose: config?.event?.papercall?.closing?.toDate()
    });
  }, [config]);

  useEffect(() => {
    if (open) {
      loader.importLibrary('places').then(lib => {
        setAutoComplete(new lib.Autocomplete(ref.current, {
          fields: ['photos', 'geometry', 'formatted_address', 'place_id', 'url']
        }));
      });
    }
  }, [open, ref.current]);

  const onSettingChange = (e, name: string) => {
    setFields({ ...fields, [name]: e.target.value });
  };

  const onDateChange = (date, name: string) => {
    setFields({ ...fields, [name]: date });
  };

  const handleClose = () => {
    setAutoComplete(null);
    closeConfigDialog();
  };

  const save = async () => {
    const place = autocomplete?.getPlace();
    const update: Configuration = {
      org: {
        ...config.org,
        name: fields.name || null,
        email: fields.email || null,
        facebook: fields.facebook || null,
        twitter: fields.twitter || null,
        meetup: fields.meetup || null,
        github: fields.github || null,
      },
      venue: {
        ...config.venue,
        name: fields.venueName || null,
        pictureUrl: fields.picture || null,
      },
      event: {
        ...config.event,
        startDate: fields.startDate || null,
        papercall: {
          ...config.event.papercall,
          url: fields.papercall || null,
          closing: fields.speakerClose || null,
        }
      }
    };

    if (place?.formatted_address) {
      update.venue = {
        url: place.url,
        name: fields.venueName,
        pictureUrl: fields.picture,
        address: place.formatted_address,
        placeId: place.place_id,
        coordinates: {
          lng: place.geometry.location.lng(),
          lat: place.geometry.location.lat()
        }
      };
    }

    updateDoc(doc(db, '/config/devfest'), { ...update });
    handleClose();
  }


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        className="site-config"
        fullScreen open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className="header">
          <Toolbar>
            <IconButton color="inherit" onClick={handleClose} aria-label="Close">
              <Close />
            </IconButton>
            <Typography variant="h6" color="inherit">
              Site Configuration
            </Typography>
            <Button color="inherit" onClick={save}>
              Save
            </Button>
          </Toolbar>
        </AppBar>

        <div className="dialog-form">
          <div>
            <FormControl className="form-control">
              <TextField label="Name" value={fields.name} onChange={e => onSettingChange(e, 'name')} />
            </FormControl>
            <FormControl className="form-control">
              <TextField label="Email" value={fields.email} onChange={e => onSettingChange(e, 'email')} />
            </FormControl>
            <FormControl className="form-control">
              <TextField label="Twitter Handle" value={fields.twitter} onChange={e => onSettingChange(e, 'twitter')} />
            </FormControl>
            <FormControl className="form-control">
              <TextField label="Meetup Handle" value={fields.meetup} onChange={e => onSettingChange(e, 'meetup')} />
            </FormControl>
            <FormControl className="form-control">
              <TextField label="Facebook Handle" value={fields.facebook} onChange={e => onSettingChange(e, 'facebook')} />
            </FormControl>
            <FormControl className="form-control">
              <TextField label="Github Handle" value={fields.github} onChange={e => onSettingChange(e, 'github')} />
            </FormControl>
          </div>

          <div>
            <FormControl className="form-control">
              <TextField label="Venue Name" value={fields.venueName} onChange={e => onSettingChange(e, 'venueName')} helperText="Displayed in intro (top of home page)" />
            </FormControl>
            <FormControl className="form-control">
              <TextField label="Venue Picture" value={fields.picture} onChange={e => onSettingChange(e, 'picture')} helperText="Displays in card on venue map" />
            </FormControl>
            <FormControl className="form-control">
              <TextField
                label="Venue Address"
                inputRef={ref}
                defaultValue={fields.address}
                helperText="Used to build static Google Map"
              />
            </FormControl>
          </div>

          <div>
            <FormControl className="form-control">
              <TextField label="Submit Talk Uri" value={fields.papercall} onChange={e => onSettingChange(e, 'papercall')} />
            </FormControl>
            <FormControl className="form-control">
              <DateTimePicker label="Speaker Close Date" value={fields.speakerClose} onChange={e => onDateChange(e, 'speakerClose')} />
            </FormControl>
            <FormControl className="form-control">
              <DatePicker label="Event Date" value={fields.startDate} onChange={e => onDateChange(e, 'startDate')} />
            </FormControl>
          </div>
        </div>
      </Dialog>
    </LocalizationProvider>
  )
}

const mapStateToProps = (state: ApplicationState) => ({
  db: getDatabase(state),
  open: isConfigDialogOpen(state),
  config: getCurrentConfig(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  closeConfigDialog
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SiteConfig);