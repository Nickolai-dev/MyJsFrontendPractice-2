module.exports = {
  query: [{
    location: '/api',
    sources: [{
      databaseName: 'select-example-options',
      content: {
        mime: 'application/json',
        data: () => {return JSON.stringify({query: ['Afghanistan', 'Akrotiri', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Ashmore and Cartier Islands', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas, The', 'Bahrain', 'Bangladesh', 'Barbados', 'Bassas da India', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean Territory', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burma', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Clipperton Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo, Democratic Republic of the', 'Congo, Republic of the', 'Cook Islands', 'Coral Sea Islands', 'Costa Rica', "Cote d'Ivoire", 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Dhekelia', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Europa Island', 'Falkland Islands (Islas Malvinas)', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern and Antarctic Lands', 'Gabon', 'Gambia, The', 'Gaza Strip', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Glorioso Islands', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard Island and McDonald Islands', 'Holy See (Vatican City)', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Jan Mayen', 'Japan', 'Jersey', 'Jordan', 'Juan de Nova Island', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia, Federated States of', 'Moldova', 'Monaco', 'Mongolia', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nauru', 'Navassa Island', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paracel Islands', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Islands', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Pierre and Miquelon', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia and Montenegro', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia and the South Sandwich Islands', 'Spain', 'Spratly Islands', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tromelin Island', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 'Virgin Islands', 'Wake Island', 'Wallis and Futuna', 'West Bank', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe']});}
      }
    }, {
      databaseName: 'messages',
      content: {
        mime: 'application/json',
        data: () => {
          return JSON.stringify({
            query: [{
              name: 'Advanda Cro', avatar: 'img/contact/1.jpg', date: '16 Sept', description: 'Please done this project as soon as possible'
            }, {
              name: 'Sulaiman Din', avatar: 'img/contact/2.jpg', date: '16 Sept', description: 'Please done this project as soon as possible'
            }, {
              name: 'Victor Jara', avatar: 'img/contact/3.jpg', date: '16 Sept', description: 'Please done this project as soon as possible'
            }, {
              name: 'Victor Jara', avatar: 'img/contact/4.jpg', date: '16 Sept', description: 'Please done this project as soon as possible'
            }]
          })
        }
      }
    }, {
      databaseName: 'notifications',
      content: {
        mime: 'application/json',
        data: () => {
          return JSON.stringify({
            query: [{
              name: 'Advanda Cro', type: 'success', date: '16 Sept', short_descr: 'Please done this project as soon as possible'
            }, {
              name: 'Sulaiman Din', type: 'cloud-disk', date: '16 Sept', short_descr: 'Please done this project as soon as possible'
            }, {
              name: 'Victor Jara', type: 'erase', date: '16 Sept', short_descr: 'Please done this project as soon as possible'
            }, {
              name: 'Victor Jara', type: 'stonks', date: '16 Sept', short_descr: 'Please done this project as soon as possible'
            }]
          })
        }
      }
    }, {
      databaseName: 'news',
      content: {
        mime: 'application/json',
        data: () => {
          return JSON.stringify({
            query: [{
              photo: 'img/contact/1.jpg', content: 'The point of using Lorem Ipsum is that it has a more-or-less normal.', date: 'Yesterday 2:45 pm'
            }, {
              photo: 'img/contact/2.jpg', content: 'The point of using Lorem Ipsum is that it has a more-or-less normal.', date: 'Yesterday 2:45 pm'
            }, {
              photo: 'img/contact/3.jpg', content: 'The point of using Lorem Ipsum is that it has a more-or-less normal.', date: 'Yesterday 2:45 pm'
            }, {
              photo: 'img/contact/4.jpg', content: 'The point of using Lorem Ipsum is that it has a more-or-less normal.', date: 'Yesterday 2:45 pm'
            }, {
              photo: 'img/contact/1.jpg', content: 'The point of using Lorem Ipsum is that it has a more-or-less normal.', date: 'Yesterday 2:45 pm'
            }, {
              photo: 'img/contact/2.jpg', content: 'The point of using Lorem Ipsum is that it has a more-or-less normal.', date: 'Yesterday 2:45 pm'
            }, {
              photo: 'img/contact/3.jpg', content: 'The point of using Lorem Ipsum is that it has a more-or-less normal.', date: 'Yesterday 2:45 pm'
            }, {
              photo: 'img/contact/4.jpg', content: 'The point of using Lorem Ipsum is that it has a more-or-less normal.', date: 'Yesterday 2:45 pm'
            }]
          })
        }
      }
    }, {
      databaseName: 'recent-activity',
      content: {
        mime: 'application/json',
        data: () => {
          return JSON.stringify({
            query: [{
              action: 'New user registered', date: '1 hours ago', info: 'The point of using Lorem Ipsum is that it has a more-or-less normal.'
            }, {
              action: 'New user registered', date: '2 hours ago', info: 'The point of using Lorem Ipsum is that it has a more-or-less normal.'
            }, {
              action: 'New user registered', date: '3 hours ago', info: 'The point of using Lorem Ipsum is that it has a more-or-less normal.'
            }, {
              action: 'New user registered', date: '4 hours ago', info: 'The point of using Lorem Ipsum is that it has a more-or-less normal.'
            }, {
              action: 'New user registered', date: '5 hours ago', info: 'The point of using Lorem Ipsum is that it has a more-or-less normal.'
            }, {
              action: 'New user registered', date: '6 hours ago', info: 'The point of using Lorem Ipsum is that it has a more-or-less normal.'
            }, {
              action: 'New user registered', date: '9 hours ago', info: 'The point of using Lorem Ipsum is that it has a more-or-less normal.'
            }]
          })
        }
      }
    }, {
      databaseName: 'user-settings',
      content: {
        mime: 'application/json',
        data: () => {
          return JSON.stringify({
            query: [{
              set: 'Show notifications', val: false
            }, {
              set: 'Disable chat', val: false,
            }, {
              set: 'Enable history', val: false,
            }, {
              set: 'Show charts', val: false,
            }, {
              set: 'Update everyday', val: true,
            }, {
              set: 'Global search', val: true,
            }, {
              set: 'Offline users', val: true,
            }]
          })
        }
      }
    }]
  }],
  loadContent: function(path, parser=(content)=>content) {
    let url;
    try {
      url = new URL(path);
    } catch (e) {
      url = new URL('http://example.com' + (path[0] === '/' ? '' : '/') + path);
    }
    let location = url.pathname, searchParams = new URLSearchParams(url.search), dbName = searchParams.get('database');
    for(let contentLocation of module.exports.query) {
      if (contentLocation.location === location) {
        for(let source of contentLocation.sources) {
          if(source.databaseName === dbName) {
            return parser(source.content.data());
          }
        }
      }
    }
  }
}
