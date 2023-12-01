import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, StyleSheet, Dimensions } from "react-native";
import { Input, ButtonGroup } from "@rneui/themed";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign, SimpleLineIcons } from "../../../helpers/icons";

function StandardSettings() {
  // Zustandsvariablen für ausgewählte Werte
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    manno: "",
    phone: "",
    email: "",
    location: "",
    person: "",
  });

  const { width, height } = Dimensions.get("window");

  const [isFocus, setIsFocus] = useState(false);

  const settings = {
    customer_id: "28",
    beleg_comment: { single: "1", common: "1" },
    beleg_add: { camera: "1", folder: "1", pdfpicker: "1", bewirtung: "1" },
    beleg_categorize: {
      available: "1",
      single: { available: "1", mandatory: "0" },
      common: { available: "1", mandatory: "0" },
    },
    beleg_yearselect: {
      available: "0",
      single: { available: "0", mandatory: "0" },
      common: { available: "0", mandatory: "0" },
    },
    group: "0",
    group_releaseable: "0",
    arena: "0",
    app_rate: "0",
    person_phone: "1",
    multiple_locations: "1",
    multiple_persons: "1",
    multiple_identities: "1",
    multiple_identities_forceselect_beforesend: "1",
    belegziel_forceselect_beforesend: "0",
    person_add_contact: "1",
    location_add_contact: "1",
    beleg_crop: "1",
    beleg_rotate: "1",
    beleg_filters: "1",
    belege_max_per_send: "8",
    docscan_available: "1",
    printer: "1",
    fontsize_switcher_available: "1",
    person_list: "0",
    contact_form: "1",
    news: "1",
    appointments: "0",
    appointments_add: "0",
    appointments_defaults_add: "0",
    more_ansprechpartner: "1",
    more_downloads: "1",
    more_docexchange: "1",
    more_docexchange_sig_w_date: "1",
    more_videos: "1",
    more_notes: "1",
    more_recovery: "0",
    belegnote_addable: "1",
    app_user_api_sync: "0",
    app_user_formfill: {
      self_fill: "1",
      pin_fetch: "0",
      editable_after_pin: "0",
    },
    push: { basic: "1", startup_alert: "1", alert_no_name: "0" },
    chat: { enabled: "1" },
    app_secure_access: "none",
    app_secure_access_activeask: "1",
    default_send_method: "standard",
    default_camera_mode: "docscan",
    default_camera_mode_force: "1",
    mandates: { send_via: "email", enabled: "1" },
    app_settings: {
      name: {
        available: "1",
        mandatory: "1",
        placeholder_text: "Platzhalter - Ihr Name (NAME)",
        help_info_text: "Hilfetext - Ihr Vor- und Nachname (NAME)",
        validation_info: "Fehler - Bitte ausf\u00fcllen (NAME)",
      },
      manno: {
        available: "1",
        mandatory: "1",
        validation_pattern: "\\d{4,6}$",
        placeholder_text: "Platzhalter - Ihre Mandantennummer (MANNO)",
        help_info_text:
          "Hilfetext - Ihre Mandantennummer / Identifikationsnummer (MANNO)",
        validation_info: "Fehler - Bitte ausf\u00fcllen, 4-6 Zahlen (MANNO)",
      },
      phone: {
        available: "1",
        mandatory: "1",
        placeholder_text: "Platzhalter - Ihre Telefonnummer (PHONE)",
        help_info_text:
          "Hilfetext - Ihre Telefonnummer f\u00fcr ggf. auftretende R\u00fcckfragen (PHONE)",
        validation_info: "Fehler - Bitte ausf\u00fcllen (PHONE)",
      },
      email: {
        available: "1",
        mandatory: "1",
        placeholder_text: "Platzhalter - Ihre E-Mail-Adresse (EMAIL)",
        help_info_text: "Hilfetext - Ihre E-Mail-Adresse (EMAIL)",
        validation_info: "Fehler - Bitte ausf\u00fcllen (EMAIL)",
      },
      location: {
        available: "1",
        mandatory: "1",
        placeholder_text: "Platzhalter - Ihr zust\u00e4ndiger Kanzlei Standort",
        help_info_text:
          "Hilfetext - Ihr zust\u00e4ndiger Kanzlei Standort (LOCATION)",
        validation_info: "Fehler - Bitte ausf\u00fcllen (LOCATION)",
      },
      person: {
        available: "1",
        mandatory: "1",
        placeholder_text: "Platzhalter - Ihr Sachbearbeiter (PERSON)",
        help_info_text:
          "Hilfetext - Ihr zust\u00e4ndiger Kanzlei-Mitarbeiter / Beleg-Empf\u00e4nger (PERSON)",
        validation_info: "Fehler - Bitte ausf\u00fcllen (PERSON)",
      },
      show_help_info: "0",
    },
    news_settings: {
      list_last: 50,
      show_home: "1",
      show_home_amount: 5,
      show_home_date: "1",
      show_home_excerpt: "1",
      show_overview_date: "1",
      show_overview_excerpt: "1",
    },
    appointment_settings: {
      show_home: "1",
      show_home_dayssince: "1",
      show_home_excerpt: "1",
      show_home_amount: 6,
      show_overview_dayssince: "1",
    },
    show_info_icon: "1",
    use_white_info_icon: "0",
    send_stats_extended: "1",
    currency: { name: "Euro", sign: "\u20ac" },
    appIds: { ios: "787088888", android: "20600002010502" },
    jpegquality_available: 1,
    default_jpeg_quality: 0.6,
    overwrite_jpeg_quality: true,
    jpegdpi_available: 1,
    default_jpeg_dpi: "100",
    overwrite_jpeg_dpi: true,
    statusbar_hex: "#007EDF",
    background_hex: "#007EDF",
    textcolor_hex: "#ffffff",
    tablet_sidebar: "1",
    tablet_sidebar_address: "0",
    verification_type: "email",
    datev_dcal: {
      enabled: 1,
      ios_available: 1,
      android_available: 1,
      default_available: 1,
      selected: "datev",
      disallow_send: false,
      external_accounts_sync: false,
      more_text:
        '<p>DATEVconnect online ist eine webbasierte Schnittstelle f\u00fcr den digitalen Datenaustausch in das DATEV-Rechenzentrum.</p><p><strong>Die Vorteile des Datenaustauschs \u00fcber DATEVconnect online sind</strong></p><ul><li style="margin-bottom: 6px;">Effiziente Weitergabe von Dokumentdaten wie z. B. Belege und Belegsatzdaten zum Steuerberater</li><li style="margin-bottom: 6px;">Sicherer Austausch der Dokumentdaten f\u00fcr das DATEV-Rechenzentrum</li><li style="margin-bottom: 6px;">Keine Medienbr\u00fcche</li><li style="margin-bottom: 6px;">Effiziente \u00dcbernahme der Daten in die Finanzbuchf\u00fchrung</li><li style="margin-bottom: 6px;">Weniger Erfassungsfehler / h\u00f6here Prozessqualit\u00e4t</li><li style="margin-bottom: 6px;">Schnelle Verf\u00fcgbarkeit der Dokumentdaten f\u00fcr die Finanzbuchf\u00fchrung</li><li style="margin-bottom: 6px;">Bereitstellung der Dokumentdaten \u00fcber ein revisionssicheres Online-Archiv</li></ul>\r\n',
    },
    datev_mytax: {
      enabled: 1,
      disallow_send: false,
      more_text:
        "<p>DATEV Meine Steuern unterst\u00fctzt Mandanten und Kanzleien dabei, die Steuererkl\u00e4rung gemeinsam und digital auf den Weg zu bringen. Daf\u00fcr k\u00f6nnen Sie, der Mandant, unkompliziert Dokumente in DATEV Meine Steuern bereitstellen. Die Kanzleien greifen mit dem bekannten Programm DATEV Einkommensteuer auf die bereitgestellten Dokumente zu und erstellen auf dieser Basis die Steuererkl\u00e4rung. Anschlie\u00dfend kann die fertige Steuererkl\u00e4rung \u00fcber DATEV Freizeichnung online den Mandantinnen und Mandanten zur Freizeichnung digital zur Verf\u00fcgung gestellt werden.</p>\r\n",
    },
    bz_upload: {
      enabled: 1,
      customer_id: "28",
      default_send_disabled: 0,
      auto_login_available: 1,
      documents_available: 0,
      pphrase: "v653we$%G%&/U5eSHW$zgerhsdftuj67",
      urls: {
        login: "https://login.belegzentrale.de/api/api_baapp.php/user/login/",
        logout: "https://login.belegzentrale.de/api/api_baapp.php/user/logout/",
        auto_login:
          "https://login.belegzentrale.de/api/api_baapp.php/user/autologin/",
        pw_lost:
          "https://login.belegzentrale.de/api/api_baapp.php/user/pw_lost/",
        categories:
          "https://login.belegzentrale.de/api/api_baapp.php/categories/",
        documents:
          "https://login.belegzentrale.de/api/api_baapp.php/documents/",
        upload: "https://login.belegzentrale.de/api/api_baapp.php/upload/",
      },
    },
    ek_versand: { enabled: 1 },
    standard_versand: { enabled: 1 },
    addison_oc_versand: { enabled: 0 },
    directselected_versand_method: "standard",
    show_cookieconsent_at_startup: 0,
    usync: {
      enabled: 1,
      usync_lock_form: 0,
      usync_locked_mode: 0,
      use_individual_settings: 0,
      manage_viewof_belegziele: "",
    },
    calculators: {
      selected: { percentage: 19, country: "Deutschland" },
      calculators: {
        items: [
          {
            name: "Umsatzsteuer",
            key: "umsatzsteuer",
            description:
              "Umsatzsteuer (oder auch Mehrwersteuer) wird auf alle Waren aufgeschlagen. Umsatzsteuer (oder auch Mehrwersteuer) wird auf alle Waren aufgeschlagen. Umsatzsteuer (oder auch Mehrwersteuer) wird auf alle Waren aufgeschlagen. Umsatzsteuer (oder auch Mehrwersteuer) wird auf alle Waren aufgeschlagen.  Umsatzsteuer (oder auch Mehrwersteuer) wird auf alle Waren aufgeschlagen.",
          },
          {
            name: "Zinsrechner",
            key: "zinsrechner",
            description: "Tages-, Monats- und Jahreszinsen berechnen",
          },
        ],
        selected: "umsatzsteuer",
      },
      mwst: [
        {
          country: "Deutschland",
          name: "Umsatzsteuer (USt)",
          sign: "\u20ac",
          flag: "de.png",
          saetze: [
            { percent: 19, name: "normal", defaultValue: true },
            { percent: 7, name: "erm\u00e4\u00dfigt" },
          ],
        },
        {
          country: "Schweiz",
          name: "Umsatzsteuer (USt)",
          sign: "CHF",
          flag: "ch.png",
          saetze: [
            { percent: 8, name: "normal" },
            { percent: 2.5, name: "erm\u00e4\u00dfigt" },
          ],
        },
        {
          country: "\u00d6sterreich",
          name: "Umsatzsteuer (USt)",
          sign: "\u20ac",
          flag: "at.png",
          saetze: [
            { percent: 20, name: "normal" },
            { percent: 13, name: "erm\u00e4\u00dfigt" },
            { percent: 10, name: "erm\u00e4\u00dfigt" },
          ],
        },
        {
          country: "Niederlande",
          name: "Belasting Toegevoegde Waarde (BTW)",
          sign: "\u20ac",
          flag: "nl.png",
          saetze: [
            { percent: 21, name: "normal" },
            { percent: 6, name: "erm\u00e4\u00dfigt" },
          ],
        },
        {
          country: "Frankreich",
          name: "taxe sur la valeur ajout\u00e9e (TVA)",
          sign: "\u20ac",
          flag: "fr.png",
          saetze: [
            { percent: 20, name: "normal" },
            { percent: 10, name: "erm\u00e4\u00dfigt" },
            { percent: 5.5, name: "erm\u00e4\u00dfigt" },
            { percent: 2.1, name: "erm\u00e4\u00dfigt" },
          ],
        },
      ],
    },
    customs: [],
  };

  const locations = [
    {
      customer_id: "28",
      location_id: "26",
      manno_triggered: "0",
      manno_trigger: "",
      location_callname: "badevelopment",
      location_company: "Beleg anbei c/o dimento.com gmbh",
      location_display_name: "Beleg anbei c/o dimento.com gmbh",
      location_address: "Hauptstra\u00dfe 12a",
      location_zip: "48683",
      location_city: "Ahaus",
      location_county: "",
      location_country: "Deutschland",
      location_phone: {
        display: "0251 - 322 65 44 0",
        dial: "+49 251 - 322 65 44 0",
      },
      location_fax: {
        display: "0251 - 322 65 44 99",
        dial: "0251 - 322 65 44 99",
      },
      location_cell: { display: "", dial: "" },
      location_email: "info@dimento.com",
      location_www: "dimento.com",
      location_logo: "location-28-26-.jpg",
      location_prefered: "1",
      location_lat: "52.12187194824219",
      location_lon: "6.987703323364258",
      location_has_persons: "1",
      location_has_only_persons: "0",
      location_text:
        '<p>ggst544t5 <strong>45tt45s</strong> t45t s4ts4t 54zt4zzhs4t45t4<em>5zt45t5zt45wsz4</em>tz4t 5tz4r5tsetert ertsert21313142535 4 4326546 254325 435 43252435 234</p>\n<p>sadf irfh234rhg87rtazgfaweuz <span style="text-decoration: underline;">ogwqdeghweiof7tg</span> 4rfa34tefreftregerg&nbsp;</p>',
      location_index: "0",
      location_callable: "1",
      location_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      manno_triggered: "0",
      manno_trigger: "",
      location_callname: "dimentocomgmbh",
      location_company: "dimento.com gmbh",
      location_display_name: "dimento.com gmbh",
      location_address: "Hammer Strasse 89",
      location_zip: "48153",
      location_city: "M\u00fcnster",
      location_county: "",
      location_country: "Deutschland",
      location_phone: { display: "0251 32265440", dial: "+49 251 32265440" },
      location_fax: { display: "0251 3226544 99", dial: "0251 3226544 99" },
      location_cell: { display: "", dial: "" },
      location_email: "dominic.roesmann@googlemail.com",
      location_www: "www.dimento.com",
      location_logo: "location-28-139-.png",
      location_prefered: "0",
      location_lat: "51.9479025",
      location_lon: "7.6242252",
      location_has_persons: "1",
      location_has_only_persons: "0",
      location_text:
        "<p>Ihre Mandanten sind viel weiter als Sie denken! Wo ist die App, mit der ich mit meinem Steuerberater schnell und zeitgem\u00e4\u00df kommunizieren kann? Wo ist das coole Werkzeug, mit der ich meine Einkommensteuer Belege sammeln, verwalten und geschlossen abschicken kann? Warum hat meine Kanzlei nicht so eine App. Welche Digitalisierungswerkzeuge k\u00f6nnen Sie als Kanzlei mir zur Verf\u00fcgung stellen?</p>\n<p>Das sind Fragen, die wir t\u00e4glich von <strong>Interessierten Mandanten und Unternehmen</strong> h\u00f6ren, die sich nach unserer App erkundigen.</p>\n<p><strong>Gerade junge Menschen</strong> und junge Unternehmer sind es gewohnt, Ihr Smartphone f\u00fcr alle t\u00e4glichen Anforderungen wie kommunizieren, Shoppen und bezahlen zu nutzen. Warten Sie nicht, bis Ihre Mandanten zu einer Kanzlei wechseln, von der sie Unterst\u00fctzung im Bereich Digitalisierung erhalten.</p>\n<p>Und neue Mandanten gewinnen Sie nicht mit alten Z\u00f6pfen oder Pendelordnern. Zeigen Sie offensiv Ihren Stand der Digitalisierung auf Ihrer Webseite, um neue Mandanten zu gewinnen. Ein zentraler Aspekt k\u00f6nnte dabei unsere App sein. Mit Beleg anbei und unserer Belegzentrale macht ihre Kanzlei eine gute Figur in Bezug auf Digitalisierung, Marketing und Erscheinungsbild.</p>\n<p>Die Zeit ist reif f\u00fcr einfache und komfortable Digitalisierungswerkzeuge.</p>",
      location_index: "0",
      location_callable: "1",
      location_active: "1",
    },
    {
      customer_id: "28",
      location_id: "193",
      manno_triggered: "1",
      manno_trigger: "12345",
      location_callname: "mitarbeiterkategorie",
      location_company: "Mitarbeiter Kategorie",
      location_display_name: "Mitarbeiter Kategorie",
      location_address: "",
      location_zip: "",
      location_city: "",
      location_county: "",
      location_country: "",
      location_phone: { display: "", dial: "" },
      location_fax: { display: "", dial: "" },
      location_cell: { display: "", dial: "" },
      location_email: "",
      location_www: "",
      location_logo: "",
      location_prefered: "0",
      location_lat: "",
      location_lon: "",
      location_has_persons: "0",
      location_has_only_persons: "1",
      location_text: "",
      location_index: "0",
      location_callable: "0",
      location_active: "1",
    },
    {
      customer_id: "28",
      location_id: "314",
      manno_triggered: "0",
      manno_trigger: "",
      location_callname: "Grohl_Osnabrueck_28_1419",
      location_company: "Grohl Osnabr\u00fcck",
      location_display_name: "Grohl Osnabr\u00fcck",
      location_address: "Goldstra\u00dfe 18",
      location_zip: "49074",
      location_city: "Osnabr\u00fcck",
      location_county: "",
      location_country: "",
      location_phone: { display: "", dial: "" },
      location_fax: { display: "", dial: "" },
      location_cell: { display: "", dial: "" },
      location_email: "",
      location_www: "",
      location_logo: "",
      location_prefered: "0",
      location_lat: "52.2691667",
      location_lon: "8.0501386",
      location_has_persons: "0",
      location_has_only_persons: "0",
      location_text: "",
      location_index: "0",
      location_callable: "1",
      location_active: "1",
    },
  ];

  const persons = [
    {
      customer_id: "28",
      location_id: "26",
      person_id: "339",
      person_salutation: "Herr",
      person_icon: "",
      person_firstname: "Dominic",
      person_lastname: "Dimento",
      person_name: "Dominic Dimento",
      person_name_sort: "Dimento Dominic",
      person_callname: "dominicdimento",
      person_email: "dominic.roesmann+dev-droes@googlemail.com",
      person_position_title: "TestTITEL",
      person_text:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
      person_phone: {
        display: "0251 - 322 65 44 0",
        dial: "0251 - 322 65 44 0",
      },
      person_fax: {
        display: "0251 - 322 65 44 99",
        dial: "0251 - 322 65 44 99",
      },
      person_cell: { display: "0151 123456789", dial: "+49 151 123456789" },
      person_photo: "person-28-339-dominicdimento.png",
      person_index: 0,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "4021",
      person_salutation: "",
      person_icon: "",
      person_firstname: "sdfsd",
      person_lastname: "f43535345",
      person_name: "f43535345, sdfsd",
      person_name_sort: "f43535345, sdfsd",
      person_callname: "sdfsd_f43535345_220",
      person_email: "dsfsdf@dimento.com",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "0251 / 322", dial: "+49 251  322" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "person-4021-sdfsd_f43535345_220.jpg",
      person_index: 1,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "193",
      person_id: "3615",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Krankmeldungen",
      person_lastname: "Krankmeldungen",
      person_name: "Krankmeldungen",
      person_name_sort: "Krankmeldungen",
      person_callname: "krankmeldungen",
      person_email: "kroe@klv-clp.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "", dial: "" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 2,
      person_is_person: "0",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "193",
      person_id: "1918",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Mitarbeiter",
      person_lastname: "KRANKMELDUNGEN",
      person_name: "Mitarbeiter KRANKMELDUNGEN",
      person_name_sort: "Mitarbeiter KRANKMELDUNGEN",
      person_callname: "mitarbeiterkrankmeldungen",
      person_email: "mitarbeiter-krank@dimento.com",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "", dial: "" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 3,
      person_is_person: "0",
      person_show: {
        atall: "0",
        email: "0",
        phone: "0",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "193",
      person_id: "1919",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Lustige",
      person_lastname: "Bilder",
      person_name: "Lustige Bilder",
      person_name_sort: "Lustige Bilder",
      person_callname: "lustigebilder",
      person_email: "lustige-bilder@dimento.com",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "", dial: "" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 4,
      person_is_person: "0",
      person_show: {
        atall: "0",
        email: "0",
        phone: "0",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "26",
      person_id: "4472",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Hansi",
      person_lastname: "Meierhofer",
      person_name: "Meierhofer, Hansi",
      person_name_sort: "Meierhofer, Hansi",
      person_callname: "Hansi_Meierhofer_883",
      person_email: "hansi-meierhofer@dimento.com",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "0251 123456789", dial: "+49 251 123456789" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 4,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "26",
      person_id: "342",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Marianne",
      person_lastname: "M\u00fcller",
      person_name: "Marianne  Meier-Vorfelder-von-B\u00fcckeshoven-Schneider",
      person_name_sort: "M\u00fcller Marianne",
      person_callname: "mariannemller",
      person_email: "dominic.roesmann+dev-mmueller@googlemail.com",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "025132265440", dial: "" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "person-28-342-mariannemller.jpg",
      person_index: 5,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "0",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "340",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Dominic",
      person_lastname: "Roesmann",
      person_name: "Dominic Roesmann",
      person_name_sort: "Roesmann Dominic",
      person_callname: "dominicroesmann",
      person_email: "dominic.roesmann@googlemail.com",
      person_position_title: "",
      person_text: "",
      person_phone: {
        display: "0151 - 11 24 03 66",
        dial: "0151 - 11 24 03 66",
      },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 6,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "0",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "ek",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "26",
      person_id: "887",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Markus",
      person_lastname: "Schnitzelio",
      person_name: "Markus Schnitzelio",
      person_name_sort: "Schnitzelio Markus",
      person_callname: "markusschnitzelio",
      person_email: "dominic.roesmann+dev-schnitzelio@googlemail.com",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "", dial: "" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "person-28-887-markusschnitzelio.jpg",
      person_index: 7,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3639",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Renate",
      person_lastname: "Stadtsholte",
      person_name: "Stadtsholte, Renate",
      person_name_sort: "Stadtsholte Renate",
      person_callname: "stadtsholte_renate",
      person_email: "sta@klv-clp.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "04471 / 965 - 255", dial: "+49 4471 965 255" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "person-3639-stadtsholte_renate.jpg",
      person_index: 8,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3638",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Judith",
      person_lastname: "Stoll",
      person_name: "Stoll, Judith",
      person_name_sort: "Stoll Judith",
      person_callname: "stoll_judith",
      person_email: "stoll@awl-steuern.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "04471 / 965 - 391", dial: "+49 4471 965 391" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 9,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3637",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Bernhard",
      person_lastname: "Suilmann",
      person_name: "Suilmann, Bernhard",
      person_name_sort: "Suilmann Bernhard",
      person_callname: "suilmann_bernhard",
      person_email: "BSuilmann@klv-clp.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "04471 / 965 - 251", dial: "+49 4471 965 251" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "person-3637-suilmann_bernhard.jpg",
      person_index: 10,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3636",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Tobias",
      person_lastname: "Tammling",
      person_name: "Tammling, Tobias",
      person_name_sort: "Tammling Tobias",
      person_callname: "tammling_tobias",
      person_email: "tammling@awl-steuern.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "04471 / 965 - 371", dial: "+49 4471 965 371" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "person-28-3636-tammling_tobias.png",
      person_index: 11,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3635",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Elisabeth",
      person_lastname: "Tellmann",
      person_name: "Tellmann, Elisabeth",
      person_name_sort: "Tellmann Elisabeth",
      person_callname: "tellmann_elisabeth",
      person_email: "tellmann@awl-steuern.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "04471 / 965 - 586", dial: "+49 4471 965 586" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "person-3635-tellmann_elisabeth.jpg",
      person_index: 12,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3634",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Tanja",
      person_lastname: "Tretow",
      person_name: "Tretow, Tanja",
      person_name_sort: "Tretow Tanja",
      person_callname: "tretow_tanja",
      person_email: "tretow@awl-steuern.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "04471 / 965 - 314", dial: "+49 4471 965 314" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 13,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3633",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Kathleen",
      person_lastname: "Warnke",
      person_name: "Warnke, Kathleen",
      person_name_sort: "Warnke Kathleen",
      person_callname: "warnke_kathleen",
      person_email: "warnke.k@awl-steuern.de",
      person_position_title: "",
      person_text: "",
      person_phone: {
        display: "04473 / 9266 - 582",
        dial: "+49 4473 9266 582",
      },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 14,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3632",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Stefan",
      person_lastname: "Warnke",
      person_name: "Warnke, Stefan",
      person_name_sort: "Warnke Stefan",
      person_callname: "warnke_stefan",
      person_email: "war@awl-steuern.de",
      person_position_title: "",
      person_text: "",
      person_phone: {
        display: "04473 / 9266 - 583",
        dial: "+49 4473 9266 583",
      },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 15,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3631",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Josef",
      person_lastname: "Wendeln",
      person_name: "Wendeln, Josef",
      person_name_sort: "Wendeln Josef",
      person_callname: "wendeln_josef",
      person_email: "JWendeln@klv-clp.de",
      person_position_title: "",
      person_text: "",
      person_phone: {
        display: "04471 / 965 - 101",
        dial: "+49 4471 965 1+49 1",
      },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 16,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3630",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Thomas",
      person_lastname: "Wernke",
      person_name: "Wernke, Thomas",
      person_name_sort: "Wernke Thomas",
      person_callname: "wernke_thomas",
      person_email: "wernke@awl-steuern.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "04471 / 965 - 379", dial: "+49 4471 965 379" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 17,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3629",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Beate",
      person_lastname: "Wessels",
      person_name: "Wessels, Beate",
      person_name_sort: "Wessels Beate",
      person_callname: "wessels_beate",
      person_email: "wessels@klv-clp.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "04471 / 965 - 117", dial: "+49 4471 965 117" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 18,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3628",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Christine",
      person_lastname: "Wichmann",
      person_name: "Wichmann, Christine",
      person_name_sort: "Wichmann Christine",
      person_callname: "wichmann_christine",
      person_email: "wichmann@klv-clp.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "04471 / 965 - 115", dial: "+49 4471 965 115" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 19,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3627",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Theresia",
      person_lastname: "Wichmann",
      person_name: "Wichmann, Theresia",
      person_name_sort: "Wichmann Theresia",
      person_callname: "wichmann_theresia",
      person_email: "wich@klv-clp.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "04471 / 965 - 256", dial: "+49 4471 965 256" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 20,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3626",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Martin",
      person_lastname: "Wienken",
      person_name: "Wienken, Martin",
      person_name_sort: "Wienken Martin",
      person_callname: "wienken_martin",
      person_email: "MWienken@awl-steuern.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "04471 / 965 - 382", dial: "+49 4471 965 382" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "person-3626-wienken_martin.jpg",
      person_index: 21,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3625",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Regina",
      person_lastname: "Wiens",
      person_name: "Wiens, Regina",
      person_name_sort: "Wiens Regina",
      person_callname: "wiens_regina",
      person_email: "wiens@awl-steuern.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "04471 / 965 - 316", dial: "+49 4471 965 316" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 22,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3624",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Lena",
      person_lastname: "Wiesner",
      person_name: "Wiesner, Lena",
      person_name_sort: "Wiesner Lena",
      person_callname: "wiesner_lena",
      person_email: "wiesner@awl-steuern.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "", dial: "" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 23,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3623",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Rita",
      person_lastname: "Wilken",
      person_name: "Wilken, Rita",
      person_name_sort: "Wilken Rita",
      person_callname: "wilken_rita",
      person_email: "wil@klv-clp.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "04471 / 965 - 142", dial: "+49 4471 965 142" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 24,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3622",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Sascha",
      person_lastname: "Willoh",
      person_name: "Willoh, Sascha",
      person_name_sort: "Willoh Sascha",
      person_callname: "willoh_sascha",
      person_email: "willoh@awl-steuern.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "04471 / 965 - 385", dial: "+49 4471 965 385" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 25,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3621",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Manfred",
      person_lastname: "W\u00fcbbelmann",
      person_name: "W\u00fcbbelmann, Manfred",
      person_name_sort: "W\u00fcbbelmann Manfred",
      person_callname: "w__bbelmann_manfred",
      person_email: "wub@klv-clp.de",
      person_position_title: "",
      person_text: "",
      person_phone: {
        display: "04471 / 965 \u2013 133",
        dial: "+49 4471 965 \u2013 133",
      },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 26,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3620",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Agnes",
      person_lastname: "Wulfers",
      person_name: "Wulfers, Agnes",
      person_name_sort: "Wulfers Agnes",
      person_callname: "wulfers_agnes",
      person_email: "w@klv-clp.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "04471 / 965 - 258", dial: "+49 4471 965 258" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 27,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3619",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Meyra",
      person_lastname: "Ylmaz",
      person_name: "Ylmaz, Meyra",
      person_name_sort: "Ylmaz Meyra",
      person_callname: "ylmaz_meyra",
      person_email: "yilmaz@awl-steuern.de",
      person_position_title: "",
      person_text: "",
      person_phone: {
        display: "04473 / 9266 - 580",
        dial: "+49 4473 9266 58+49 ",
      },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 28,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3618",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Diana",
      person_lastname: "Zibert",
      person_name: "Zibert, Diana",
      person_name_sort: "Zibert Diana",
      person_callname: "zibert_diana",
      person_email: "zibert@klv-clp.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "04471 / 965 - 144", dial: "+49 4471 965 144" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "",
      person_index: 29,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "139",
      person_id: "3617",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Almina",
      person_lastname: "Zukorlic",
      person_name: "Zukorlic, Almina",
      person_name_sort: "Zukorlic Almina",
      person_callname: "zukorlic_almina",
      person_email: "zukorlic@awl-steuern.de",
      person_position_title: "",
      person_text: "",
      person_phone: { display: "04471 / 965 - 361", dial: "+49 4471 965 361" },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "person-28-3617-zukorlic_almina.jpg",
      person_index: 30,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
    {
      customer_id: "28",
      location_id: "193",
      person_id: "3616",
      person_salutation: "",
      person_icon: "",
      person_firstname: "Birgit",
      person_lastname: "Zweib\u00f6hmer",
      person_name: "Zweib\u00f6hmer, Birgit",
      person_name_sort: "Zweib\u00f6hmer Birgit",
      person_callname: "zweib__hmer_birgit",
      person_email: "zweiboehmer@awl-steuern.de",
      person_position_title: "",
      person_text: "",
      person_phone: {
        display: "04471 / 965 - 140",
        dial: "+49 4471 965 14+49",
      },
      person_fax: { display: "", dial: "" },
      person_cell: { display: "", dial: "" },
      person_photo: "person-3616-zweib__hmer_birgit.jpg",
      person_index: 31,
      person_is_person: "1",
      person_show: {
        atall: "1",
        email: "1",
        phone: "1",
        fax: "1",
        cell: "1",
        position: "1",
      },
      person_for_send: "both",
      person_active: "1",
    },
  ];

  const { app_settings, multiple_locations } = settings;

  // useEffect(() => {
  //   const filteredLocations = locations.filter(
  //     (loc) =>
  //       loc.location_has_persons === "1" ||
  //       loc.location_has_only_persons === "0"
  //   );

  //   console.log("filteredLocations: ", filteredLocations); // Zum Überprüfen der gefilterten Standorte

  //   if (multiple_locations === "0" && filteredLocations.length === 1) {
  //     setSelectedLocation(filteredLocations[0].location_id);
  //   }
  // }, [locations, multiple_locations]);

  useEffect(() => {
    const filteredLocations = locations.filter(
      (loc) => loc.location_has_persons === "1"
    );

    // console.log("filteredLocations: ", filteredLocations); // Zum Überprüfen der gefilterten Standorte

    if (multiple_locations === "0" && filteredLocations.length === 1) {
      setSelectedLocation(filteredLocations[0].location_id);
    }
  }, [locations, multiple_locations]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const renderSettingsFields = () => {
    // const { app_settings } = settings;
    // console.log(app_settings);
    return Object.entries(app_settings).map(([key, value]) => {
      // Überspringe location und person
      if (key === "location" || key === "person") {
        return null;
      }

      if (value.available === "1") {
        return (
          <Input
            key={key}
            placeholder={value.placeholder_text}
            placeholderTextColor="grey" // Stil für den Platzhalter
            leftIcon={<SimpleLineIcons name="user" size={20} color="black" />}
            // label={value.help_info_text}
            onChangeText={(text) => handleInputChange(key, text)}
            value={formData[key]}
            errorMessage={
              value.mandatory === "1" && !formData[key]
                ? value.validation_info
                : ""
            }
            // Fügen Sie hier Ihren benutzerdefinierten Stil hinzu
            inputStyle={{ color: "black", fontSize: 15 }} // Stil für den Text
          />
        );
      }
    });
  };

  // Standorte und Personen für Dropdowns vorbereiten
  const locationData = locations
    .filter((loc) => {
      console.log(
        `Checking location: ${loc.location_display_name}, has_persons: ${loc.location_has_persons}, has_only_persons: ${loc.location_has_only_persons}`
      );
      return (
        loc.location_has_persons === "1" ||
        loc.location_has_only_persons === "0"
      );
    })
    .map((loc) => ({
      label: loc.location_display_name,
      value: loc.location_id,
    }));

  console.log("locationData: ", locationData);

  const personData = persons
    .filter((person) => person.location_id === selectedLocation)
    .map((per) => ({
      label: per.person_name,
      value: per.person_id,
    }));

  // Funktionen, um den Fokus-Zustand zu verwalten
  const onFocus = () => setIsFocus(true);
  const onBlur = () => setIsFocus(false);

  // UI für jedes Dropdown
  const renderDropdown = (key, data, value, onChange, dropdown) => {
    const setting = app_settings[key];

    // Wenn key "location" ist, überprüfen ob das Dropdown angezeigt werden soll
    if (
      key === "location" &&
      (multiple_locations !== "1" ||
        locations.filter(
          (loc) =>
            loc.location_has_persons === "1" ||
            loc.location_has_only_persons === "0"
        ).length <= 1)
    ) {
      return null;
    }

    return (
      <View style={styles.DropdownContainer}>
        <Dropdown
          style={[styles.dropdownFirst, dropdown]}
          placeholderStyle={[
            styles.placeholderStyle,
            !value && { color: "grey", fontSize: 15 },
          ]}
          selectedTextStyle={[
            styles.selectedTextStyle,
            value && { color: "black", fontSize: 15 },
          ]}
          iconStyle={styles.iconStyle}
          data={data}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!value ? setting.placeholder_text : "..."}
          value={value}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(item) => {
            onChange(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <SimpleLineIcons
              style={styles.icon}
              color="black"
              name="user"
              size={20}
            />
          )}
        />
      </View>
    );
  };

  const createGrid = (columnSpacing, rowSpacing) => {
    let gridElements = [];

    // Berechnen der Anzahl der Spalten und Zeilen basierend auf dem Abstand
    const numColumns = Math.floor(width / columnSpacing);
    const numRows = Math.floor(height / rowSpacing);

    // Erstellen der Spalten
    for (let i = 0; i < numColumns; i++) {
      gridElements.push(
        <View
          key={`column-${i}`}
          style={{
            borderColor: "rgba(0,0,0,0.2)",
            borderWidth: 1,
            height: height,
            width: 1,
            position: "absolute",
            left: columnSpacing * i,
          }}
        />
      );
    }

    // Erstellen der Zeilen
    for (let j = 0; j < numRows; j++) {
      gridElements.push(
        <View
          key={`row-${j}`}
          style={{
            borderColor: "rgba(0,0,0,0.2)",
            borderWidth: 1,
            width: width,
            height: 1,
            position: "absolute",
            top: rowSpacing * j,
          }}
        />
      );
    }

    return gridElements;
  };

  // Verwendung der Funktion mit benutzerdefinierten Abständen
  // Beispiel: createGrid(50, 50) für ein Raster mit 50px Abstand

  return (
    <ScrollView>
      {/* <View style={styles.gridContainer}>{createGrid(50, 38)}</View> */}
      <View style={styles.container}>{renderSettingsFields()}</View>
      <View style={styles.container}>
        {/* Zeige das Location Dropdown nur, wenn multiple_locations '1' ist */}
        {multiple_locations === "1" &&
          renderDropdown(
            "location",
            locationData,
            selectedLocation,
            setSelectedLocation
          )}

        {/* Zeige das Person Dropdown, wenn multiple_locations '0' ist oder eine Location ausgewählt wurde */}
        {(multiple_locations === "0" || selectedLocation) &&
          renderDropdown(
            "person",
            personData,
            selectedPerson,
            setSelectedPerson,
            multiple_locations === "1" && styles.dropdown
          )}
      </View>
    </ScrollView>
  );
}

export default StandardSettings;

const styles = StyleSheet.create({
  // ... Ihre Stildefinitionen
  container: {
    borderColor: "black",
    // borderWidth: 1,
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 15,
  },
  dropdownFirst: {
    margin: 5,
    marginTop: 2,
    borderBottomWidth: 1,
    paddingBottom: 7,
    borderColor: "grey",
  },
  dropdown: {
    margin: 5,
    marginTop: 28,
    borderBottomWidth: 1,
    paddingBottom: 7,
    borderColor: "grey",
  },
  label: {
    margin: 5,
    marginBottom: 0,
  },
  icon: {
    marginRight: 8,
    marginLeft: 5,
  },
  gridContainer: {
    position: "absolute",
    pointerEvents: "none",
    top: -28,
    left: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("screen").height,
    zIndex: 1000, // Stellen Sie sicher, dass das Gitter über allen anderen Elementen liegt
  },
});
