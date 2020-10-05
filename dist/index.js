'use strict';

var expressGraphql = require('express-graphql');
var express = require('express');
var graphql = require('graphql');
var axios = require('axios');
var numeral = require('numeral');
var DataLoader = require('dataloader');
var slugify = require('@sindresorhus/slugify');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var numeral__default = /*#__PURE__*/_interopDefaultLegacy(numeral);
var DataLoader__default = /*#__PURE__*/_interopDefaultLegacy(DataLoader);
var slugify__default = /*#__PURE__*/_interopDefaultLegacy(slugify);

var queryBuilder = {
    property(args) {
        const lang = args[0] ? args[0].lang : 'en';

        let query = `SELECT ?entity ?prop ?statement (?vLabel as ?value) (?tLabel as ?type) (?uLabel as ?unit)`;

        query += ` WHERE {`;

        query += ` VALUES (?entity ?prop ?ps ?psv ) {`;

        args.forEach(i => {
            query += ` (wd:${i.entityId} p:${i.propId} ps:${i.propId} psv:${i.propId})`;
        });

        query += `}`;

        query += ` OPTIONAL { ?entity ?prop ?statement . ?statement ?ps ?v }`;

        query += ` OPTIONAL { ?entity ?prop ?statement . ?statement ?ps ?v . ?statement ?psv ?vnode . ?vnode rdf:type ?t . ?vnode wikibase:quantityUnit ?u . }`;

        query += `filter (!isLiteral(?statement) || lang(?statement) = "" || lang(?statement) = "${lang}")`;

        query += `SERVICE wikibase:label { bd:serviceParam wikibase:language "${lang}" . ?t rdfs:label ?tLabel . ?v rdfs:label ?vLabel . ?u rdfs:label ?uLabel }`;

        query += `}`;

        return query
    }
};

var props = [
	{
		description: "identifier for a participants of UEFA Euro 2008 at 08euro.Ru site",
		datatype: "external-id",
		id: "P7111",
		label: "08euro.Ru person ID",
		example: [
			332467,
			314724,
			192648
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person 100bombardirov.ru",
		datatype: "external-id",
		id: "P6632",
		label: "100 bombardirov person ID",
		example: [
			380028,
			178722,
			713891,
			203002
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete who participated at the 2006 Commonwealth Games",
		datatype: "external-id",
		id: "P5716",
		label: "2006 Commonwealth Games athlete ID",
		example: [
			56173542,
			1238292,
			6069314
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete who participated at 2014 Commonwealth Games",
		datatype: "external-id",
		id: "P6953",
		label: "2014 Commonwealth Games athlete ID",
		example: [
			1189,
			1541058,
			716951
		],
		types: [
		],
		aliases: [
			"2014 Commonwealth Games ID"
		]
	},
	{
		description: "247Sports ID for Football and Basketball Prospects",
		datatype: "external-id",
		id: "P7397",
		label: "247Sports ID",
		example: [
			1339239,
			36159,
			3850406,
			27881287
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for players at 365chess.com",
		datatype: "external-id",
		id: "P3314",
		label: "365chess player ID",
		example: [
			4332746,
			1411359
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "representation of any three-dimensional surface of an object",
		datatype: "commonsMedia",
		id: "P4896",
		label: "3D model",
		example: [
			243,
			16343,
			600446
		],
		types: [
			"for Commons"
		],
		aliases: [
			"three-dimensional model",
			"STL file",
			"3-D model",
			"model"
		]
	},
	{
		description: "identifier of chemical compounds in 3DMet database",
		datatype: "external-id",
		id: "P2796",
		label: "3DMet ID",
		example: [
			288236,
			153
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"3DMET ID"
		]
	},
	{
		description: "profile on 500 Queer Scientists database",
		datatype: "external-id",
		id: "P8243",
		label: "500 Queer Scientists profile",
		example: [
			48924599,
			60172217,
			56755369,
			42306777
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the 8-bits.info ddatabase",
		datatype: "url",
		id: "P7890",
		label: "8-bits.info URL",
		example: [
			7760408,
			11540014
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID in the 90minut website for a football/soccer player",
		datatype: "external-id",
		id: "P3605",
		label: "90minut player ID",
		example: [
			190651
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a association football (soccer) team in the 90minut.pl database",
		datatype: "external-id",
		id: "P7453",
		label: "90minut.pl team ID",
		example: [
			769793,
			9323399,
			190943
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a church at the A Church Near You website",
		datatype: "external-id",
		id: "P5464",
		label: "A Church Near You church ID",
		example: [
			15179424,
			24902318,
			7592233,
			17530236
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a topic, used by the American Association for the Advancement of Science (AAAS)",
		datatype: "external-id",
		id: "P7456",
		label: "AAAS keyword ID",
		example: [
			333,
			21198,
			125928
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"American Association for the Advancement of Science keyword ID",
			"AAAS news by subject ID",
			"American Association for the Advancement of Science news by subject ID",
			"AAAS news subject ID",
			"American Association for the Advancement of Science news subject ID"
		]
	},
	{
		description: "identifier for a player in the ABA League website",
		datatype: "external-id",
		id: "P6850",
		label: "ABA League ID",
		example: [
			166241,
			19520044,
			19957289
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a bird taxon, issued by the American Birding Association",
		datatype: "external-id",
		id: "P4526",
		label: "ABA bird ID",
		example: [
			733375,
			805774,
			1268697
		],
		types: [
		],
		aliases: [
			"American Birding Association bird ID"
		]
	},
	{
		description: "unique identifier of a taxon listed in the Australian Bird and Bat Banding Scheme Database",
		datatype: "external-id",
		id: "P7093",
		label: "ABBBS Taxon ID",
		example: [
			1242812,
			525717,
			1830308
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the American Battle Monuments Commission website",
		datatype: "external-id",
		id: "P5756",
		label: "ABMC person ID",
		example: [
			42718390,
			5538307,
			449894
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Australian Standard Classification of Languages ID for languages",
		datatype: "external-id",
		id: "P1251",
		label: "ABS ASCL 2011 code",
		example: [
			33311,
			3298041,
			36745,
			774343
		],
		types: [
			"representing a unique identifier",
			"for items about languages"
		],
		aliases: [
			"Australian Standard Classification of Languages, Second Edition, 2011",
			"1267.0 Australian Standard Classification of Languages, Second Edition, 2011",
			"ASCL 2011 code"
		]
	},
	{
		description: "identifier for a knot in the Ashley Book of Knots",
		datatype: "external-id",
		id: "P1806",
		label: "ABoK number",
		example: [
			1121375
		],
		types: [
		],
		aliases: [
			"Ashley Book of Knots number"
		]
	},
	{
		description: "identifier for an author on the website of the Archives de la critique d'art website",
		datatype: "external-id",
		id: "P6635",
		label: "ACA author ID",
		example: [
			61959566,
			20966423,
			61959591
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a coach at ACB.com",
		datatype: "external-id",
		id: "P6297",
		label: "ACB.com coach ID",
		example: [
			1727651,
			186156,
			5941073
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID for a basketball player at ACB.com",
		datatype: "external-id",
		id: "P3525",
		label: "ACB.com player ID",
		example: [
			3849644
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "registration identifier for a composition at ACE Repertory",
		datatype: "external-id",
		id: "P4894",
		label: "ACE Repertory work ID",
		example: [
			1002853,
			1156952
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ACE work ID",
			"ASCAP ACE work ID"
		]
	},
	{
		description: "ID of an article in ACL Anthology",
		datatype: "external-id",
		id: "P7505",
		label: "ACL Anthology article ID",
		example: [
			60143062,
			59889517,
			57727586
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ACM Computing Classification Code of 2012 (8 digits)",
		datatype: "string",
		id: "P2179",
		label: "ACM Classification Code (2012)",
		example: [
			207434
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Association for Computing Machinery Digital Library (ACM DL) author identifier",
		datatype: "external-id",
		id: "P864",
		label: "ACM Digital Library author ID",
		example: [
			21678556,
			92819
		],
		types: [
		],
		aliases: [
			"ACM DL ID",
			"ACM DL",
			"ACM Digital Library author identifier",
			"ACM DL author ID",
			"ACM DL profile ID",
			"ACM profile ID"
		]
	},
	{
		description: "unique identifier for a bibliographic record in the Association for Computing Machinery (ACM) Digital Library",
		datatype: "external-id",
		id: "P3332",
		label: "ACM Digital Library citation ID",
		example: [
			27187137,
			24074986
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ACM Digital Library citation identifier",
			"ACM DL citation ID"
		]
	},
	{
		description: "unique identifier of an event or conference series of the Association for Computing Machinery (ACM)",
		datatype: "external-id",
		id: "P3333",
		label: "ACM Digital Library event ID",
		example: [
			3570023,
			21682678
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ACM Digital Library event identifier",
			"ACM DL event ID"
		]
	},
	{
		description: "identifier for a journal published by ACM",
		datatype: "external-id",
		id: "P7983",
		label: "ACM Journal ID",
		example: [
			52784473,
			2076182,
			2444691
		],
		types: [
		],
		aliases: [
			"ACM Digital Library Journal ID"
		]
	},
	{
		description: "identifier for conferences hosted by ACM",
		datatype: "external-id",
		id: "P7979",
		label: "ACM conference ID",
		example: [
			781419,
			3570023,
			20888918,
			21682678
		],
		types: [
		],
		aliases: [
			"ACM Digital Library Conference ID"
		]
	},
	{
		description: "unique identifier of a Broadcast Service Licence issued by the Australian Communications and Media Authority",
		datatype: "external-id",
		id: "P7716",
		label: "ACMA Broadcast Service Licence Number",
		example: [
			767920,
			967303,
			4636210
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of an organisation or person who holds a radiocommunications licence within Australia",
		datatype: "external-id",
		id: "P2472",
		label: "ACMA Radiocommunications Client Number",
		example: [
			2981744
		],
		types: [
		],
		aliases: [
			"ACMA Register of Radiocommunications Licences Client Number"
		]
	},
	{
		description: "identifier for an object in the Australian Centre for the Moving Image",
		datatype: "external-id",
		id: "P7003",
		label: "ACMI web ID",
		example: [
			467053,
			1140053,
			898721,
			462013
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a journal in the Italian catalog of periodicals",
		datatype: "external-id",
		id: "P6981",
		label: "ACNP journal ID",
		example: [
			15764850,
			253558,
			15757649
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a musical work in Society of Authors, Composers and Music Publishers in Israel (ACUM)",
		datatype: "external-id",
		id: "P8201",
		label: "ACUM work ID",
		example: [
			2602662,
			5064227,
			831449
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist as a member of the French collective rights management organisation ADAGP and sister organisations worldwide",
		datatype: "external-id",
		id: "P3901",
		label: "ADAGP artist ID",
		example: [
			529366,
			5603
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Akademie der Künste in Berlin member ID",
		datatype: "external-id",
		id: "P4114",
		label: "ADK member ID",
		example: [
			25973,
			451600
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Akademie der Künste in Berlin member ID"
		]
	},
	{
		description: "ID for a item in the Anti-Defamation League Hate Symbols Database",
		datatype: "external-id",
		id: "P7404",
		label: "ADL Hate Symbols Database ID",
		example: [
			913583,
			24952543,
			153271
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "bibcode in the Astrophysics Data System",
		datatype: "external-id",
		id: "P819",
		label: "ADS bibcode",
		example: [
			14558831
		],
		types: [
		],
		aliases: [
			"bibcode ADS",
			"Astrophysics Data System bibcode",
			"adsabs ID"
		]
	},
	{
		description: "identifier for a taxon, in the Animal Diversity Web database",
		datatype: "external-id",
		id: "P4024",
		label: "ADW taxon ID",
		example: [
			581472,
			1147592
		],
		types: [
		],
		aliases: [
			"Animal Diversity Web taxon ID"
		]
	},
	{
		description: "identifier for a member of the Academy of Europe",
		datatype: "external-id",
		id: "P5463",
		label: "AE member ID",
		example: [
			253515,
			6548051,
			2232954,
			4978874
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a writer in the Galician Writers Association website",
		datatype: "external-id",
		id: "P3436",
		label: "AELG ID",
		example: [
			3052784,
			3328083,
			10394406
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author on the prosopographical website of the 'Association française pour l'avancement des sciences'",
		datatype: "external-id",
		id: "P6038",
		label: "AFAS author ID",
		example: [
			57700610,
			3785742,
			3102691
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique identifier for a food type in the Australian Food Composition Database",
		datatype: "external-id",
		id: "P7089",
		label: "AFCD PFKID",
		example: [
			1140131,
			806097,
			38645
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Australian Food Composition Database ID",
			"Australian Food Composition Database"
		]
	},
	{
		description: "identifier of a film (movie) in the American Film Institute Catalog of Feature Film",
		datatype: "external-id",
		id: "P3593",
		label: "AFI Catalog of Feature Films ID",
		example: [
			1193924,
			181803,
			24815
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID for a VFL/AFL coach at afltables.com",
		datatype: "external-id",
		id: "P4885",
		label: "AFL Tables coach ID",
		example: [
			27435058
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID for a VFL/AFL player at afltables.com",
		datatype: "external-id",
		id: "P3547",
		label: "AFL Tables player ID",
		example: [
			5026412
		],
		types: [
		],
		aliases: [
			"AFL Tables ID",
			"AflRleague ID",
			"afltables ID",
			"afltables.com ID"
		]
	},
	{
		description: "ID for a VFL/AFL umpire at afltables.com",
		datatype: "external-id",
		id: "P4888",
		label: "AFL Tables umpire ID",
		example: [
			7488168
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a Australian rules footballer from AFL club player profile pages",
		datatype: "external-id",
		id: "P8277",
		label: "AFL player ID",
		example: [
			5243280,
			7490805,
			61635871,
			76670647
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P2345",
		label: "AGORHA event identifier",
		example: [
			15630512
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person or institution in the Agorha database (INHA)",
		datatype: "external-id",
		id: "P2342",
		label: "AGORHA person/institution ID",
		example: [
			296,
			23402
		],
		types: [
		],
		aliases: [
			"AGORHA",
			"Beaux-arts ID"
		]
	},
	{
		description: "Identifier for historical art resources",
		datatype: "external-id",
		id: "P2344",
		label: "AGORHA work ID",
		example: [
			12418,
			18573361
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a subject in AGROVOC thesaurus",
		datatype: "external-id",
		id: "P8061",
		label: "AGROVOC ID",
		example: [
			305345,
			25350,
			136923
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Australian Harmonized Export Commodity Classification 2017",
		datatype: "external-id",
		id: "P8491",
		label: "AHECC 2017 ID",
		example: [
			150463,
			246514,
			191552
		],
		types: [
			"related to economics"
		],
		aliases: [
		]
	},
	{
		description: "unique identifier of a chemical in the Australian Inventory of Chemical Substances",
		datatype: "external-id",
		id: "P7049",
		label: "AICS Chemical ID",
		example: [
			2314,
			2685750,
			23951957,
			189090
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier number issued  by AICTE, the authorized organization in India which grants approval for starting and accreditation technical institutions in India",
		datatype: "external-id",
		id: "P6513",
		label: "AICTE Permanent ID",
		example: [
			48990363,
			6319379,
			16900441,
			5970569
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier number issued annually for institutions who need to re-apply for accreditation by the All India Council for Technical Education",
		datatype: "external-id",
		id: "P4897",
		label: "AICTE institute application ID",
		example: [
			7928162,
			39056007
		],
		types: [
		],
		aliases: [
			"AICTE ID"
		]
	},
	{
		description: "identifier for a freediver on the Association internationale pour le développement de l'apnée website",
		datatype: "external-id",
		id: "P4957",
		label: "AIDA freediver ID",
		example: [
			17506155,
			3120107
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "іdentifier for a biographical page on the site of the National Database of Irish-Language Biographies",
		datatype: "external-id",
		id: "P4929",
		label: "AINM ID",
		example: [
			15976242,
			76934
		],
		types: [
		],
		aliases: [
			"An Bunachar Náisiúnta Beathaisnéisí Gaeilge ID",
			"The National Database of Irish-Language Biographies ID"
		]
	},
	{
		description: "identifier for a college, university, or standalone institution in India issued by the All India Survey on Higher Education",
		datatype: "external-id",
		id: "P6392",
		label: "AISHE code",
		example: [
			6454069,
			7123933,
			17198882
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "artist identifier in the Artists of the World Online database",
		datatype: "external-id",
		id: "P4432",
		label: "AKL Online artist ID",
		example: [
			23469792,
			41622501,
			603105
		],
		types: [
		],
		aliases: [
			"Artists of the World Online ID",
			"AKLONLINE artist ID"
		]
	},
	{
		description: "identifier for an author on the ALCA Nouvelle-Aquitaine website",
		datatype: "external-id",
		id: "P6158",
		label: "ALCA author ID",
		example: [
			3192652,
			3379433,
			3511478
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a philosopher in the ALCUIN Infothek der Scholastik",
		datatype: "external-id",
		id: "P3126",
		label: "ALCUIN ID",
		example: [
			380647,
			102851
		],
		types: [
		],
		aliases: [
			"ALCUIN philosopher ID"
		]
	},
	{
		description: "identifier for a female golf player on the Australian Ladies Professional Golf website",
		datatype: "external-id",
		id: "P3953",
		label: "ALPG Tour golf player ID",
		example: [
			25936013,
			271024
		],
		types: [
		],
		aliases: [
			"Australian Ladies Professional Golf golfer ID",
			"ALPG golfer ID"
		]
	},
	{
		description: "identifier for a film in Academy of Motion Picture Arts and Sciences (AMPAS) collections catalog",
		datatype: "external-id",
		id: "P7118",
		label: "AMPAS collections film ID",
		example: [
			103474,
			546829,
			132689,
			24815
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person or organization represented in the Academy of Motion Picture Arts and Sciences (AMPAS) collections catalog",
		datatype: "external-id",
		id: "P7119",
		label: "AMPAS collections person ID",
		example: [
			280098,
			2071,
			350819
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a movie from the website Archiviodelcinemaitaliano.it",
		datatype: "external-id",
		id: "P6151",
		label: "ANICA ID",
		example: [
			375725,
			168154,
			3796049,
			778696,
			2492221,
			3910938,
			3603003
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a clinical trial in the Australian New Zealand Clinical Trials Registry",
		datatype: "external-id",
		id: "P7019",
		label: "ANZCTR ID",
		example: [
			61981481,
			65243474,
			62104859
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a writer on the Academy of New Zealand Literature website",
		datatype: "external-id",
		id: "P5635",
		label: "ANZL writer ID",
		example: [
			7856776,
			4910026,
			20740569
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "the Australian and New Zealand Standard Classification of Occupations, 2013, by the Australian Bureau of Statistics and Stats NZ",
		datatype: "external-id",
		id: "P8458",
		label: "ANZSCO 2013 ID",
		example: [
			484876,
			19940089,
			97119038
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of division/subdivision/group/class in the Australian and New Zealand Standard Industrial Classification 2006",
		datatype: "external-id",
		id: "P8490",
		label: "ANZSIC 2006 ID",
		example: [
			11451,
			176353,
			29584848
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for criminal offences in Australian and New Zealand",
		datatype: "external-id",
		id: "P8457",
		label: "ANZSOC 2011 ID",
		example: [
			132821,
			21482425
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Australia and New Zealand Standard Research Classification 2008 identifier for a field of research.  1419 nodes at 3 levels: 22 Divisions, 157 Groups, 1340 Fields",
		datatype: "external-id",
		id: "P5922",
		label: "ANZSRC 2008 FoR ID",
		example: [
			56679322,
			12128,
			504033
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"FOR",
			"Fields of Research",
			"ANZSRC 2008 code"
		]
	},
	{
		description: "Australia and New Zealand Standard Research Classification 2020 identifier for a field of research",
		datatype: "external-id",
		id: "P8529",
		label: "ANZSRC 2020 FoR ID",
		example: [
			12128,
			160398,
			504033
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a species on the Alabama Plant Atlas website",
		datatype: "external-id",
		id: "P6137",
		label: "APA ID",
		example: [
			5384814,
			15527062,
			1264038
		],
		types: [
		],
		aliases: [
			"Alabama Plant Atlas ID",
			"floraofalabama.org ID"
		]
	},
	{
		description: "symbol of a phoneme in the Americanist Phonetic Notation",
		datatype: "string",
		id: "P4325",
		label: "APA phoneme code",
		example: [
			778145
		],
		types: [
			"with datatype string that is not an external identifier"
		],
		aliases: [
		]
	},
	{
		description: "base URL of a web service",
		datatype: "url",
		id: "P6269",
		label: "API endpoint",
		example: [
			2013,
			364
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a plant, in the Australian Plant Name index",
		datatype: "external-id",
		id: "P5984",
		label: "APNI ID",
		example: [
			2882681,
			17400729,
			57275144
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person (including members) on the website of the 'Académie royale de Belgique'",
		datatype: "external-id",
		id: "P6235",
		label: "ARB person ID",
		example: [
			55773102,
			16010220,
			55911420
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique number used to identify archival collection locations within the UK and key global repositories holding collections relating to British history",
		datatype: "external-id",
		id: "P3642",
		label: "ARCHON code",
		example: [
			6670589
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a show on ARD Mediathek",
		datatype: "external-id",
		id: "P6067",
		label: "ARD Mediathek ID",
		example: [
			2558646,
			19916,
			689438
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for stars in ARICNS",
		datatype: "external-id",
		id: "P999",
		label: "ARICNS",
		example: [
			955530
		],
		types: [
			"representing a unique identifier",
			"for astronomical objects"
		],
		aliases: [
		]
	},
	{
		description: "formatter to generate Archival Resource Key.  Include $1 to be replaced with property value",
		datatype: "string",
		label: "ARK formatter",
		id: "P8054",
		types: [
			"metaproperty",
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon, in the ARKive database",
		datatype: "external-id",
		id: "P2833",
		label: "ARKive ID",
		example: [
			1315848,
			25694005
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier on the ARLHS World List of Lights",
		datatype: "external-id",
		id: "P2980",
		label: "ARLHS lighthouse ID",
		example: [
			3378463,
			5034946
		],
		types: [
		],
		aliases: [
			"ARLHS World List of Lights ID",
			"World List of Lights ID",
			"WLOL ID",
			"ARLHS WLOL ID"
		]
	},
	{
		description: "identifier for medieval literature",
		datatype: "external-id",
		id: "P4549",
		label: "ARLIMA ID",
		example: [
			3176749,
			4302
		],
		types: [
		],
		aliases: [
			"Archives de littérature du Moyen Âge ID"
		]
	},
	{
		description: "identifier for a member of the 'Académie royale de langue et de littérature françaises de Belgique' on its website",
		datatype: "external-id",
		id: "P6226",
		label: "ARLLFB member ID",
		example: [
			3123585,
			21191653,
			49747
		],
		types: [
		],
		aliases: [
			"Académie royale de langue et de littérature françaises de Belgique ID"
		]
	},
	{
		description: "Royal Academy of Medicine of Belgium member ID",
		datatype: "external-id",
		id: "P5329",
		label: "ARMB member ID",
		example: [
			234590,
			25913567,
			7504
		],
		types: [
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "identifier for races held by ARRS (Association of Road Racing Statisticians)",
		datatype: "external-id",
		id: "P5090",
		label: "ARRS race ID",
		example: [
			29467338
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID of player by ARRS (Association of Road Racing Statisticians)",
		datatype: "external-id",
		id: "P3653",
		label: "ARRS runner ID",
		example: [
			6284597,
			3289571
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on the Art Institute of Chicago website",
		datatype: "external-id",
		id: "P6295",
		label: "ARTIC artist ID",
		example: [
			38004410,
			34013,
			25996195
		],
		types: [
		],
		aliases: [
			"Art Institute of Chicago artist ID"
		]
	},
	{
		description: "identifier for an artwork on the Art Institute of Chicago website",
		datatype: "external-id",
		id: "P4610",
		label: "ARTIC artwork ID",
		example: [
			464782,
			1044742
		],
		types: [
		],
		aliases: [
			"Art Institute of Chicago artwork ID"
		]
	},
	{
		description: "identifier for an exhibition on the Art Institute of Chicago website",
		datatype: "external-id",
		id: "P6294",
		label: "ARTIC exhibition ID",
		example: [
			50328612,
			50091625,
			30150382
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an university on the Academic Ranking of World Universities website",
		datatype: "external-id",
		id: "P5242",
		label: "ARWU university ID",
		example: [
			500740,
			586904
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Academic Ranking of World Universities ID",
			"university ranking on ARWU site",
			"rank of university on ARWU site"
		]
	},
	{
		description: "identifier for an athlete on AS.com",
		datatype: "external-id",
		id: "P3427",
		label: "AS.com athlete ID",
		example: [
			3401587,
			10132,
			201367
		],
		types: [
		],
		aliases: [
			"Diario AS athlete ID"
		]
	},
	{
		description: "identifier for a topic, in the African Studies Centre (ASC) Leiden's Thesaurus",
		datatype: "external-id",
		id: "P5198",
		label: "ASC Leiden Thesaurus ID",
		example: [
			74333,
			15
		],
		types: [
		],
		aliases: [
			"African Studies Thesaurus ID",
			"ASCL Thesaurus ID"
		]
	},
	{
		description: "identifier in the Australian Standard Classification of Cultural and Ethnic Groups 2019",
		datatype: "external-id",
		id: "P8488",
		label: "ASCCEG 2019 ID",
		example: [
			40184541,
			6122670,
			12060728
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a landmark on the American Society of Civil Engineers website",
		datatype: "external-id",
		id: "P5904",
		label: "ASCE Historical Civil Engineering Landmark ID",
		example: [
			5619278,
			1632797,
			551446
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Australian Standard Classification of Religious Groups 2016",
		datatype: "external-id",
		id: "P8456",
		label: "ASCRG 2016 ID",
		example: [
			748,
			6423963,
			540766
		],
		types: [
		],
		aliases: [
			"Australian Standard Classification of Religious Groups 2016 ID"
		]
	},
	{
		description: "unique identifier for caves within the Karst Index Database of the Australian Speleological Federation",
		datatype: "external-id",
		id: "P2792",
		label: "ASF KID Cave Tag Number",
		example: [
			10954073,
			23936376
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Karst Index Database",
			"Australian Speleological Federation KID",
			"KID"
		]
	},
	{
		description: "identifier of a refrigerant assigned in ANSI/ASHRAE standard 34",
		datatype: "external-id",
		id: "P4842",
		label: "ASHRAE refrigerant number",
		example: [
			4087,
			905750,
			413079,
			423000
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier assigned to monuments catalogued by the Archaeological Survey of India",
		datatype: "external-id",
		id: "P1371",
		label: "ASI Monument ID",
		example: [
			9141
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a member of the 'Académie des Sciences Morales et Politiques' on its website",
		datatype: "external-id",
		id: "P5362",
		label: "ASMP member ID",
		example: [
			1333590,
			3315960
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an entity (person, organization, family) in the Archivi storici dell'Università di Torino",
		datatype: "external-id",
		id: "P8219",
		label: "ASUT ID",
		example: [
			55228059,
			5880109,
			4210480,
			3980757
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "therapeutic chemical identification code per ATC",
		datatype: "external-id",
		id: "P267",
		label: "ATC code",
		example: [
			153,
			3515
		],
		types: [
		],
		aliases: [
			"ATCC"
		]
	},
	{
		description: "ATCvet code",
		datatype: "external-id",
		id: "P1668",
		label: "ATCvet",
		example: [
			213511
		],
		types: [
			"related to chemistry"
		],
		aliases: [
		]
	},
	{
		description: "ATP tennis male player identifier",
		datatype: "external-id",
		id: "P536",
		label: "ATP player ID",
		example: [
			10132
		],
		types: [
		],
		aliases: [
			"ATP ID"
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P3456",
		label: "ATP tennis tournament ID",
		example: [
			974505,
			299439
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a particular year's event in the ATP database",
		datatype: "external-id",
		id: "P6880",
		label: "ATP tennis tournament edition ID",
		example: [
			16663693,
			782553,
			60462270,
			60462530,
			47013030
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a plant taxon, in the Australian Tropical Rainforest plants database",
		datatype: "external-id",
		id: "P6904",
		label: "ATRF ID",
		example: [
			49620560,
			190887,
			64747610,
			1894456,
			133329
		],
		types: [
		],
		aliases: [
			"Australian Tropical Rainforest ID"
		]
	},
	{
		description: "identifier for each of the Latvian administrative units, i.e. municipality, parish, city under state jurisdiction and city under municipality jurisdiction. Based on the {{Q|15621843}}.",
		datatype: "external-id",
		id: "P1115",
		label: "ATVK ID",
		example: [
			2365998
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "indicates the official name of the package on the Arch's User Repository",
		datatype: "external-id",
		id: "P4162",
		label: "AUR package",
		example: [
			29566755
		],
		types: [
			"for software"
		],
		aliases: [
			"Arch Linux AUR repo",
			"package, AUR",
			"package, Arch User Repository"
		]
	},
	{
		description: "identifier of a food group in AUSNUT 2011–13 (AUStralian Food and NUTrient Database)",
		datatype: "external-id",
		id: "P4618",
		label: "AUSNUT 2011–13 Food Group ID",
		example: [
			1795395
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a food in the Australian Food, Supplement and Nutrient Database (AUSNUT) managed by Food Standards Australia New Zealand (FSANZ)",
		datatype: "external-id",
		id: "P2759",
		label: "AUSNUT food ID",
		example: [
			1795395
		],
		types: [
		],
		aliases: [
			"AUSNUT ID",
			"AUSNUT Food Identifier"
		]
	},
	{
		description: "identifier for a language in the Australian Indigenous Languages Database",
		datatype: "external-id",
		id: "P1252",
		label: "AUSTLANG code",
		example: [
			23928173
		],
		types: [
			"for items about languages"
		],
		aliases: [
			"AIATSIS code"
		]
	},
	{
		description: "identifier for a female artist on the Archives of Women Artists, Research and Exhibitions",
		datatype: "external-id",
		id: "P6637",
		label: "AWARE ID",
		example: [
			2849843,
			865253,
			10444417
		],
		types: [
		],
		aliases: [
			"Archives of Women Artists, Research and Exhibitions ID"
		]
	},
	{
		description: "identifier of a person at AZBilliards",
		datatype: "external-id",
		id: "P3531",
		label: "AZBilliards ID",
		example: [
			1162866
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on AZLyrics.com site",
		datatype: "external-id",
		id: "P7194",
		label: "AZLyrics.com artist ID",
		example: [
			383541,
			21808729,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the AaRC site (All about Romanian Cinema)",
		datatype: "external-id",
		id: "P7533",
		label: "AaRC person ID",
		example: [
			28055985,
			18545265,
			12735730,
			12731343
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "index used to classify folktales",
		datatype: "string",
		id: "P2540",
		label: "Aarne–Thompson–Uther Tale Type Index",
		example: [
			11841,
			2439238
		],
		types: [
		],
		aliases: [
			"ATU index"
		]
	},
	{
		description: "identifier in the Abandonia database of DOS video games",
		datatype: "external-id",
		id: "P4962",
		label: "Abandonia identifier",
		example: [
			3300211,
			864177,
			1372919
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a maritime vessel, in the Aberdeen Built Ships database",
		datatype: "external-id",
		id: "P8260",
		label: "Aberdeen Built Ships ID",
		example: [
			1432113,
			2261174,
			5632579
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID for a heritage feature in the Aberdeenshire Historic Environment Record website and database",
		datatype: "external-id",
		id: "P7694",
		label: "Aberdeenshire HER ID",
		example: [
			16981278,
			14943166,
			11839001
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the AboutTheArtists Database",
		datatype: "external-id",
		id: "P7580",
		label: "AboutTheArtists artist ID",
		example: [
			233962,
			74717289,
			129591
		],
		types: [
		],
		aliases: [
			"AboutTheArtists.com artist ID",
			"AboutTheArtists person ID"
		]
	},
	{
		description: "identifier for a videogame at the Absolute Games website",
		datatype: "external-id",
		id: "P8279",
		label: "Absolute Games game ID",
		example: [
			3182559,
			60102,
			2383167
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"AG.ru game ID"
		]
	},
	{
		description: "identifier for a member on the Academia Brasileira de Letras website",
		datatype: "external-id",
		id: "P5527",
		label: "Academia Brasileira de Letras ID",
		example: [
			1100485,
			7136512,
			10340715
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "academic institution page on academia.edu",
		datatype: "external-id",
		id: "P4052",
		label: "Academia.edu institutional ID",
		example: [
			13371,
			672416,
			774609
		],
		types: [
		],
		aliases: [
			"academia.edu ID"
		]
	},
	{
		description: "URL for a person's profile on the Academia.edu website",
		datatype: "url",
		id: "P5715",
		label: "Academia.edu profile URL",
		example: [
			12817,
			23714153,
			822727
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a publication at Academia.edu",
		datatype: "external-id",
		id: "P7896",
		label: "Academia.edu publication ID",
		example: [
			56444131,
			56280159,
			38918394,
			70232105,
			70235068,
			84291564,
			36824537
		],
		types: [
			"multi-source external identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a research topic on the Academia.edu website",
		datatype: "external-id",
		id: "P5801",
		label: "Academia.edu topic ID",
		example: [
			130654,
			44272,
			847
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the AcademiaNet database for excellent female scientists",
		datatype: "external-id",
		id: "P2080",
		label: "AcademiaNet ID",
		example: [
			534590
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifer on academictree.org",
		datatype: "external-id",
		id: "P2381",
		label: "Academic Tree ID",
		example: [
			21575049,
			124505
		],
		types: [
		],
		aliases: [
			"The Academic Family Tree",
			"The Academic Tree ID",
			"Academic Family Tree ID",
			"NeuroTree ID",
			"Neuro Tree ID",
			"ID Tree ID"
		]
	},
	{
		description: "identifier for a film in the official Academy Awards database",
		datatype: "external-id",
		id: "P6145",
		label: "Academy Awards Database film ID",
		example: [
			318169,
			1129227,
			1198611
		],
		types: [
		],
		aliases: [
			"Oscar film ID"
		]
	},
	{
		description: "identifier for nominees in the official Academy Awards database",
		datatype: "external-id",
		id: "P6150",
		label: "Academy Awards Database nominee ID",
		example: [
			873,
			8704,
			42101
		],
		types: [
		],
		aliases: [
			"Oscar nominee ID"
		]
	},
	{
		description: "identifier for a member of the 'Académie d'Arles' on its website",
		datatype: "external-id",
		id: "P6171",
		label: "Académie d'Arles member ID",
		example: [
			3069048,
			58693627,
			55771333
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a member of the 'Académie de Marseille' on its website",
		datatype: "external-id",
		id: "P5839",
		label: "Académie de Marseille member ID",
		example: [
			56418345,
			56418377,
			542253
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a member of the 'Académie de Montpellier' on its website",
		datatype: "external-id",
		id: "P5661",
		label: "Académie de Montpellier member ID",
		example: [
			55472010,
			55847408,
			55847440
		],
		types: [
		],
		aliases: [
			"Montpellier"
		]
	},
	{
		description: "identifier for a member of the 'Académie de Mâcon' on its website",
		datatype: "external-id",
		id: "P5662",
		label: "Académie de Mâcon member ID",
		example: [
			3588405,
			30028009,
			2825116
		],
		types: [
		],
		aliases: [
			"Mâcon"
		]
	},
	{
		description: "identifier for a member of the Académie de Rouen on its website",
		datatype: "external-id",
		id: "P6575",
		label: "Académie de Rouen member ID",
		example: [
			61856589,
			61867533,
			3334909
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a member of the 'Académie de Versailles' on its website",
		datatype: "external-id",
		id: "P5663",
		label: "Académie de Versailles member ID",
		example: [
			21559139,
			56054876,
			56054879
		],
		types: [
		],
		aliases: [
			"Versailles"
		]
	},
	{
		description: "identifier for a member of the Académie des Inscriptions et Belles-Lettres on its website",
		datatype: "external-id",
		id: "P4716",
		label: "Académie des Inscriptions et Belles-Lettres member ID",
		example: [
			47004924,
			445281
		],
		types: [
		],
		aliases: [
			"AIBL ID",
			"AIBL member ID"
		]
	},
	{
		description: "identifier of a member of the Académie des beaux-arts on its website",
		datatype: "external-id",
		id: "P5363",
		label: "Académie des beaux-arts member ID",
		example: [
			3384308,
			3171130,
			27955199
		],
		types: [
		],
		aliases: [
			"Beaux-arts ID"
		]
	},
	{
		description: "identifier for a member on the Académie des sciences d'outre-mer website",
		datatype: "external-id",
		id: "P5374",
		label: "Académie des sciences d'outre-mer member ID",
		example: [
			3291671,
			1257,
			1677955
		],
		types: [
		],
		aliases: [
			"ASOM ID"
		]
	},
	{
		description: "identifier for a prize winner on the Académie française website",
		datatype: "external-id",
		id: "P5645",
		label: "Académie française award winner ID",
		example: [
			1984946,
			3367546,
			55671578
		],
		types: [
		],
		aliases: [
			"Académie française prize winner ID"
		]
	},
	{
		description: "identifier for a member of the Académie française on its website",
		datatype: "external-id",
		id: "P4717",
		label: "Académie française member ID",
		example: [
			353866,
			157313
		],
		types: [
		],
		aliases: [
			"Acad. fr. member ID"
		]
	},
	{
		description: "identifier for a member of Accademia della Crusca",
		datatype: "external-id",
		id: "P4585",
		label: "Accademia della Crusca ID",
		example: [
			674132,
			307
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a member of Accademia delle Scienze di Torino",
		datatype: "external-id",
		id: "P8153",
		label: "Accademia delle Scienze di Torino ID",
		example: [
			315251,
			59630298,
			134085
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on AccuRadio site",
		datatype: "external-id",
		id: "P7230",
		label: "AccuRadio artist ID",
		example: [
			383541,
			21808729,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an album on the Acharts.co music site",
		datatype: "external-id",
		id: "P7143",
		label: "Acharts.co album ID",
		example: [
			155169,
			381119,
			1416620
		],
		types: [
		],
		aliases: [
			"Acharts.co album identifier"
		]
	},
	{
		description: "identifier for a musical artist on Acharts.co",
		datatype: "external-id",
		id: "P7109",
		label: "Acharts.co artist ID",
		example: [
			21621919,
			1744,
			4030
		],
		types: [
		],
		aliases: [
			"Acharts artist ID",
			"ɑCharts artist ID",
			"αCharts artist ID",
			"Acharts.co artist identifier"
		]
	},
	{
		description: "identifier for a record chart on Acharts.co",
		datatype: "external-id",
		id: "P7138",
		label: "Acharts.co chart ID",
		example: [
			180072,
			188819,
			1407678
		],
		types: [
		],
		aliases: [
			"Acharts chart ID",
			"ɑCharts chart ID",
			"αCharts chart ID"
		]
	},
	{
		description: "identifier for a composition, track or single on the Acharts.co music site",
		datatype: "external-id",
		id: "P7166",
		label: "Acharts.co song ID",
		example: [
			56085788,
			21198255
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique identifier in the Dutch Actorenregister database",
		datatype: "external-id",
		id: "P3273",
		label: "Actorenregister ID",
		example: [
			224124
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for author on adelphi.it",
		datatype: "external-id",
		id: "P5859",
		label: "Adelphi author ID",
		example: [
			531606,
			129228,
			9215
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Swedish noble family on Adelsvapen-Wiki",
		datatype: "external-id",
		id: "P7931",
		label: "Adelsvapen ID",
		example: [
			61881525,
			70326138,
			830048,
			2450753,
			61881892,
			16155869,
			81349919
		],
		types: [
			"for items about people",
			"representing a unique identifier"
		],
		aliases: [
			"Adelsvapen-Wiki ID"
		]
	},
	{
		description: "identifier of lighthouses by United Kingdom Hydrographic Office",
		datatype: "external-id",
		id: "P3562",
		label: "Admiralty number",
		example: [
			7625316,
			3378293
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film in AdoroCinema database",
		datatype: "external-id",
		id: "P7777",
		label: "AdoroCinema film ID",
		example: [
			261546,
			1482269,
			58894738,
			171711
		],
		types: [
		],
		aliases: [
			"AdoroCinema movie ID"
		]
	},
	{
		description: "ID for an actor in the Adult Film Database",
		datatype: "external-id",
		id: "P3351",
		label: "Adult Film Database actor ID",
		example: [
			56219,
			5977242,
			1738018
		],
		types: [
		],
		aliases: [
			"Adult Film Database performer ID",
			"AFDB performer ID",
			"AFDB actor ID"
		]
	},
	{
		description: "identifier for a film in the Adult Film Database",
		datatype: "external-id",
		id: "P5083",
		label: "Adult Film Database film ID",
		example: [
			579826,
			7216
		],
		types: [
		],
		aliases: [
			"AFD film ID"
		]
	},
	{
		description: "identifier in the Adventure Gamers database of adventure video games",
		datatype: "external-id",
		id: "P7005",
		label: "Adventure Gamers ID",
		example: [
			580202,
			6497116,
			74401,
			65045498
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a company in the Adventure Gamers database of adventure video games",
		datatype: "external-id",
		id: "P7940",
		label: "Adventure Gamers company ID",
		example: [
			1146905,
			3402678,
			216611,
			1850424
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game series in the Adventure Gamers database of adventure video games",
		datatype: "external-id",
		id: "P8012",
		label: "Adventure Gamers series ID",
		example: [
			1161804,
			533239,
			9348693,
			807106,
			880977,
			339944
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an academic journal on the African Journals Online website",
		datatype: "external-id",
		id: "P6183",
		label: "African Journals Online  journal ID",
		example: [
			58888626,
			58888672,
			58888695
		],
		types: [
		],
		aliases: [
			"AJOL journal ID"
		]
	},
	{
		description: "identifier for a plant taxon, in the Conservatoire et Jardin botaniques de Genève's African Plant Database of scientific names",
		datatype: "external-id",
		id: "P2036",
		label: "African Plant Database ID",
		example: [
			15505521
		],
		types: [
		],
		aliases: [
			"African Plant ID",
			"APDB ID"
		]
	},
	{
		description: "identifier for a movie at Africultures.com",
		datatype: "external-id",
		id: "P4513",
		label: "Africultures movie ID",
		example: [
			2819297
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of a person at French website Africultures",
		datatype: "external-id",
		id: "P4514",
		label: "Africultures person ID",
		example: [
			26214479
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a species on the AfroMoths website",
		datatype: "external-id",
		id: "P6093",
		label: "AfroMoths ID",
		example: [
			13393739,
			13579435,
			5507815,
			13478865
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Reference for a species in the 2013 checklist of over 2,700 species British lepidoptera",
		datatype: "external-id",
		id: "P1744",
		label: "Agassiz checklist number",
		example: [
			1355083
		],
		types: [
		],
		aliases: [
			"Agassiz et al checklist number"
		]
	},
	{
		description: "identifier for a museum, exhibition, collection, or theme, on the 'Agence photo de la Réunion des Musées nationaux et du Grand Palais' website",
		datatype: "external-id",
		id: "P6334",
		label: "Agence photo RMN package ID",
		example: [
			59544945,
			9764,
			160236,
			692
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"L'Agence Photo RMN Grand Palais ID"
		]
	},
	{
		description: "identifier for an hotel on the Agoda website",
		datatype: "external-id",
		id: "P6008",
		label: "Agoda hotel ID",
		example: [
			57570450,
			7037576,
			7312822
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Lexeme information at Ahotsak web",
		datatype: "external-id",
		label: "Ahotsak Lexeme",
		id: "P7559",
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of people and organizations from the Russian newspaper \"Argumenty i Fakty\"",
		datatype: "external-id",
		id: "P6561",
		label: "AiF dossier ID",
		example: [
			18636447,
			201811,
			1960651
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an aircraft specification issued by the United Kingdom Air Ministry",
		datatype: "string",
		id: "P799",
		label: "Air Ministry specification ID",
		example: [
			791096,
			4133941
		],
		types: [
		],
		aliases: [
			"specification",
			"UK Air Ministry specification"
		]
	},
	{
		description: "identifier of a person on Akadem",
		datatype: "external-id",
		id: "P5378",
		label: "Akadem person ID",
		example: [
			3287704,
			457722,
			266382
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on the Akout website",
		datatype: "external-id",
		id: "P5293",
		label: "Akout ID",
		example: [
			2398422,
			3358492,
			3019205
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a topic at Al-Jazeera.com's website",
		datatype: "external-id",
		id: "P7301",
		label: "Al-Jazeera topic ID",
		example: [
			55,
			42418,
			172388,
			2736,
			10806
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete on the Alabama Sports Hall of Fame website",
		datatype: "external-id",
		id: "P4362",
		label: "Alabama Sports Hall of Fame athlete ID",
		example: [
			452574,
			4873633
		],
		types: [
		],
		aliases: [
			"ASHOF athlete ID"
		]
	},
	{
		description: "identifier for an athlete on the Alaska Sports Hall of Fame website",
		datatype: "external-id",
		id: "P4522",
		label: "Alaska Sports Hall of Fame athlete ID",
		example: [
			7037990,
			331125
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of historic resources in the Alberta Register of Historic Places",
		datatype: "external-id",
		id: "P759",
		label: "Alberta Register of Historic Places ID",
		example: [
			683110,
			4711758,
			3145578
		],
		types: [
		],
		aliases: [
			"Alberta Register of Historic Places identifier",
			"Alberta Historic Places ID"
		]
	},
	{
		description: "identifier for an athlete on the Alberta Sports Hall of Fame and Museum website",
		datatype: "external-id",
		id: "P4396",
		label: "Alberta Sports Hall of Fame and Museum athlete ID",
		example: [
			289803,
			4716900
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an album or other release on the Album of the Year (AOTY) website",
		datatype: "external-id",
		id: "P7067",
		label: "Album of the Year album ID",
		example: [
			53020187,
			63567532,
			21450442,
			199585,
			6841303
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on the Album of the Year (AOTY) website",
		datatype: "external-id",
		id: "P7050",
		label: "Album of the Year artist ID",
		example: [
			11647,
			167635,
			5383,
			1299,
			426068
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "the website's Alexa ranking with P585 as a qualifier for each value; the current value should be marked 'preferred'",
		datatype: "quantity",
		id: "P1661",
		label: "Alexa rank",
		example: [
			373,
			2013
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for names in the Alexander Turnbull Library thesaurus module for unpublished collections",
		datatype: "external-id",
		id: "P6683",
		label: "Alexander Turnbull Library ID",
		example: [
			5145349,
			15968030,
			7732649
		],
		types: [
		],
		aliases: [
			"Turnbull name",
			"Tiaki ID"
		]
	},
	{
		description: "invariant of a knot or link. Use 't' as variable and list monomials in decreasing order.",
		datatype: "math",
		id: "P5350",
		label: "Alexander polynomial",
		example: [
			1188344,
			168620,
			7797291
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "common notation of abstract knots and links",
		datatype: "math",
		id: "P6432",
		label: "Alexander–Briggs notation",
		example: [
			1188344,
			168620,
			7797291,
			2588098
		],
		types: [
		],
		aliases: [
			"Alexander-Briggs notation",
			"knot notation",
			"link notation"
		]
	},
	{
		description: "identifiers of grants in the database of the Sloan Foundation",
		datatype: "external-id",
		label: "Alfred P. Sloan Foundation grant ID",
		id: "P7513",
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "URL for a taxon in AlgaeBase.org",
		datatype: "url",
		id: "P1348",
		label: "AlgaeBase URL",
		example: [
			3010566,
			180597,
			12231410
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a musician or musical group at All About Jazz website",
		datatype: "external-id",
		id: "P5121",
		label: "All About Jazz musician ID",
		example: [
			93341,
			1381646
		],
		types: [
		],
		aliases: [
			"Allaboutjazz musician ID",
			"Allaboutjazz artist ID"
		]
	},
	{
		description: "identifier for a men's rugby union player on the New Zealand Rugby Union website",
		datatype: "external-id",
		id: "P3645",
		label: "All Blacks player ID",
		example: [
			3541024,
			363717
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete on the All-Athletics.com website",
		datatype: "external-id",
		id: "P3765",
		label: "All-Athletics.com ID",
		example: [
			16169531,
			11478528
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a mathematician in the All-Russian Mathematical Portal",
		datatype: "external-id",
		id: "P4252",
		label: "All-Russian Mathematical Portal ID",
		example: [
			157642,
			42295678
		],
		types: [
		],
		aliases: [
			"mathnet.ru ID"
		]
	},
	{
		description: "identifier for a film on the website AllMovie",
		datatype: "external-id",
		id: "P1562",
		label: "AllMovie movie ID",
		example: [
			1026756,
			578061
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the AllMovie film database",
		datatype: "external-id",
		id: "P2019",
		label: "AllMovie person ID",
		example: [
			4616
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an album in AllMusic database",
		datatype: "external-id",
		id: "P1729",
		label: "AllMusic album ID",
		example: [
			18762354,
			44320
		],
		types: [
		],
		aliases: [
			"AllMusic release group ID",
			"AllMusic master ID",
			"album ID (AllMusic)",
			"single ID (AllMusic)",
			"EP ID (AllMusic)",
			"release group ID (AllMusic)",
			"master ID (AllMusic)"
		]
	},
	{
		description: "identifier for an artist or musical group in the AllMusic database",
		datatype: "external-id",
		id: "P1728",
		label: "AllMusic artist ID",
		example: [
			42455,
			42455,
			383541,
			15920
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a composition in AllMusic",
		datatype: "external-id",
		id: "P1994",
		label: "AllMusic composition ID",
		example: [
			207990
		],
		types: [
		],
		aliases: [
			"AllMusic work ID",
			"composition ID (AllMusic)",
			"work ID (AllMusic)"
		]
	},
	{
		description: "identifier for a recording of a performance in AllMusic",
		datatype: "external-id",
		id: "P6306",
		label: "AllMusic performance ID",
		example: [
			56085662
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"performance ID (AllMusic)"
		]
	},
	{
		description: "identifier for a release (an edition of an album) in the AllMusic database",
		datatype: "external-id",
		id: "P6110",
		label: "AllMusic release ID",
		example: [
			57781669,
			57781332
		],
		types: [
		],
		aliases: [
			"release ID (AllMusic)"
		]
	},
	{
		description: "identifier for a song in AllMusic database",
		datatype: "external-id",
		id: "P1730",
		label: "AllMusic song ID",
		example: [
			2470812,
			3632427
		],
		types: [
		],
		aliases: [
			"AllMusic track ID",
			"AllMusic recording ID",
			"track ID (AllMusic)",
			"recording ID (AllMusic)"
		]
	},
	{
		description: "identifier for a powerlifter at the AllPowerlifting.com",
		datatype: "external-id",
		id: "P6097",
		label: "AllPowerlifting.com person ID",
		example: [
			334737,
			18324594,
			3354768
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a trail on the AllTrails website",
		datatype: "external-id",
		id: "P7127",
		label: "AllTrails trail ID",
		example: [
			65935819,
			550389,
			478302
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a horse on Allbreedpedigree database",
		datatype: "external-id",
		id: "P3167",
		label: "Allbreedpedigree ID",
		example: [
			22318003
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "film IDs on Allcinema Movie Database",
		datatype: "external-id",
		id: "P2465",
		label: "Allcinema film ID",
		example: [
			189540,
			860461,
			155653
		],
		types: [
		],
		aliases: [
			"Allcinema film identifier"
		]
	},
	{
		description: "identifier of person on Allcinema database",
		datatype: "external-id",
		id: "P7214",
		label: "Allcinema person ID",
		example: [
			189400,
			55400,
			347412,
			24312969
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a judoka on the Alljudo.net website",
		datatype: "external-id",
		id: "P4191",
		label: "Alljudo judoka ID",
		example: [
			14775089,
			2155016
		],
		types: [
		],
		aliases: [
			"Alljudo.net judoka ID"
		]
	},
	{
		description: "identifier for a company on the AlloCiné film database",
		datatype: "external-id",
		id: "P4910",
		label: "AlloCiné company ID",
		example: [
			50128931,
			913462
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film in the French AlloCiné database",
		datatype: "external-id",
		id: "P1265",
		label: "AlloCiné film ID",
		example: [
			150804,
			17738
		],
		types: [
		],
		aliases: [
			"AlloCine movie ID",
			"AlloCine film ID",
			"AlloCiné movie ID"
		]
	},
	{
		description: "identifier for a person on the AlloCiné film database",
		datatype: "external-id",
		id: "P1266",
		label: "AlloCiné person ID",
		example: [
			106275,
			106482
		],
		types: [
		],
		aliases: [
			"AlloCine person ID"
		]
	},
	{
		description: "identifier for a serie in the AlloCiné film database",
		datatype: "external-id",
		id: "P1267",
		label: "AlloCiné series ID",
		example: [
			131758
		],
		types: [
		],
		aliases: [
			"AlloCine series ID",
			"AlloCine serie ID",
			"AlloCiné serie ID"
		]
	},
	{
		description: "identifier for a movie theater in the AlloCiné database",
		datatype: "external-id",
		id: "P8414",
		label: "AlloCiné theater ID",
		example: [
			21099761,
			3265122,
			3302209
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P5807",
		label: "Alternativa Teatral person ID",
		example: [
			4355418,
			20749445,
			11169904
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P5809",
		label: "Alternativa Teatral place ID",
		example: [
			7691915
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P5808",
		label: "Alternativa Teatral work ID",
		example: [
			2517513
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier assigned to a scientific or academic article by altmetrics.com, to track the citation metrics",
		datatype: "external-id",
		id: "P5530",
		label: "Altmetric ID",
		example: [
			44275619,
			28764908,
			33773228
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "artist identifier at Amazon Music",
		datatype: "external-id",
		id: "P6276",
		label: "Amazon Music artist ID",
		example: [
			15862,
			40912,
			56515116,
			57822988,
			383541
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a video in Amazon Prime Video (US)",
		datatype: "external-id",
		id: "P8055",
		label: "Amazon Prime Video ID",
		example: [
			55635302,
			48758,
			189068
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a product on Amazon.com websites",
		datatype: "external-id",
		id: "P5749",
		label: "Amazon Standard Identification Number",
		example: [
			14942394,
			661017,
			201687
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ASIN",
			"Amazon Music release ID",
			"Amazon.com ID",
			"Amazon Music album ID"
		]
	},
	{
		description: "author identifier on Amazon.com",
		datatype: "external-id",
		id: "P4862",
		label: "Amazon author ID",
		example: [
			318506,
			60137,
			383541
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for the Erik Amburger database of foreigners in pre-revolutionary Russia",
		datatype: "external-id",
		id: "P6878",
		label: "Amburger database ID",
		example: [
			2661624,
			64522945,
			29352183
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "this item's username on Ameblo",
		datatype: "external-id",
		id: "P3502",
		label: "Ameblo username",
		example: [
			50025
		],
		types: [
		],
		aliases: [
			"Ameba ID",
			"Ameba Blog ID",
			"Ameba Blog username",
			"Ameblo ID"
		]
	},
	{
		description: "identifier for a French medical facility on the Ameli website",
		datatype: "external-id",
		id: "P8062",
		label: "Ameli ID",
		example: [
			87615579,
			30269610,
			2979283
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a United States road on the America's Byways website",
		datatype: "external-id",
		id: "P4172",
		label: "America's Byways road ID",
		example: [
			2962760,
			805861
		],
		types: [
		],
		aliases: [
			"Byways road ID",
			"National Scenic Byway road ID"
		]
	},
	{
		description: "identifier for a United States National Park System unit on eParks.com",
		datatype: "external-id",
		id: "P4170",
		label: "America's National Parks ID",
		example: [
			1034449,
			242681,
			7898602
		],
		types: [
		],
		aliases: [
			"eParks.com ID",
			"Eastern National ID",
			"eParks ID"
		]
	},
	{
		description: "identifier for an artwork or any relevant object on the American Art Collaborative website",
		datatype: "external-id",
		id: "P4692",
		label: "American Art Collaborative object ID",
		example: [
			46093362,
			6201702,
			20441598,
			18748440,
			23699751
		],
		types: [
		],
		aliases: [
			"AAC ID",
			"American Art Collaborative ID"
		]
	},
	{
		description: "identifier for a person on the American Battlefield Trust website",
		datatype: "external-id",
		id: "P8624",
		label: "American Battlefield Trust ID (person)",
		example: [
			4668787,
			7422290,
			454672
		],
		types: [
		],
		aliases: [
			"American Battlefield Trust person ID"
		]
	},
	{
		description: "identifier for a battlefield on the American Battlefield Trust website",
		datatype: "external-id",
		id: "P8623",
		label: "American Battlefield Trust battlefield ID",
		example: [
			5179798,
			5554755,
			7619315
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person at American Film Institute",
		datatype: "external-id",
		id: "P5340",
		label: "American Film Institute person ID",
		example: [
			56016,
			51559
		],
		types: [
		],
		aliases: [
			"American Film Institute person identifier",
			"AFI person ID"
		]
	},
	{
		description: "controlled vocabulary of terms about folklore, ethnomusicology, ethnology, and related fields",
		datatype: "external-id",
		id: "P8540",
		label: "American Folklore Society Ethnographic Thesaurus ID",
		example: [
			44342,
			42401304
		],
		types: [
		],
		aliases: [
			"AFS Ethnographic Thesaurus ID",
			"AFSET ID"
		]
	},
	{
		description: "ID of a player at TheAHL.com",
		datatype: "external-id",
		id: "P3651",
		label: "American Hockey League player ID",
		example: [
			2964660,
			1703621
		],
		types: [
		],
		aliases: [
			"AHL player ID",
			"AHL ID"
		]
	},
	{
		description: "identifier of a person in the scholarly biographical encyclopedia",
		datatype: "external-id",
		id: "P4823",
		label: "American National Biography ID",
		example: [
			81438
		],
		types: [
		],
		aliases: [
			"ANB ID"
		]
	},
	{
		description: "identifier for an amphitheatre on the amphi-theatrum.de website",
		datatype: "external-id",
		id: "P5633",
		label: "Amphi-Theatrum ID",
		example: [
			276063,
			2844395,
			10285
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a species, in the AmphibiaWeb database",
		datatype: "external-id",
		id: "P5036",
		label: "AmphibiaWeb Species ID",
		example: [
			37785702
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon in the Amphibian Species of the World database",
		datatype: "external-id",
		id: "P5354",
		label: "Amphibian Species of the World ID",
		example: [
			54877706,
			2274181
		],
		types: [
		],
		aliases: [
			"ASW"
		]
	},
	{
		description: "identifier for a species of amphibian, in the 'Amphibians of India' database",
		datatype: "external-id",
		id: "P5003",
		label: "Amphibians of India ID",
		example: [
			18638780,
			2707430,
			2713113
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "code for municipalities in the Netherlands",
		datatype: "external-id",
		id: "P6434",
		label: "Amsterdam code",
		example: [
			9920,
			35033530,
			2114866
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Station identifier code for the Amtrak system",
		datatype: "external-id",
		id: "P4803",
		label: "Amtrak station code",
		example: [
			4666875
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a cultural institution in the database Anagrafe Istituti Culturali Ecclesiastici",
		datatype: "external-id",
		id: "P8199",
		label: "Anagrafe Istituti Culturali Ecclesiastici ID",
		example: [
			55859362,
			86538395,
			3639656,
			58700502
		],
		types: [
		],
		aliases: [
			"AICE ID"
		]
	},
	{
		description: "identifier for a scholarly article in the Anais do Museu Paulista",
		datatype: "external-id",
		id: "P8586",
		label: "Anais do Museu Paulista article ID",
		example: [
			92684777,
			92684615,
			92684380
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a node in the Analysis & Policy Observatory database",
		datatype: "external-id",
		id: "P7869",
		label: "Analysis & Policy Observatory node ID",
		example: [
			487556,
			2991162,
			63341967,
			81965283
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a term in the Analysis & Policy Observatory taxonomy",
		datatype: "external-id",
		id: "P7870",
		label: "Analysis & Policy Observatory term ID",
		example: [
			408,
			336,
			63770148,
			125928
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Analysis & Policy Observatory subject ID"
		]
	},
	{
		description: "identifier for ancient and notable trees in the United Kingdom",
		datatype: "external-id",
		id: "P7413",
		label: "Ancient Tree Inventory ID",
		example: [
			388443,
			60752627,
			55605947
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID of someone in AncientFaces",
		datatype: "external-id",
		id: "P7977",
		label: "AncientFaces person ID",
		example: [
			5042241,
			19594811,
			5415374,
			3044
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Ancient Faces person ID"
		]
	},
	{
		description: "profile of a person or organisation on Angel List",
		datatype: "external-id",
		id: "P3276",
		label: "Angel List ID",
		example: [
			4885859
		],
		types: [
		],
		aliases: [
			"AngelList ID"
		]
	},
	{
		description: "identifier for an entity in the online catalogue of the Pontifical University of Saint Thomas Aquinas",
		datatype: "external-id",
		id: "P5731",
		label: "Angelicum ID",
		example: [
			9438,
			229190,
			30053490
		],
		types: [
		],
		aliases: [
			"PUST ID"
		]
	},
	{
		description: "identifier for an anime in AniDB database",
		datatype: "external-id",
		id: "P5646",
		label: "AniDB anime ID",
		example: [
			662,
			27863,
			185143
		],
		types: [
		],
		aliases: [
			"anime AniDB ID"
		]
	},
	{
		description: "identifier for a character in AniDB database, if multiple identifiers are available for one character, use the smallest number one",
		datatype: "external-id",
		id: "P5648",
		label: "AniDB character ID",
		example: [
			45319771,
			15956614,
			728718
		],
		types: [
		],
		aliases: [
			"character AniDB ID"
		]
	},
	{
		description: "identifier for a person in AniDB database (human or organization)",
		datatype: "external-id",
		id: "P5649",
		label: "AniDB person ID",
		example: [
			834328,
			23261,
			49547
		],
		types: [
		],
		aliases: [
			"creator AniDB ID"
		]
	},
	{
		description: "identifier of a taxon in AnimalBase website",
		datatype: "external-id",
		id: "P7905",
		label: "AnimalBase ID",
		example: [
			228283,
			662991,
			285214
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a type of knot, in the Animated Knots website",
		datatype: "external-id",
		id: "P5031",
		label: "Animated Knots ID",
		example: [
			753705,
			2351936
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID of animated film in Animator.ru database",
		datatype: "external-id",
		id: "P1934",
		label: "Animator.ru film ID",
		example: [
			260138
		],
		types: [
		],
		aliases: [
			"Animator.ru work ID"
		]
	},
	{
		description: "ID of person in Animator.ru database",
		datatype: "external-id",
		id: "P5770",
		label: "Animator.ru person ID",
		example: [
			4479138,
			732039,
			4421270,
			15073927
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an anime in the Anime Characters Database",
		datatype: "external-id",
		id: "P7017",
		label: "Anime Characters Database anime ID",
		example: [
			232246,
			29972136,
			718624,
			56605036
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a character in the Anime Characters Database",
		datatype: "external-id",
		id: "P7013",
		label: "Anime Characters Database character ID",
		example: [
			2570349,
			2082802,
			1411547,
			17478799
		],
		types: [
		],
		aliases: [
			"ACDB ID"
		]
	},
	{
		description: "identifier of an anime in Anime News Network",
		datatype: "external-id",
		id: "P1985",
		label: "Anime News Network anime ID",
		example: [
			39571,
			662
		],
		types: [
		],
		aliases: [
			"ANN anime ID"
		]
	},
	{
		description: "identifier of a company on Anime News Network",
		datatype: "external-id",
		id: "P1983",
		label: "Anime News Network company ID",
		example: [
			4043396
		],
		types: [
		],
		aliases: [
			"ANN company ID"
		]
	},
	{
		description: "identifier of a manga (or a light novel) in Anime News Network",
		datatype: "external-id",
		id: "P1984",
		label: "Anime News Network manga ID",
		example: [
			1977621
		],
		types: [
		],
		aliases: [
			"ANN manga ID"
		]
	},
	{
		description: "identifier for a person or group of people on animenewsnetwork.com",
		datatype: "external-id",
		id: "P1982",
		label: "Anime News Network person ID",
		example: [
			23261
		],
		types: [
		],
		aliases: [
			"ANN person ID"
		]
	},
	{
		description: "identifier of anime from AnimeClick database",
		datatype: "external-id",
		id: "P5845",
		label: "AnimeClick anime ID",
		example: [
			7606919,
			22101190,
			18125913,
			431930,
			632670
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of character from AnimeClick database",
		datatype: "external-id",
		id: "P5847",
		label: "AnimeClick character ID",
		example: [
			2142,
			699792,
			2859491,
			3936121
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of drama from AnimeClick database",
		datatype: "external-id",
		id: "P5860",
		label: "AnimeClick drama ID",
		example: [
			45751074,
			4391062,
			29578361,
			11649905
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of manga from AnimeClick database",
		datatype: "external-id",
		id: "P5849",
		label: "AnimeClick manga ID",
		example: [
			586025,
			673,
			92512,
			2478890
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of novel from AnimeClick database",
		datatype: "external-id",
		id: "P5846",
		label: "AnimeClick novel ID",
		example: [
			27863,
			482535,
			498992,
			11293422
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of person from AnimeClick database",
		datatype: "external-id",
		id: "P5848",
		label: "AnimeClick person ID",
		example: [
			1042804,
			193300,
			17226139,
			21418862
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person or group at AnimeCons.com",
		datatype: "external-id",
		id: "P3790",
		label: "AnimeCons.com guest ID",
		example: [
			615120,
			707507
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a French magistrature on the 'Annuaire rétrospectif de la magistrature'",
		datatype: "external-id",
		id: "P5952",
		label: "Annuaire de la magistrature ID",
		example: [
			56701960,
			3289594,
			13406593
		],
		types: [
		],
		aliases: [
			"Annuaire rétrospectif de la magistrature ID"
		]
	},
	{
		description: "ID of a foundation on the directory of foundations of the French Foundation Centre",
		datatype: "external-id",
		id: "P4911",
		label: "Annuaire des fondations ID",
		example: [
			50127628,
			50121084,
			2355325,
			3075369,
			3075406
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon in the AntWeb database",
		datatype: "external-id",
		id: "P5299",
		label: "AntWeb ID",
		example: [
			16753240,
			20720629
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an article in AntWiki: a wiki about ants taxa; ant systematists, myrmecologists, and ant collectors; publications, and more",
		datatype: "external-id",
		id: "P6812",
		label: "AntWiki article ID",
		example: [
			1957629,
			1141346,
			3647208,
			6056754,
			1376113,
			7386
		],
		types: [
			"multi-source external identifier"
		],
		aliases: [
			"AW"
		]
	},
	{
		description: "identifier in the composite gazetteer for Antarctica run New Zealand",
		datatype: "external-id",
		id: "P6484",
		label: "Antarctica NZ Digital Asset Manager",
		example: [
			5443302,
			6919867,
			6920486,
			6880022
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier provided by Anvisa, a regulatory body of the Brazilian government responsible for the regulation and approval of pharmaceutical drugs, sanitary standards and regulation of the food industry",
		datatype: "external-id",
		id: "P4393",
		label: "Anvisa drug ID",
		example: [
			191521
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for album reviews at AnyDecentMusic",
		datatype: "external-id",
		id: "P8435",
		label: "AnyDecentMusic album ID",
		example: [
			94585302,
			96054303
		],
		types: [
		],
		aliases: [
			"AnyDecentMusic ID",
			"ADM ID",
			"ADM album ID"
		]
	},
	{
		description: "identifier for a member on the Aosdána website",
		datatype: "external-id",
		id: "P5614",
		label: "Aosdána ID",
		example: [
			4090437,
			55843067,
			5026679
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a list page of works by author on Aozora Bunko",
		datatype: "external-id",
		id: "P7311",
		label: "Aozora Bunko author ID",
		example: [
			81731,
			186326,
			859,
			937
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an introduction page of work on Aozora Bunko",
		datatype: "external-id",
		id: "P7312",
		label: "Aozora Bunko work ID",
		example: [
			8269,
			6630136,
			1076912,
			267634
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of Apache Project",
		datatype: "external-id",
		id: "P8057",
		label: "Apache Project ID",
		example: [
			139941,
			11354,
			29120
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a mobile application in iTunes App Store",
		datatype: "external-id",
		id: "P3861",
		label: "App Store app ID (global)",
		example: [
			1049511,
			27229846
		],
		types: [
			"for software"
		],
		aliases: [
			"iPhone app ID",
			"iOS app ID",
			"iPad app ID",
			"Apple app ID",
			"iTunes package",
			"package, iTunes",
			"iTunes app ID",
			"Apple App Store app ID"
		]
	},
	{
		description: "identifier for an iOS app developer on the Apple App Store",
		datatype: "external-id",
		id: "P5260",
		label: "Apple App Store developer ID",
		example: [
			95
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"iTunes App Store developer ID",
			"App Store developer ID"
		]
	},
	{
		description: "identifier for an e-book in the iTunes Store",
		datatype: "external-id",
		id: "P6395",
		label: "Apple Books book ID",
		example: [
			392147,
			170583,
			308918
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"iTunes book ID",
			"Apple Books ID"
		]
	},
	{
		description: "identifier of a software in the Apple IIGS France database",
		datatype: "external-id",
		id: "P7799",
		label: "Apple IIGS France ID",
		example: [
			60529309,
			3482630,
			7687616,
			6127101,
			17150438
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a musical work in the iTunes website",
		datatype: "external-id",
		id: "P2281",
		label: "Apple Music album ID",
		example: [
			15176954,
			44320
		],
		types: [
		],
		aliases: [
			"iTunes ID",
			"iTunes album ID"
		]
	},
	{
		description: "identifier for a podcast in iTunes",
		datatype: "external-id",
		id: "P5842",
		label: "Apple Podcasts podcast ID",
		example: [
			56542667
		],
		types: [
		],
		aliases: [
			"iTunes podcast ID",
			"Apple Podcasts ID"
		]
	},
	{
		description: "identifier for external link ontology.birzeit.edu, item equivalent on Q63107058 in English and/or Arabic",
		datatype: "external-id",
		id: "P6771",
		label: "Arabic Ontology ID",
		example: [
			79,
			4146861,
			4867740
		],
		types: [
			"for items about languages",
			"multi-source external identifier",
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a building in the Arachne database",
		datatype: "external-id",
		id: "P6787",
		label: "Arachne building ID",
		example: [
			633572,
			10288,
			502098,
			3983244,
			24941924
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Arachne ID building"
		]
	},
	{
		description: "identifier for a collection in the Arachne database",
		datatype: "external-id",
		id: "P7020",
		label: "Arachne collection ID",
		example: [
			2658285,
			19675,
			834183
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Arachne ID collection"
		]
	},
	{
		description: "identifier for an object in the Arachne database",
		datatype: "external-id",
		id: "P7021",
		label: "Arachne object ID",
		example: [
			151952,
			619135,
			24580187
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Arachne ID object"
		]
	},
	{
		description: "identifier for a taxon in araneae.nmbe.ch",
		datatype: "external-id",
		id: "P3594",
		label: "Araneae Spider ID",
		example: [
			27505821
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in Working Life Museums Co-operation Council's and the Museum of Work's database of working-life museums in Sweden (Arbetslivsmuseer)",
		datatype: "external-id",
		id: "P3426",
		label: "ArbetSam ID",
		example: [
			1252023
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "name of the official Arch Linux package",
		datatype: "external-id",
		id: "P3454",
		label: "Arch Linux package",
		example: [
			8038,
			698,
			971909
		],
		types: [
			"representing a unique identifier",
			"for software"
		],
		aliases: [
			"archlinux package",
			"Arch package",
			"package, Arch Linux"
		]
	},
	{
		description: "identifier for a person in the Archaeology Data Service library of bibliographic data",
		datatype: "external-id",
		id: "P6734",
		label: "Archaeology Data Service person ID",
		example: [
			7286871,
			275622,
			56492371
		],
		types: [
		],
		aliases: [
			"ADS person ID"
		]
	},
	{
		description: "identifier for a place in the database Archaeology in Greece Online compiled by the École française d'Athènes and the British School at Athens",
		datatype: "external-id",
		id: "P8218",
		label: "Archaeology in Greece Online place ID",
		example: [
			130321,
			36024972,
			1363688,
			395367
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an architect on the ArchiWebture website",
		datatype: "external-id",
		id: "P7945",
		label: "ArchiWebture ID",
		example: [
			245504,
			542879,
			3427144
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an architect in the Dutch architectuurgids.nl database",
		datatype: "external-id",
		id: "P3058",
		label: "Architectuurgids architect ID",
		example: [
			154083
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique identifier for a building in the Dutch architectuurgids.nl database",
		datatype: "external-id",
		id: "P3059",
		label: "Architectuurgids building ID",
		example: [
			801388
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Archival Resource Key for item or image",
		datatype: "external-id",
		id: "P8091",
		label: "Archival Resource Key",
		example: [
			7365656,
			90480793
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ARK"
		]
	},
	{
		description: "tag for this item on \"Archive of Our Own\"",
		datatype: "external-id",
		id: "P8419",
		label: "Archive Of Our Own tag",
		example: [
			3244512,
			146027,
			518169
		],
		types: [
		],
		aliases: [
			"AO3 tag"
		]
	},
	{
		description: "identifier for an entity (person, organization, family) in the website of the Archive of Trinity College, Cambridge",
		datatype: "external-id",
		id: "P8496",
		label: "Archive Site Trinity College Cambridge ID",
		example: [
			1743249,
			6766284,
			85766941,
			36188
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier from the Archives Directory for the History of Collecting in America",
		datatype: "external-id",
		id: "P7128",
		label: "Archives Directory for the History of Collecting in America ID",
		example: [
			93709,
			65937145,
			233806,
			16851533
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "Identifier for an archival institution in the directory of Archives Portal Europe",
		datatype: "external-id",
		id: "P7764",
		label: "Archives Portal Europe ID",
		example: [
			7308998,
			1802097,
			11686654
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"APE ID"
		]
	},
	{
		description: "identifier for the Archives of Maryland Biographical Series",
		datatype: "external-id",
		id: "P6371",
		label: "Archives of Maryland Biographical Series ID",
		example: [
			5889298,
			6759206,
			454945
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person in the Archivio Storico Ricordi digital collection",
		datatype: "external-id",
		id: "P8290",
		label: "Archivio Storico Ricordi person ID",
		example: [
			7317,
			64876003
		],
		types: [
		],
		aliases: [
			"Archivio Ricordi ID"
		]
	},
	{
		description: "site ID of archnet.org related to architecture, urban issues, landscape design, visual culture and conservation issues",
		datatype: "external-id",
		id: "P7323",
		label: "Archnet site ID",
		example: [
			16251479,
			19882185,
			19891668
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a member of the Chamber of Deputies of Argentina (only incumbent)",
		datatype: "external-id",
		label: "Argentine Chamber of Deputies ID",
		id: "P4454",
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an Argentine athlete on the website of the Argentine Olympic Committee (Comité Olímpico Argentino)",
		datatype: "external-id",
		id: "P4065",
		label: "Argentine Olympic Committee athlete ID",
		example: [
			6163707,
			15715848
		],
		types: [
		],
		aliases: [
			"COA athlete ID"
		]
	},
	{
		description: "identifier for a member of the Senate of Argentina (incumbent)",
		datatype: "external-id",
		id: "P4453",
		label: "Argentine Senate member ID",
		example: [
			4678262
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "biography of an Argentine deputy from the Chamber of Deputies' website",
		datatype: "external-id",
		id: "P5225",
		label: "Argentine biography deputy ID",
		example: [
			15192668
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for votations and absentism statistics of a member of the Argentine Chamber of Deputies",
		datatype: "external-id",
		id: "P4693",
		label: "Argentine deputy votations ID",
		example: [
			7071481
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "airport code issued by the Argentinean National Civil Aviation Administration. Not to be confused with FAA (USA) code",
		datatype: "external-id",
		id: "P6120",
		label: "Argentinean NCAA Airport code",
		example: [
			3275909,
			1655986,
			2160738
		],
		types: [
		],
		aliases: [
			"ANAC"
		]
	},
	{
		description: "identifier for historic heritage object included in the national index of Argentina",
		datatype: "external-id",
		id: "P4587",
		label: "Argentinian Historic Heritage ID",
		example: [
			827401
		],
		types: [
		],
		aliases: [
			"Comisión Nacional de Monumentos, de Lugares y de Bienes Históricos ID"
		]
	},
	{
		description: "Croatian art/theater linked open data",
		datatype: "external-id",
		id: "P5821",
		label: "ArhivX LOD",
		example: [
			566790,
			7243
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "alphabetical identifier for a structure or a building in the Arkansas Register of Historic Places database",
		datatype: "external-id",
		id: "P8232",
		label: "Arkansas Register of Historic Places ID",
		example: [
			94166570,
			94166637,
			94166632
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an actor (person or institution) in Arkivportalen, a website for Norwegian archives",
		datatype: "external-id",
		id: "P5887",
		label: "Arkivportalen agent ID",
		example: [
			11980720,
			2367019,
			4801450
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an archive in Arkivportalen, a website for Norwegian archives",
		datatype: "external-id",
		id: "P5888",
		label: "Arkivportalen archive ID",
		example: [
			11990502,
			11971894
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "unofficial identifier for a person buried in Arlington Cemetery (the entry contains biographies and photographs)",
		datatype: "external-id",
		id: "P8213",
		label: "Arlington Cemetery person ID",
		example: [
			1607332,
			272383,
			139612,
			210268,
			202365,
			205282,
			165421,
			1700690,
			1648740,
			684140
		],
		types: [
			"for items about people"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a work or person, in the Armenian Cinema database of the Armenian Association of Film Critics and Cinema Journalists",
		datatype: "external-id",
		id: "P5218",
		label: "Armenian Cinema ID",
		example: [
			4305922,
			1971498
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a member of the Armenian National Academy of Sciences",
		datatype: "external-id",
		id: "P5212",
		label: "Armenian National Academy of Sciences ID",
		example: [
			2471305
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a Member of the National Assembly of the Republic of Armenia, in its official website",
		datatype: "external-id",
		id: "P5213",
		label: "Armenian Parliamentary ID",
		example: [
			4074471
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "name of the article in Armenian Vikidia",
		datatype: "external-id",
		id: "P7841",
		label: "Armenian Vikidia ID",
		example: [
			1785,
			142,
			46
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Vikidia article in Armenian",
			"article in Armenian Vikidia"
		]
	},
	{
		description: "author identifier from the Arnet Miner research database",
		datatype: "external-id",
		id: "P5776",
		label: "Arnet Miner author ID",
		example: [
			937,
			41688,
			48975668
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of a publication in Arnet Miner",
		datatype: "external-id",
		id: "P7292",
		label: "Arnet Miner publication ID",
		example: [
			66666226,
			66666956,
			66666960
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an Holocaust victim on the Arolsen Archives' website",
		datatype: "external-id",
		id: "P7656",
		label: "Arolsen ID",
		example: [
			817484,
			61294196,
			28143980
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an architect or building, in the Arquivo Arq database",
		datatype: "external-id",
		id: "P4694",
		label: "Arquivo Arq ID",
		example: [
			6777115,
			10311092
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Art & Architecture Thesaurus by the Getty Research Institute",
		datatype: "external-id",
		id: "P1014",
		label: "Art & Architecture Thesaurus ID",
		example: [
			179700,
			23498,
			68
		],
		types: [
		],
		aliases: [
			"Art & Architecture Thesaurus ID",
			"AAT identifier",
			"Getty Art & Architecture Thesaurus ID",
			"AAT ID",
			"Getty AAT ID"
		]
	},
	{
		description: "identifier for Italian national heritage which experienced interventions registered in the website Art Bonus",
		datatype: "external-id",
		id: "P8564",
		label: "Art Bonus ID",
		example: [
			183202,
			641556,
			3078505,
			3670156
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork on the website of the Art Fund",
		datatype: "external-id",
		id: "P6576",
		label: "Art Fund artwork ID",
		example: [
			61927427,
			12738203,
			47543465
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for artists in the Art Gallery of South Australia",
		datatype: "external-id",
		id: "P6804",
		label: "Art Gallery of South Australia creator ID",
		example: [
			19666553,
			1133464,
			1273998
		],
		types: [
		],
		aliases: [
			"AGSA creator ID"
		]
	},
	{
		description: "identifier of a work in the collection of the Art Gallery of South Australia",
		datatype: "external-id",
		id: "P6805",
		label: "Art Gallery of South Australia work ID",
		example: [
			28808976,
			28805969,
			28794199
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "artist identifier for the Art Museum of Estonia",
		datatype: "external-id",
		id: "P4563",
		label: "Art Museum of Estonia artist ID",
		example: [
			4794937
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Artwork identifier for the Art Museum of Estonia",
		datatype: "external-id",
		id: "P4564",
		label: "Art Museum of Estonia artwork ID",
		example: [
			16413370
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an artist at the Art Renewal Center's ARC Museum website",
		datatype: "external-id",
		id: "P3791",
		label: "Art Renewal Center artist ID",
		example: [
			146691,
			270629
		],
		types: [
		],
		aliases: [
			"ARC artist ID"
		]
	},
	{
		description: "authority control identifier for artists (creators of publicly owned oil paintings in the UK)",
		datatype: "external-id",
		id: "P1367",
		label: "Art UK artist ID",
		example: [
			2898912,
			20640622
		],
		types: [
		],
		aliases: [
			"BBC Your Paintings artist identifier",
			"PCF ID",
			"Public Catalogue Foundation ID",
			"Your Paintings ID",
			"Art UK ID",
			"Art UK artist identifier"
		]
	},
	{
		description: "identifier for artworks (publicly owned oil paintings in the UK)",
		datatype: "external-id",
		id: "P1679",
		label: "Art UK artwork ID",
		example: [
			1206860,
			7232270
		],
		types: [
		],
		aliases: [
			"Art UK artwork identifier"
		]
	},
	{
		description: "identifier for art collections, in the UK",
		datatype: "external-id",
		id: "P1751",
		label: "Art UK collection ID",
		example: [
			5738000
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Your Paintings collection identifier",
			"BBC Your Paintings collection identifier",
			"Art UK collection identifier"
		]
	},
	{
		description: "authority control identifier for venues housing art, in the UK",
		datatype: "external-id",
		id: "P1602",
		label: "Art UK venue ID",
		example: [
			12403
		],
		types: [
		],
		aliases: [
			"Your Paintings venue identifier",
			"BBC Your Paintings gallery identifier",
			"BBC Your Paintings museum identifier",
			"BBC Your Paintings venue identifier",
			"Art UK venue identifier"
		]
	},
	{
		description: "identifier for an artist, on the ArtBrokerage website",
		datatype: "external-id",
		id: "P6903",
		label: "ArtBrokerage artist ID",
		example: [
			93284,
			152384,
			62775285
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a lot on the website of Artcurial, a French auction house",
		datatype: "external-id",
		id: "P6629",
		label: "Artcurial lot ID",
		example: [
			62035843,
			62035898,
			50825472
		],
		types: [
		],
		aliases: [
			"Artcurial ID"
		]
	},
	{
		description: "identifier for an artist on the Artcyclopedia website",
		datatype: "external-id",
		id: "P5597",
		label: "Artcyclopedia artist ID",
		example: [
			118810,
			152384,
			703660
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "authority control maintained by National Gallery of Canada Library listing biographical data for artists who were born in Canada or worked in Canada",
		datatype: "external-id",
		id: "P5239",
		label: "Artists in Canada record number",
		example: [
			5101556,
			289624
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an artist in the Artnet database of auction results",
		datatype: "external-id",
		id: "P3782",
		label: "Artnet artist ID",
		example: [
			18559719,
			1605934,
			213163
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an artist in Artprice",
		datatype: "external-id",
		id: "P8434",
		label: "Artprice artist ID",
		example: [
			1241051,
			88119550
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier for resources in the Artsdata.ca Knowledge Graph",
		datatype: "external-id",
		id: "P7627",
		label: "Artsdata.ca ID",
		example: [
			76179596,
			1928100,
			2945952
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier at the Artsy website",
		datatype: "external-id",
		id: "P2042",
		label: "Artsy artist ID",
		example: [
			5582,
			3288419
		],
		types: [
		],
		aliases: [
			"Artsy artist identifier",
			"Artsy id"
		]
	},
	{
		description: "generalization of artwork type, technique, material, genre, movement, etc. from artsy.net",
		datatype: "string",
		id: "P2411",
		label: "Artsy gene",
		example: [
			42934,
			18761202,
			50030
		],
		types: [
		],
		aliases: [
			"artsy.net gene"
		]
	},
	{
		description: "number of the object on online  collections",
		datatype: "external-id",
		id: "P6610",
		label: "Ashmolean museum ID",
		example: [
			12104119,
			50819992,
			61280151
		],
		types: [
		],
		aliases: [
			"Ashmolean ID"
		]
	},
	{
		description: "identifier in a Swiss database of modern writers",
		datatype: "external-id",
		id: "P1291",
		label: "Association Authors of Switzerland ID",
		example: [
			124156,
			49601
		],
		types: [
		],
		aliases: [
			"ADS ID"
		]
	},
	{
		description: "identifier in the At the Circulating Library Victorian literature database",
		datatype: "external-id",
		id: "P1564",
		label: "At the Circulating Library ID",
		example: [
			18190913
		],
		types: [
		],
		aliases: [
			"AtCL Author"
		]
	},
	{
		description: "identifier in the Atari Legend database of Atari videogames",
		datatype: "external-id",
		id: "P4858",
		label: "Atari Legend identifier",
		example: [
			90999,
			2121419
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the AtariAge database of Atari videogames",
		datatype: "external-id",
		id: "P4857",
		label: "AtariAge ID",
		example: [
			1192794,
			379915
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"AtariAge identifier"
		]
	},
	{
		description: "identifier in the Atarimania database of Atari videogames",
		datatype: "external-id",
		id: "P4859",
		label: "Atarimania identifier",
		example: [
			90999,
			2121419
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "artwork id in the Athenaeum artworks website",
		datatype: "external-id",
		id: "P4144",
		label: "Athenaeum artwork ID",
		example: [
			28028829,
			60423339
		],
		types: [
		],
		aliases: [
			"The Atheneum artwork ID"
		]
	},
	{
		description: "museum or other repository/source id in the Athenaeum artworks website",
		datatype: "external-id",
		id: "P4146",
		label: "Athenaeum museum ID",
		example: [
			1201549,
			3892314
		],
		types: [
		],
		aliases: [
			"The Athenaeum museum ID"
		]
	},
	{
		description: "artist id in the Athenaeum artworks website",
		datatype: "external-id",
		id: "P4145",
		label: "Athenaeum person ID",
		example: [
			191748,
			161858
		],
		types: [
		],
		aliases: [
			"The Athenaeum person ID"
		]
	},
	{
		description: "identifier for an athlete on the Athletics Canada website",
		datatype: "external-id",
		id: "P5078",
		label: "Athletics Canada ID",
		example: [
			9335955
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Atlas database of the Louvre Museum",
		datatype: "external-id",
		id: "P1212",
		label: "Atlas ID",
		example: [
			15933804
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for places at Atlas Obscura",
		datatype: "external-id",
		id: "P7772",
		label: "Atlas Obscura identifier",
		example: [
			201013,
			180901,
			1090986
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Atlas Obscura ID",
			"atlasobscura.com identifier",
			"atlasobscura.com ID",
			"AO ID"
		]
	},
	{
		description: "identifier for a species on the Atlas of Florida Plants website",
		datatype: "external-id",
		id: "P6159",
		label: "Atlas of Florida Plants ID",
		example: [
			978763,
			58759343,
			15227563
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Atlas of Hillforts database",
		datatype: "external-id",
		id: "P4102",
		label: "Atlas of Hillforts ID",
		example: [
			807881
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon in the Atlas of Living Australia",
		datatype: "external-id",
		id: "P7051",
		label: "Atlas of Living Australia ID",
		example: [
			82544,
			4669532,
			726151,
			319545,
			5306959,
			55766401,
			4890423
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ALA ID",
			"AoLA ID"
		]
	},
	{
		description: "identifier of a location or an architectural structure in the Atlas Landscapefor (Italian database of cultural heritage)",
		datatype: "external-id",
		id: "P7004",
		label: "AtlasFor ID",
		example: [
			19826,
			1061804
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "profile of a person on the website of the Atomic Heritage Foundation",
		datatype: "external-id",
		id: "P4590",
		label: "Atomic Heritage Foundation ID",
		example: [
			132537,
			18631876
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier assigned to an artist by the Auckland Art Gallery in New Zealand",
		datatype: "external-id",
		id: "P3372",
		label: "Auckland Art Gallery artist ID",
		example: [
			1566511
		],
		types: [
		],
		aliases: [
			"AAG artist ID"
		]
	},
	{
		description: "identifier assigned to a person by the Auckland War Memorial Museum, New Zealand",
		datatype: "external-id",
		id: "P7298",
		label: "Auckland Museum ID",
		example: [
			1064767,
			1361590,
			33817
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"AWMM person ID",
			"Auckland Museum person ID",
			"Auckland War Memorial Museum person ID"
		]
	},
	{
		description: "identifier for an Assumptionist on the website of the order",
		datatype: "external-id",
		id: "P8233",
		label: "Augustins de l'Assomption ID",
		example: [
			93742916,
			18539390
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an organisation at AusStage",
		datatype: "external-id",
		id: "P8291",
		label: "AusStage organization ID",
		example: [
			4823575,
			4681716
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person at AusStage",
		datatype: "external-id",
		id: "P8292",
		label: "AusStage person ID",
		example: [
			712848,
			7353572
		],
		types: [
		],
		aliases: [
			"AusStage contributor ID"
		]
	},
	{
		description: "identifier for a venue at AusStage",
		datatype: "external-id",
		id: "P8293",
		label: "AusStage venue ID",
		example: [
			254650,
			12122406
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a work at AusStage",
		datatype: "external-id",
		id: "P8294",
		label: "AusStage work ID",
		example: [
			237572,
			1654459
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Australasian Legal Information Institute (AustLII) online database",
		datatype: "external-id",
		id: "P5799",
		label: "AustLII ID",
		example: [
			7999803,
			7444638,
			6739544,
			6015024
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier at AustLit",
		datatype: "external-id",
		id: "P8295",
		label: "AustLit ID",
		example: [
			21536436,
			3025604,
			160082
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a pollen or spore in the Australasian Pollen and Spore Atlas, managed by the Australian National University",
		datatype: "external-id",
		id: "P2809",
		label: "Australasian Pollen and Spore Atlas Code",
		example: [
			1021949,
			2824384,
			147991
		],
		types: [
		],
		aliases: [
			"APSA Code"
		]
	},
	{
		description: "identifier of a place, in the Australian Antarctic Gazetteer",
		datatype: "external-id",
		id: "P3626",
		label: "Australian Antarctic Gazetteer ID",
		example: [
			5447655
		],
		types: [
		],
		aliases: [
			"AAG ID",
			"AADC Gazetteer ID",
			"Australian Antarctic Data Center"
		]
	},
	{
		description: "identifier for an athlete at the Australian Athletics Historical Results website",
		datatype: "external-id",
		id: "P3915",
		label: "Australian Athletics Historical Results athlete ID",
		example: [
			234762,
			15573
		],
		types: [
		],
		aliases: [
			"Athletics Australia athlete ID"
		]
	},
	{
		description: "identifier for a player on the Australian Baseball League website",
		datatype: "external-id",
		id: "P4476",
		label: "Australian Baseball League player ID",
		example: [
			6880971,
			28748000
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique identifier for a business entity registered in Australia",
		datatype: "external-id",
		id: "P3548",
		label: "Australian Business Number",
		example: [
			908144,
			27229846
		],
		types: [
		],
		aliases: [
			"ABN"
		]
	},
	{
		description: "content rating of an audiovisual work or video game in the Australian Classification system",
		datatype: "wikibase-item",
		id: "P3156",
		label: "Australian Classification",
		example: [
			28234671
		],
		types: [
		],
		aliases: [
			"ACB",
			"ACB rating"
		]
	},
	{
		description: "identifier for a creative work on the Australian Classification Board's official website",
		datatype: "external-id",
		id: "P8326",
		label: "Australian Classification ID",
		example: [
			3182559,
			700905
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ACB ID"
		]
	},
	{
		description: "unique identifier for a company registered in Australia",
		datatype: "external-id",
		id: "P3549",
		label: "Australian Company Number",
		example: [
			908144
		],
		types: [
		],
		aliases: [
			"ACN"
		]
	},
	{
		description: "article about the person in the Australian Dictionary of Biography",
		datatype: "external-id",
		id: "P1907",
		label: "Australian Dictionary of Biography ID",
		example: [
			23342
		],
		types: [
		],
		aliases: [
			"AuDB ID",
			"ADB",
			"Australian Dictionary of Biography identifier"
		]
	},
	{
		description: "ID for curriculum term in one of the controlled vocabularies at Australian education vocabularies",
		datatype: "external-id",
		id: "P7033",
		label: "Australian Educational Vocabulary ID",
		example: [
			16814,
			315,
			153356,
			6630149,
			192833,
			698
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"AEV ID",
			"SCOT ID"
		]
	},
	{
		description: "identifier for a taxon on the Australian Faunal Directory website",
		datatype: "external-id",
		id: "P6039",
		label: "Australian Faunal Directory ID",
		example: [
			262297,
			143569,
			209291
		],
		types: [
		],
		aliases: [
			"AFD ID"
		]
	},
	{
		description: "identifier of a publication in Australian Faunal Directory (Australian Biological Resources Study) of the Australian Government's Department of Environment and Energy",
		datatype: "external-id",
		id: "P6982",
		label: "Australian Faunal Directory publication ID",
		example: [
			21185346,
			56208522,
			56035060
		],
		types: [
			"for a taxon"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a geologic province in the Australian Geological Provinces Database published by Geoscience Australia",
		datatype: "external-id",
		id: "P2742",
		label: "Australian Geological Provinces ID",
		example: [
			451785
		],
		types: [
		],
		aliases: [
			"Australian Geological Provinces Database Identifier",
			"Australian Stratigraphic Units Database Province ID",
			"ASUD Province ID"
		]
	},
	{
		description: "identifier of an Australian government organisation within the now discontinued Australian Government Organisations Register",
		datatype: "external-id",
		id: "P3534",
		label: "Australian Government Organisations Register ID",
		example: [
			1191489
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier \"Place ID\" on the Australian Heritage Database",
		datatype: "external-id",
		id: "P3008",
		label: "Australian Heritage Database Place ID",
		example: [
			45178,
			251999
		],
		types: [
		],
		aliases: [
			"AHD ID",
			"AHDP ID"
		]
	},
	{
		description: "identifier of a name in the Australian Marine Algal Name Index",
		datatype: "external-id",
		id: "P7090",
		label: "Australian Marine Algal Name Index ID",
		example: [
			42173927,
			264543,
			50358974
		],
		types: [
		],
		aliases: [
			"AMANI-ID"
		]
	},
	{
		description: "identifier for an object in the Australian National Maritime Museum collection",
		datatype: "external-id",
		id: "P7768",
		label: "Australian National Maritime Museum object ID",
		example: [
			18146163,
			78727244,
			78728106
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ANMM object ID"
		]
	},
	{
		description: "identifier for a person in the Australian National Maritime Museum collection",
		datatype: "external-id",
		id: "P7769",
		label: "Australian National Maritime Museum person ID",
		example: [
			2991162,
			78730585,
			17350333
		],
		types: [
		],
		aliases: [
			"ANMM person ID"
		]
	},
	{
		description: "identifier for shipwrecks used by the Australian National Shipwreck Database",
		datatype: "external-id",
		id: "P2457",
		label: "Australian National Shipwreck ID",
		example: [
			6664871,
			1501596
		],
		types: [
		],
		aliases: [
			"shipwreck ID number (Australian National Shipwreck Database)",
			"Australian National Shipwreck Database Shipwreck ID number"
		]
	},
	{
		description: "identifier for a sportsperson on the Australian Olympic Committee (AOC) website",
		datatype: "external-id",
		id: "P3682",
		label: "Australian Olympic Committee athlete ID",
		example: [
			4941292,
			352101
		],
		types: [
		],
		aliases: [
			"AOC athlete ID"
		]
	},
	{
		description: "identifier for a poet on the Australian Poetry Library website",
		datatype: "external-id",
		id: "P5465",
		label: "Australian Poetry Library poet ID",
		example: [
			4860006,
			22018757,
			4934617
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a Ramsar wetland listed in the Australian Wetlands Database managed by the Australian Government Department of the Environment",
		datatype: "external-id",
		id: "P2516",
		label: "Australian Ramsar site ID",
		example: [
			5563129
		],
		types: [
		],
		aliases: [
			"Australian Wetlands Database Australian Ramsar site number"
		]
	},
	{
		description: "identifier of a medicine or medical device listed in the Australian Register of Therapeutic Goods",
		datatype: "external-id",
		id: "P3550",
		label: "Australian Register of Therapeutic Goods ID",
		example: [
			132621
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"ARTG ID"
		]
	},
	{
		description: "unique identifier for an organisation body (often a foreign business enterprise) registered in Australia",
		datatype: "external-id",
		id: "P3551",
		label: "Australian Registered Body Number",
		example: [
			11756765
		],
		types: [
		],
		aliases: [
			"ARBN"
		]
	},
	{
		description: "unique identifier for a managed investment scheme registered in Australia",
		datatype: "external-id",
		id: "P3552",
		label: "Australian Registered Scheme Number",
		example: [
			28563500
		],
		types: [
		],
		aliases: [
			"ARSN"
		]
	},
	{
		description: "Identifier of a geographic region defined in the Australian Standard Geographic Classification 2006",
		datatype: "external-id",
		id: "P4094",
		label: "Australian Standard Geographic Classification 2006 ID",
		example: [
			14935456,
			917665,
			36074
		],
		types: [
		],
		aliases: [
			"ASGC2006",
			"ASGS2006"
		]
	},
	{
		description: "identifier of a geographic region defined in the Australian Statistical Geography Standard 2011",
		datatype: "external-id",
		id: "P4014",
		label: "Australian Statistical Geography 2011 ID",
		example: [
			7055322,
			36074,
			606193,
			924832,
			5355687,
			3206850,
			8026964,
			5600710,
			28874029,
			6927218,
			534290,
			5169451,
			5328448,
			233770
		],
		types: [
		],
		aliases: [
			"ASGS2011"
		]
	},
	{
		description: "Identifier of a geographic region defined in the Australian Statistical Geography Standard 2016",
		datatype: "external-id",
		id: "P4093",
		label: "Australian Statistical Geography 2016 ID",
		example: [
			36074,
			24050090
		],
		types: [
		],
		aliases: [
			"ASG2016",
			"ABS2016",
			"ASGS2016",
			"ASGS"
		]
	},
	{
		description: "identifier for a stratigraphic unit listed in the Australian Stratigraphic Units Database",
		datatype: "external-id",
		id: "P2367",
		label: "Australian Stratigraphic Units Database ID",
		example: [
			5526405
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a company in the Australian Suppliers Directory",
		datatype: "external-id",
		id: "P7022",
		label: "Australian Suppliers Directory ID",
		example: [
			14468778,
			1069385,
			14476248,
			781606
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ASD ID",
			"ASDID"
		]
	},
	{
		description: "identifier for a person, event, unit, place, or item in the Australian War Memorial collection",
		datatype: "external-id",
		id: "P6713",
		label: "Australian War Memorial ID",
		example: [
			10325351,
			15914063,
			4639333,
			2104626,
			63185462
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"AWM ID"
		]
	},
	{
		description: "identifier for a taxon, in an Atlas of Living Australia database of weed profiles",
		datatype: "external-id",
		id: "P8469",
		label: "Australian Weed ID",
		example: [
			642344,
			32851115
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a wetland listed in the Australian Wetlands Database Directory of Important Wetlands managed by the Australian Government Department of the Environment",
		datatype: "external-id",
		id: "P2584",
		label: "Australian Wetlands Code",
		example: [
			5563129,
			21882925,
			21954973
		],
		types: [
		],
		aliases: [
			"Australian Wetlands Database",
			"Australian Wetlands Database Directory of Important Wetlands Reference Code",
			"DIWA ID"
		]
	},
	{
		description: "identifier for a person or organisation in the Australian Women's Register",
		datatype: "external-id",
		id: "P4186",
		label: "Australian Women's Register ID",
		example: [
			5271387,
			4664329,
			6796542,
			4768262
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique identifier of a bank branch in Australia",
		datatype: "external-id",
		id: "P6820",
		label: "Australian bank branch ID",
		example: [
			24089732,
			22906565,
			28220164
		],
		types: [
		],
		aliases: [
			"bank state branch",
			"BSB"
		]
	},
	{
		description: "ID for an instance of an Australian honour being awarded to an Australian citizen",
		datatype: "external-id",
		id: "P4766",
		label: "Australian honours ID",
		example: [
			272139
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an Australian rules footballer at the AustralianFootball.com website",
		datatype: "external-id",
		id: "P3546",
		label: "AustralianFootball.com ID",
		example: [
			5026412
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "іdentifier for people in the Austrian Biographical Encylopedia edited by the Austrian Academy of Science",
		datatype: "external-id",
		id: "P6194",
		label: "Austrian Biographical Encylopedia ID",
		example: [
			85002,
			12020888,
			22117362
		],
		types: [
		],
		aliases: [
			"Österreichisches Biographisches Lexikon ID",
			"ÖBL ID",
			"Austrian Biographical Lexicon ID"
		]
	},
	{
		description: "identifier for an individual between 1848 – 1918, in the Austrian Parliament's \"Who's Who\" database",
		datatype: "external-id",
		id: "P7491",
		label: "Austrian Parliament 1848 - 1918 ID",
		example: [
			78531,
			366845,
			11726,
			23656837
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an individual, in the Austrian Parliament's \"Who's Who\" database",
		datatype: "external-id",
		id: "P2280",
		label: "Austrian Parliament ID",
		example: [
			85433,
			1733812
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "This identifier is used for textbooks in Austria that are allowed to be used in public schools.",
		datatype: "external-id",
		id: "P3991",
		label: "Austrian Textbook ID",
		example: [
			29033726
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for municipalities in Austria",
		datatype: "external-id",
		id: "P964",
		label: "Austrian municipality key",
		example: [
			13298,
			1735
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author on the Auteurs en Auvergne-Rhône-Alpes website",
		datatype: "external-id",
		id: "P5538",
		label: "Auteurs en Auvergne-Rhône-Alpes ID",
		example: [
			3332923,
			3167167,
			16539080
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of a researcher in Authenticus website",
		datatype: "external-id",
		id: "P7834",
		label: "Authenticus ID",
		example: [
			57009382,
			58229801,
			57412770,
			57576365,
			53594080,
			79800210
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author on the Authorea writing service",
		datatype: "external-id",
		id: "P5039",
		label: "Authorea author ID",
		example: [
			47475003,
			30078017
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P5517",
		label: "Auvergne-Rhône-Alpes Regional Inventory identifier",
		example: [
			3146186,
			1775054
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of an item in Auñamendi Encyclopaedia",
		datatype: "external-id",
		id: "P3218",
		label: "Auñamendi ID",
		example: [
			8843105,
			8775239,
			11952194,
			12263083
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Aunamendi ID",
			"Auñamendi identifier",
			"Aunamendi identifier"
		]
	},
	{
		description: "identifier for an item in the Aviation Safety Network's database",
		datatype: "external-id",
		id: "P1760",
		label: "Aviation Safety Network Wikibase Occurrence",
		example: [
			19360289
		],
		types: [
		],
		aliases: [
			"ASNWO",
			"ASN Wikibase Occurrence"
		]
	},
	{
		description: "identifier for an accident description per the Aviation Safety Network's database",
		datatype: "external-id",
		id: "P1755",
		label: "Aviation Safety Network accident ID",
		example: [
			18951344
		],
		types: [
		],
		aliases: [
			"ASNADID",
			"ASNID",
			"ASN accident ID",
			"Aviation Safety Network accident description ID",
			"aviation-safety.net ID"
		]
	},
	{
		description: "identifier for a species, subspecies, or genus in Avibase - the world bird database",
		datatype: "external-id",
		id: "P2026",
		label: "Avibase ID",
		example: [
			14683,
			850925,
			10856
		],
		types: [
		],
		aliases: [
			"Birds of the World ID"
		]
	},
	{
		description: "identifier for an artist on Awards & Winners site",
		datatype: "external-id",
		id: "P7184",
		label: "Awards & Winners artist ID",
		example: [
			383541,
			313453,
			164119
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "entry ID in B3Kat, the joint union catalogue of the Bavarian Library Network (Bibliotheksverbund Bayern - BVB) and the Cooperative Library Network Berlin-Brandenburg (KOBV)",
		datatype: "external-id",
		id: "P6123",
		label: "B3Kat dataset ID",
		example: [
			27713917,
			26878940,
			58303373
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "BAG building ID for Dutch buildings (\"panden\")",
		datatype: "external-id",
		id: "P5208",
		label: "BAG building ID",
		example: [
			2247412
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "BAG openbare ruimtecode for Dutch public spaces",
		datatype: "external-id",
		id: "P5207",
		label: "BAG public space ID",
		example: [
			18927441
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "BAG code for Dutch residencies (\"woonplaats\", mostly municipalities)",
		datatype: "external-id",
		id: "P981",
		label: "BAG residence ID",
		example: [
			2331262,
			9920
		],
		types: [
		],
		aliases: [
			"BAG-code for Dutch towns"
		]
	},
	{
		description: "identifier for creative works in the Photo Library database of BALaT (Belgian Art Links & Tools), maintained by KIK-IRPA, Belgium's Royal Institute for Cultural Heritage",
		datatype: "external-id",
		id: "P3293",
		label: "BALaT object ID",
		example: [
			27135996
		],
		types: [
		],
		aliases: [
			"BALaT artwork ID"
		]
	},
	{
		description: "identifier for person or organisation in the People & Institutions database of Belgian Art Links & Tools (BALaT), maintained by KIK-IRPA, Belgium's Royal Institute for Cultural Heritage.",
		datatype: "external-id",
		id: "P1901",
		label: "BALaT person/organisation id",
		example: [
			5599
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the BARTOC Terminology Registry",
		datatype: "external-id",
		id: "P2689",
		label: "BARTOC ID",
		example: [
			48460
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author or subject heading in the Bibliothèque et Archives nationales du Québec (BAnQ)",
		datatype: "external-id",
		id: "P3280",
		label: "BAnQ author ID",
		example: [
			3140237,
			21672723,
			25173,
			1067781
		],
		types: [
		],
		aliases: [
			"B2Q author ID",
			"B2Q subject ID"
		]
	},
	{
		description: "identifier for a work in the collection of Bibliothèque et Archives nationales du Québec",
		datatype: "external-id",
		id: "P1823",
		label: "BAnQ work ID",
		example: [
			19694524
		],
		types: [
		],
		aliases: [
			"B2Q work ID"
		]
	},
	{
		description: "identifier for a single episode/programme in the BBC Genome database of Radio Times programme listings",
		datatype: "external-id",
		id: "P1573",
		label: "BBC Genome ID",
		example: [
			7732049
		],
		types: [
		],
		aliases: [
			"BBC Genome identifier",
			"Radio Times identifier"
		]
	},
	{
		description: "identifer in the BBC News Democracy Live database of British MPs",
		datatype: "external-id",
		id: "P2173",
		label: "BBC News Democracy Live ID",
		example: [
			263802
		],
		types: [
		],
		aliases: [
			"BBC News Democracy Live identifier"
		]
	},
	{
		description: "identifier for a topic, on the BBC News website",
		datatype: "external-id",
		id: "P6200",
		label: "BBC News topic ID",
		example: [
			361,
			7888194,
			264766
		],
		types: [
		],
		aliases: [
			"BBC topic ID"
		]
	},
	{
		description: "identifier in the BBC Things database",
		datatype: "external-id",
		id: "P1617",
		label: "BBC Things ID",
		example: [
			17034697,
			4612,
			43252,
			190086
		],
		types: [
		],
		aliases: [
			"BBC Things identifer"
		]
	},
	{
		description: "identifier for the corresponding item on the BBC website and internal systems",
		datatype: "external-id",
		id: "P827",
		label: "BBC programme ID",
		example: [
			386813,
			254,
			34316
		],
		types: [
		],
		aliases: [
			"pid",
			"BBC pid",
			"PIPs identifier",
			"BBC program identifier",
			"BBC program ID",
			"BBC programme identifier"
		]
	},
	{
		description: "identifier in the archive database of the German \"Research Library for the History of Education\" (personal data of the teachers of Prussia)",
		datatype: "external-id",
		id: "P1650",
		label: "BBF ID",
		example: [
			20742737
		],
		types: [
		],
		aliases: [
			"BBF identifier"
		]
	},
	{
		description: "British media content rating (add BBFC reference with qualifier \"P2676\")",
		datatype: "wikibase-item",
		id: "P2629",
		label: "BBFC rating",
		example: [
			16635326
		],
		types: [
		],
		aliases: [
			"BBFC certificate"
		]
	},
	{
		description: "library and bibliographic classification is the national classification system of Russia, it codifies themes of books published in Russia and some countries of the former USSR",
		datatype: "external-id",
		id: "P8391",
		label: "BBK (library and bibliographic classification)",
		example: [
			96146145,
			96197030,
			3285467,
			96197388,
			1845
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Unique ID of the BC Geographical Names",
		datatype: "external-id",
		id: "P2099",
		label: "BC Geographical Names ID",
		example: [
			1544340
		],
		types: [
		],
		aliases: [
			"BCGN ID"
		]
	},
	{
		description: "identifier for an athlete on the BC Sports Hall of Fame",
		datatype: "external-id",
		id: "P4392",
		label: "BC Sports Hall of Fame athlete ID",
		example: [
			6837255,
			3008536
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the database of writers from the canton of Vaud",
		datatype: "external-id",
		id: "P1253",
		label: "BCU Ecrivainsvd",
		example: [
			3094125,
			12113
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author on the BD Gest' website",
		datatype: "external-id",
		id: "P5491",
		label: "BD Gest' author ID",
		example: [
			2858864,
			542682,
			12113
		],
		types: [
		],
		aliases: [
			"bedetheque.com author ID"
		]
	},
	{
		description: "numerical identifier for a comic book series on the BD Gest' website",
		datatype: "external-id",
		id: "P8619",
		label: "BD Gest' series ID",
		example: [
			1983297,
			137475,
			1030833
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an author, topic or place in Biblioteca Digital de Castilla y León",
		datatype: "external-id",
		id: "P3964",
		label: "BDCYL authority ID",
		example: [
			6095256,
			179807,
			8203738,
			15684
		],
		types: [
		],
		aliases: [
			"BDCyL ID author/topic"
		]
	},
	{
		description: "identifier for a person on the 'Base de données des élites suisses'",
		datatype: "external-id",
		id: "P6231",
		label: "BDEL ID",
		example: [
			118347,
			116419,
			2977128
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "player ID on the Argentine Football Database website",
		datatype: "external-id",
		id: "P6188",
		label: "BDFA player ID",
		example: [
			2881446,
			615,
			455462
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of a football player at BDFutbol",
		datatype: "external-id",
		id: "P3655",
		label: "BDFutbol player ID",
		example: [
			186071
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a association football (soccer) team in the BDFutbol database",
		datatype: "external-id",
		id: "P7488",
		label: "BDFutbol team ID",
		example: [
			8687,
			856119,
			1784474,
			1422
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of an edition on the Biblioteca Digital Hispánica, including the prefix \"bdh\"",
		datatype: "external-id",
		id: "P4956",
		label: "BDH edition ID",
		example: [
			25295890
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"BHD ID"
		]
	},
	{
		description: "Unique identifier from the Buddhist Digital Resource Center",
		datatype: "external-id",
		id: "P2477",
		label: "BDRC Resource ID",
		example: [
			445460,
			927302,
			751147
		],
		types: [
		],
		aliases: [
			"Buddhist Digital Resource Center ID",
			"TBRC ID"
		]
	},
	{
		description: "identifier for a scholarly publication in the BDSP bibliographic database",
		datatype: "external-id",
		id: "P8071",
		label: "BDSP ID",
		example: [
			34007992,
			40923255,
			34253179
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"Banque de données en santé publique ID"
		]
	},
	{
		description: "identifier for a beach of the United States on the Beach Advisory and Closing On-line Notification website",
		datatype: "external-id",
		id: "P7225",
		label: "BEACON ID",
		example: [
			5195257,
			3347844,
			682162
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the British Film Institute (BFI) 'Filmography' database",
		datatype: "external-id",
		id: "P4326",
		label: "BFI Filmography person ID",
		example: [
			1362106
		],
		types: [
		],
		aliases: [
			"BFI person ID"
		]
	},
	{
		description: "identifier for a person or movie at BFI Film & TV Database. Format: 13 digits and lowercase letters",
		datatype: "external-id",
		id: "P4438",
		label: "BFI Films, TV and people ID",
		example: [
			52392,
			7374,
			23823458
		],
		types: [
		],
		aliases: [
			"BFI Film and TV ID"
		]
	},
	{
		description: "identifier for (creative) works and objects (moving image, documents, stills, posters, designs, books, articles) in the BFI's Collections Information Database (CID)",
		datatype: "external-id",
		id: "P2703",
		label: "BFI National Archive work ID",
		example: [
			180279,
			1500326,
			625780
		],
		types: [
		],
		aliases: [
			"BFI CID work priref",
			"BFI CID work identifier",
			"BFI CID film ID",
			"British Film Institute CID work ID",
			"BFI CID work ID"
		]
	},
	{
		description: "ID for the director of a French company on dirigeants.bfmtv.com",
		datatype: "external-id",
		id: "P4939",
		label: "BFMTV.com director ID",
		example: [
			32055
		],
		types: [
			"related to economics"
		],
		aliases: [
		]
	},
	{
		description: "Bulgarian place ID (settlement, community=Kmetstvo, municipality=Obshtina, province=Oblast) by the BG National Statistical Institute (NSI)",
		datatype: "external-id",
		id: "P3990",
		label: "BG EKATTE place ID",
		example: [
			1104675,
			545555,
			406057,
			2714851,
			202904,
			1585725,
			4442915,
			472,
			9305797,
			806817
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a botanical garden in the Botanic Gardens Conservation International online database",
		datatype: "external-id",
		id: "P5818",
		label: "BGCI garden ID",
		example: [
			827373,
			15304757,
			3162387
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a stratigraphic unit given by the British Geological Survey",
		datatype: "external-id",
		id: "P732",
		label: "BGS Lexicon of Named Rock Units ID",
		example: [
			1517523,
			6385644,
			2733342,
			7115292
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"BGS Lexicon ID"
		]
	},
	{
		description: "identifier of authorities used in the Bibliography of the History of the Czech Lands (BHCL)",
		datatype: "external-id",
		id: "P6656",
		label: "BHCL ID",
		example: [
			450803,
			334311,
			1934883
		],
		types: [
		],
		aliases: [
			"Bibliography of the History of the Czech Lands ID"
		]
	},
	{
		description: "identifier for an author on the online Bibliographie de l'histoire de France",
		datatype: "external-id",
		id: "P8547",
		label: "BHF author ID",
		example: [
			465440,
			3311134
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a magazine on the online Bibliographie de l'histoire de France",
		datatype: "external-id",
		id: "P8541",
		label: "BHF magazine ID",
		example: [
			27719406,
			97950168
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Biodiversity Heritage Library (BHL)",
		datatype: "external-id",
		id: "P687",
		label: "BHL Page ID",
		example: [
			163559
		],
		types: [
		],
		aliases: [
			"BHL identifier"
		]
	},
	{
		description: "identifier for a journal or book (\"bibliography\") in the Biodiversity Heritage Library (BHL)",
		datatype: "external-id",
		id: "P4327",
		label: "BHL bibliography ID",
		example: [
			21385091
		],
		types: [
		],
		aliases: [
			"BHL title ID"
		]
	},
	{
		description: "identifier for an author (\"creator\") in the Biodiversity Heritage Library database",
		datatype: "external-id",
		id: "P4081",
		label: "BHL creator ID",
		example: [
			122968,
			3161083
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"BHL ID",
			"Biodiversity Heritage Library creator ID"
		]
	},
	{
		description: "identifier of a part-work, in the BHL database",
		datatype: "external-id",
		id: "P6535",
		label: "BHL part ID",
		example: [
			56035107,
			59651112,
			59346655
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the Biographisches Archiv der Psychiatrie website",
		datatype: "external-id",
		id: "P5450",
		label: "BIA PSY person ID",
		example: [
			29875218,
			480528,
			1119328
		],
		types: [
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Norwegian Authority File, formerly Bibsys Authority File",
		datatype: "external-id",
		id: "P1015",
		label: "BIBSYS ID",
		example: [
			76483,
			43203,
			54129
		],
		types: [
		],
		aliases: [
			"BARE identifier",
			"NORAF ID",
			"W2Z ID"
		]
	},
	{
		description: "identifier for works in BIBSYS",
		datatype: "external-id",
		id: "P6211",
		label: "BIBSYS work ID",
		example: [
			50476449,
			57313148,
			57303054
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a cultural property in the catalog of the Government of the Canary Islands",
		datatype: "external-id",
		id: "P7006",
		label: "BIC of the Canary Islands ID",
		example: [
			43145531,
			781932,
			5755355
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "authority identifier in the Biblioteca Digital de Castilla-La Mancha",
		datatype: "external-id",
		id: "P6490",
		label: "BIDICAM authority ID",
		example: [
			17205463,
			1123180,
			47475,
			3113875
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the Bibliothèque interuniversitaire de santé website",
		datatype: "external-id",
		id: "P5375",
		label: "BIU Santé person ID",
		example: [
			725855,
			529,
			23613903
		],
		types: [
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "Object ID to identify cultural heritage monuments in Brandenburg state, Germany",
		datatype: "external-id",
		id: "P2081",
		label: "BLDAM object ID",
		example: [
			1309294
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "registration identifier for a composition at BMI",
		datatype: "external-id",
		id: "P4860",
		label: "BMI work ID",
		example: [
			210218,
			870786
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Broadcast Music Incorporated work ID"
		]
	},
	{
		description: "identifier of Bayerisches Musiker-Lexikon Online",
		datatype: "external-id",
		id: "P865",
		label: "BMLO ID",
		example: [
			11933906
		],
		types: [
		],
		aliases: [
			"Bayerisches Musiker-Lexikon Online ID"
		]
	},
	{
		description: "identifier of a compound in bmrb.wisc.edu, an NMR spectra database",
		datatype: "external-id",
		id: "P5219",
		label: "BMRB ID",
		example: [
			153
		],
		types: [
			"representing a unique identifier",
			"related to chemistry"
		],
		aliases: [
			"Biological Magnetic Resonance Data Bank ID",
			"Biological Magnetic Resonance Bank ID",
			"Biological Magnetic Resonance Data Bank"
		]
	},
	{
		description: "catalogue number for books (editions) in the National Library of the Argentine Republic",
		datatype: "external-id",
		id: "P1143",
		label: "BN (Argentine) editions",
		example: [
			15220486
		],
		types: [
		],
		aliases: [
			"BN ID",
			"BNA edition ID"
		]
	},
	{
		description: "identifier of a person in the British National Bibliography (bnb.data.bl.uk)",
		datatype: "external-id",
		id: "P5361",
		label: "BNB person ID",
		example: [
			692,
			5682,
			42,
			34981
		],
		types: [
		],
		aliases: [
			"British National Bibliography person ID",
			"bnb.data.bl.uk",
			"bnb.data.bl.uk person ID"
		]
	},
	{
		description: "identifier in the subject indexing tool of the National Central Library of Florence",
		datatype: "external-id",
		id: "P508",
		label: "BNCF Thesaurus ID",
		example: [
			11660,
			287
		],
		types: [
		],
		aliases: [
			"BNCF ID"
		]
	},
	{
		description: "digital collection identifier for notorious creative works within the Biblioteca Nacional Digital of the Biblioteca Nacional de Portugal",
		datatype: "external-id",
		id: "P5691",
		label: "BND ID",
		example: [
			56043869,
			22233706,
			50140064
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a journal in BNE's journals archive, an open access digital library of Spanish-language periodical publications, established by Biblioteca Nacional de España",
		datatype: "external-id",
		id: "P2768",
		label: "BNE journal ID",
		example: [
			6419450
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "authority control identifier used at the National Library of Argentina",
		datatype: "external-id",
		id: "P3788",
		label: "BNMM authority ID",
		example: [
			909,
			85311366
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for the National Library of the Kingdom of Morocco",
		datatype: "external-id",
		id: "P7058",
		label: "BNRM ID",
		example: [
			56033294,
			2642478
		],
		types: [
		],
		aliases: [
			"MRBNR ID",
			"National Library of Morocco ID"
		]
	},
	{
		description: "external and unique identifier which represents a publication in the Spanish Official Gazette",
		datatype: "external-id",
		id: "P4256",
		label: "BOE ID",
		example: [
			11688993
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon in boldsystems.org",
		datatype: "external-id",
		id: "P3606",
		label: "BOLD Systems taxon ID",
		example: [
			14045550,
			178249
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a botanical journal in the Hunt Institute's 'Botanico Periodicum Huntianum'",
		datatype: "external-id",
		id: "P4569",
		label: "BPH journal ID",
		example: [
			2975482,
			4782597
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "language code in Indonesia issued by Statistics Indonesia",
		datatype: "external-id",
		id: "P2590",
		label: "BPS language code",
		example: [
			7105295
		],
		types: [
			"representing a unique identifier",
			"for items about languages"
		],
		aliases: [
			"language code by BPS",
			"BPS language code"
		]
	},
	{
		description: "identifier for a composer in the B.R.A.H.M.S. database, by the IRCAM",
		datatype: "external-id",
		id: "P5226",
		label: "BRAHMS artist ID",
		example: [
			54075010,
			314587
		],
		types: [
		],
		aliases: [
			"B.R.A.H.M.S. artist ID"
		]
	},
	{
		description: "identifier for a musical work in the B.R.A.H.M.S. database, by the IRCAM",
		datatype: "external-id",
		id: "P5302",
		label: "BRAHMS work ID",
		example: [
			51392,
			3528773
		],
		types: [
		],
		aliases: [
			"B.R.A.H.M.S. work ID"
		]
	},
	{
		description: "identifier for bobsledder, luger and skeleton racer in the Bob- und Schlittenverband für Deutschland (BSD) database",
		datatype: "external-id",
		id: "P4650",
		label: "BSD Portal athlete ID",
		example: [
			18616324,
			108156,
			240751
		],
		types: [
		],
		aliases: [
			"Bob- und Schlittenverband für Deutschland athlete ID"
		]
	},
	{
		description: "identifier for a person at the Beach Soccer Russia site",
		datatype: "external-id",
		id: "P6252",
		label: "BSRussia player ID",
		example: [
			4344717,
			21104409,
			8199175
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "measures change of countries towards democracy and market economy",
		datatype: "quantity",
		id: "P8476",
		label: "BTI Governance Index",
		example: [
			115,
			213
		],
		types: [
			"related to economics"
		],
		aliases: [
		]
	},
	{
		description: "measures change of countries towards democracy and market economy",
		datatype: "quantity",
		id: "P8477",
		label: "BTI Status Index",
		example: [
			115,
			213
		],
		types: [
			"related to economics"
		],
		aliases: [
			"Bertelsmann Transformation Index Status"
		]
	},
	{
		description: "identifier for a bird species or sub-species in the BTO Birds of Britain/ BirdFacts database",
		datatype: "external-id",
		id: "P4798",
		label: "BTO Birds of Britain ID",
		example: [
			26147,
			26755,
			25421,
			115452
		],
		types: [
		],
		aliases: [
			"BirdFacts ID",
			"BTO 'Birds of Britain' ID",
			"'Birds of Britain' ID",
			"Birds of Britain ID"
		]
	},
	{
		description: "identifier for a bird species, issued by the British Trust for Ornithology (BTO)",
		datatype: "external-id",
		id: "P4567",
		label: "BTO five-letter code",
		example: [
			170831,
			25354
		],
		types: [
		],
		aliases: [
			"British Trust for Ornithology ID"
		]
	},
	{
		description: "identifier for a person on the Polymath Virtual Library",
		datatype: "external-id",
		id: "P6907",
		label: "BVLarramendi ID",
		example: [
			716799,
			150526,
			939889
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an author on the Biblioteca Virtual Miguel de Cervantes",
		datatype: "external-id",
		id: "P2799",
		label: "BVMC person ID",
		example: [
			41408,
			12807
		],
		types: [
		],
		aliases: [
			"Cervantesvirtual ID"
		]
	},
	{
		description: "identifier of a place on the Biblioteca Virtual Miguel de Cervantes, data.cervantesvirtual.com",
		datatype: "external-id",
		id: "P4098",
		label: "BVMC place ID",
		example: [
			1492,
			8692
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a work on the Biblioteca Virtual Miguel de Cervantes",
		datatype: "external-id",
		id: "P3976",
		label: "BVMC work ID",
		example: [
			6107050,
			2916224
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on BVMI music site",
		datatype: "external-id",
		id: "P6969",
		label: "BVMI artist ID",
		example: [
			313453,
			200577,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an author, topic or place in Biblioteca Virtual del Patrimonio Bibliográfico",
		datatype: "external-id",
		id: "P4802",
		label: "BVPB authority ID",
		example: [
			312747,
			559325,
			5836
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "authority identifier in the Biblioteca Virtual de Prensa Histórica",
		datatype: "external-id",
		id: "P6492",
		label: "BVPH authority ID",
		example: [
			439578,
			6107381,
			10400,
			199657
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in Biblioteca Virtual de Prensa Histórica",
		datatype: "external-id",
		id: "P2961",
		label: "BVPH publication ID",
		example: [
			9018646,
			17347478,
			17339738,
			5878565
		],
		types: [
		],
		aliases: [
			"Biblioteca Virtual de Prensa Histórica identifier"
		]
	},
	{
		description: "Badminton World Federation identifier for a player profile at BWFbadminton.org (via BWF.tournamentsoftware.com)",
		datatype: "external-id",
		id: "P2729",
		label: "BWF.tournamentsoftware.com player ID",
		example: [
			715563
		],
		types: [
		],
		aliases: [
			"BWF ID",
			"Badminton World Federation ID"
		]
	},
	{
		description: "identifier of a player by Badminton World Federation, at bwfbadminton.com",
		datatype: "external-id",
		id: "P3620",
		label: "BWFbadminton.com player ID",
		example: [
			185282,
			524129
		],
		types: [
		],
		aliases: [
			"BWF2 ID"
		]
	},
	{
		description: "article in the biographical lexicon of socialism and labor unions in the Netherlands",
		datatype: "external-id",
		id: "P4811",
		label: "BWSA ID",
		example: [
			2619133
		],
		types: [
		],
		aliases: [
			"Biografisch Woordenboek van het Socialisme en de Arbeidersbeweging in Nederland ID"
		]
	},
	{
		description: "identifier for an institute in the BaFin company database",
		datatype: "external-id",
		id: "P6963",
		label: "BaFin Institute ID",
		example: [
			2513963,
			157617,
			1202176
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Institute-id in the BaFin company database"
		]
	},
	{
		description: "unique identifier of category in the BaGLAMa tool",
		datatype: "external-id",
		id: "P8272",
		label: "BaGLAMa GID",
		example: [
			1327919,
			4787285
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID in BabelNet encyclopedic dictionary",
		datatype: "external-id",
		id: "P2581",
		label: "BabelNet ID",
		example: [
			7639844,
			383541,
			3490685
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author on the literature website Babelio",
		datatype: "external-id",
		id: "P3630",
		label: "Babelio author ID",
		example: [
			34670,
			563,
			2831
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a book on the literature website Babelio",
		datatype: "external-id",
		id: "P3631",
		label: "Babelio work ID",
		example: [
			163297,
			144132
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a microorganism, in the BacDive database",
		datatype: "external-id",
		id: "P2946",
		label: "BacDive ID",
		example: [
			2616475
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for nature and landscape protected areas in Baden-Württemberg (Germany), issued by the Landesanstalt für Umwelt Baden-Württemberg",
		datatype: "external-id",
		id: "P6659",
		label: "Baden-Württemberg protected area ID",
		example: [
			62069654,
			62069368,
			1971141,
			62026845
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game from the website Badgames.it",
		datatype: "external-id",
		id: "P6197",
		label: "Badgames ID",
		example: [
			18515944,
			54936079,
			54497595,
			21043786
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a badminton player at BadmintonLink.com",
		datatype: "external-id",
		id: "P3623",
		label: "BadmintonLink player ID",
		example: [
			185282,
			238635
		],
		types: [
		],
		aliases: [
			"Badminton Link ID"
		]
	},
	{
		description: "identifier of a movie from the website Badtaste.it",
		datatype: "external-id",
		id: "P6196",
		label: "Badtaste ID",
		example: [
			14522493,
			327713,
			3072040,
			174811
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "a Taiwanese database for Games, Animation, Comic, Light Novels",
		datatype: "external-id",
		id: "P6367",
		label: "Bahamut Gamer's Community ACG Database",
		example: [
			48844022,
			61627761,
			54985788
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a scholar at the Baidu Scholar website",
		datatype: "external-id",
		id: "P5647",
		label: "Baidu ScholarID",
		example: [
			40602579,
			357821,
			4843133,
			9214570
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID in the israeli database for Israeli music, owned by the National Library of Israel",
		datatype: "external-id",
		id: "P3997",
		label: "Bait La Zemer Ha-Ivri artist ID",
		example: [
			11318984
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID in the israeli database for Israeli music, owned by the National Library of Israel",
		datatype: "external-id",
		id: "P3996",
		label: "Bait La Zemer Ha-Ivri song ID",
		example: [
			6746346
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "title of corresponding article on the Ballotpedia encyclopedia of American politics",
		datatype: "external-id",
		id: "P2390",
		label: "Ballotpedia ID",
		example: [
			699872,
			22686
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Ballotpedia article"
		]
	},
	{
		description: "identifier for a school (usually government-affiliated) in the province of Balochistan",
		datatype: "external-id",
		label: "Balochistan EMIS code",
		id: "P6956",
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Balochistan Education Management Information System code"
		]
	},
	{
		description: "identifier for a basketball player on the Baloncesto Superior Nacional website",
		datatype: "external-id",
		id: "P5725",
		label: "Baloncesto Superior Nacional ID",
		example: [
			3564861,
			745776,
			3814216
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "person's ID at Baltisches Biographisches Lexikon digital encyclopedia",
		datatype: "external-id",
		id: "P2580",
		label: "Baltisches Biographisches Lexikon digital ID (former scheme)",
		example: [
			89382
		],
		types: [
		],
		aliases: [
			"BBLd ID"
		]
	},
	{
		description: "identifier for an artist (person or group) or record label, in the Bandcamp database",
		datatype: "external-id",
		id: "P3283",
		label: "Bandcamp ID",
		example: [
			240377,
			1145885,
			1143936
		],
		types: [
		],
		aliases: [
			"Bandcamp label ID",
			"Bandcamp group ID",
			"Bandcamp band ID",
			"Bandcamp person ID",
			"Bandcamp artist ID"
		]
	},
	{
		description: "Identifier for an artist on Bandsintown site",
		datatype: "external-id",
		id: "P7195",
		label: "Bandsintown artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "property for bandy players ID from bandysidan.nu",
		datatype: "external-id",
		id: "P4831",
		label: "Bandysidan player ID",
		example: [
			6012599
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of actors or movies at Bangla Movie Database",
		datatype: "external-id",
		id: "P3821",
		label: "Bangla Movie Database ID",
		example: [
			983547,
			3204464
		],
		types: [
		],
		aliases: [
			"BMDb-id"
		]
	},
	{
		description: "code used for an area for census calculations in Bangladesh, based on a scheme introduced in 2017",
		datatype: "external-id",
		id: "P6895",
		label: "Bangladesh administrative division code (2017-)",
		example: [
			4841524,
			21012776,
			19980021,
			20612809
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "code used for an area for census calculations in Bangladesh",
		datatype: "external-id",
		id: "P4530",
		label: "Bangladesh administrative division code (pre-2017)",
		example: [
			459723,
			1763301,
			3346000,
			4841524,
			4740953
		],
		types: [
		],
		aliases: [
			"Bangladesh geocode",
			"Bangladesh geo-code"
		]
	},
	{
		description: "identifier for a Bengali article on Banglapedia, the national online encyclopedia of Bangladesh",
		datatype: "external-id",
		id: "P4254",
		label: "Banglapedia (Bengali version) ID",
		example: [
			7241,
			902
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Banglapedia (Bengali) ID",
			"Banglapedia (Bn) ID",
			"Banglapedia ID"
		]
	},
	{
		description: "identifier for an English article on Banglapedia, the national online encyclopedia of Bangladesh",
		datatype: "external-id",
		id: "P4255",
		label: "Banglapedia (English version) ID",
		example: [
			7241
		],
		types: [
		],
		aliases: [
			"Banglapedia (English) ID",
			"Banglapedia (En) ID",
			"Banglapedia ID"
		]
	},
	{
		description: "unique identifier for geographical names in Quebec",
		datatype: "external-id",
		id: "P2100",
		label: "Banque de noms de lieux du Québec ID",
		example: [
			340,
			794549,
			93332,
			392161
		],
		types: [
		],
		aliases: [
			"BNLQ ID"
		]
	},
	{
		description: "ID of entry in Bantu Lexical Reconstructions",
		datatype: "external-id",
		label: "Bantu Lexical Reconstructions ID",
		id: "P6168",
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a rugby union player on the Barbarians F.C. website (the Barbarians)",
		datatype: "external-id",
		id: "P4493",
		label: "Barbarian F.C. ID",
		example: [
			2036406,
			3387305,
			1220419
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a rugby union player on the Barbarians R.C. website (the French Barbarians)",
		datatype: "external-id",
		id: "P4494",
		label: "Barbarian R.C. ID",
		example: [
			1322456,
			526295,
			776564
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for public art in Barcelona",
		datatype: "external-id",
		id: "P8601",
		label: "Barcelona Public art ID",
		example: [
			631075,
			593202,
			11922308
		],
		types: [
		],
		aliases: [
			"Art Public ID"
		]
	},
	{
		description: "identifier of a French prefect on the ''Dictionnaire biographique des préfets'', said \"Bargeton\" (1870-1980)",
		datatype: "external-id",
		id: "P4906",
		label: "Bargeton ID",
		example: [
			3102151,
			3553558,
			50085640,
			50086004,
			34615644
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork or other object on the Barnes Foundation website",
		datatype: "external-id",
		id: "P4709",
		label: "Barnes Foundation ID",
		example: [
			2538580,
			15919598
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork or other object in the Arcade database",
		datatype: "external-id",
		id: "P4764",
		label: "Base Arcade artwork ID",
		example: [
			20055095,
			16303802
		],
		types: [
		],
		aliases: [
			"Arcade ID",
			"Base Arcade ID"
		]
	},
	{
		description: "notice of a personality linked to the funds of the Mediatheque of Architecture and Heritage (France)",
		datatype: "external-id",
		id: "P3960",
		label: "Base biographique AUTOR ID",
		example: [
			3438834
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the Base de datos de premiados del Libro, Lectura y Letras database",
		datatype: "external-id",
		id: "P5498",
		label: "Base de datos de premiados person ID",
		example: [
			5971613,
			530267,
			235134
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a player on the Baseball Almanac website",
		datatype: "external-id",
		id: "P4409",
		label: "Baseball Almanac ID",
		example: [
			16150216,
			29043645
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a Major League Baseball player assigned by Baseball-Reference.com",
		datatype: "external-id",
		id: "P1825",
		label: "Baseball-Reference.com major league player ID",
		example: [
			213812
		],
		types: [
		],
		aliases: [
			"brcmlbid"
		]
	},
	{
		description: "identifier for a Minor League Baseball player assigned by Baseball-Reference.com",
		datatype: "external-id",
		id: "P1826",
		label: "Baseball-Reference.com minor & foreign league player ID",
		example: [
			213812
		],
		types: [
		],
		aliases: [
			"brcmilbid"
		]
	},
	{
		description: "Encyclopedia",
		datatype: "external-id",
		id: "P4210",
		label: "Bashkir encyclopedia (Bashkir version) ID",
		example: [
			288115,
			58697,
			145707
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "Bashkir Encyclopedia",
		datatype: "external-id",
		id: "P4211",
		label: "Bashkir encyclopedia (Russian version) ID",
		example: [
			288115,
			112707,
			161211
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "code given to each basic unit of settlement (smallest administrative entity, below municipality) in the Czech Republic",
		datatype: "external-id",
		id: "P3419",
		label: "Basic Unit of Settlement code (Czech)",
		example: [
			11727381
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an event in the Basis Wien database",
		datatype: "external-id",
		id: "P7447",
		label: "Basis Wien event ID",
		example: [
			55336703,
			55338221,
			60413254
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of an institution in the Basis Wien database",
		datatype: "external-id",
		id: "P7446",
		label: "Basis Wien institution ID",
		example: [
			877686,
			1492387,
			303139
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of an object in the Basis Wien database",
		datatype: "external-id",
		id: "P7448",
		label: "Basis Wien object ID",
		example: [
			26849103,
			3067100,
			2996883
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person in the Basis Wien database",
		datatype: "external-id",
		id: "P7445",
		label: "Basis Wien person ID",
		example: [
			152835,
			16161027,
			158080,
			59640291
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "corresponding class in the Basisklassifikation library classification",
		datatype: "external-id",
		id: "P5748",
		label: "Basisklassifikation",
		example: [
			5891,
			7202,
			2945,
			34749
		],
		types: [
		],
		aliases: [
			"Nederlandse basisclassificatie"
		]
	},
	{
		description: "register number, issued by the Dutch ministry of Education, given to schools",
		datatype: "external-id",
		id: "P3061",
		label: "Basisregistratie Instellingen number",
		example: [
			808313
		],
		types: [
		],
		aliases: [
			"BRIN identifier",
			"BRIN number"
		]
	},
	{
		description: "identifier for a basketball player on the Basketball Bundesliga website",
		datatype: "external-id",
		id: "P5724",
		label: "Basketball Bundesliga ID",
		example: [
			443730,
			44068
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an NBA G League (formerly NBDL) player on the Basketball Reference website",
		datatype: "external-id",
		id: "P4744",
		label: "Basketball-Reference.com NBA G League player ID",
		example: [
			3136207
		],
		types: [
		],
		aliases: [
			"Basketball-Reference.com NBDL player ID"
		]
	},
	{
		description: "identifier for a NBA coach on the Basketball Reference website",
		datatype: "external-id",
		id: "P4718",
		label: "Basketball-Reference.com NBA coach ID",
		example: [
			988438
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a NBA player on the Basketball Reference website",
		datatype: "external-id",
		id: "P2685",
		label: "Basketball-Reference.com NBA player ID",
		example: [
			179051
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a NBL player on the Basketball Reference website",
		datatype: "external-id",
		id: "P4796",
		label: "Basketball-Reference.com NBL player ID",
		example: [
			1640546
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a WNBA coach on the Basketball Reference website",
		datatype: "external-id",
		id: "P4720",
		label: "Basketball-Reference.com WNBA coach ID",
		example: [
			2342516
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a  Women's National Basketball Association player on the Basketball-Reference.com website",
		datatype: "external-id",
		id: "P4561",
		label: "Basketball-Reference.com WNBA player ID",
		example: [
			202823,
			2017351
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a basketball player in a non-U.S. league on Basketball-Reference.com",
		datatype: "external-id",
		id: "P4790",
		label: "Basketball-Reference.com international player ID",
		example: [
			4714896
		],
		types: [
		],
		aliases: [
			"Basketball-Reference player ID",
			"Basketball-Reference.com Europe player ID"
		]
	},
	{
		description: "identifier for a referee on the Basketball Reference website",
		datatype: "external-id",
		id: "P4795",
		label: "Basketball-Reference.com referee ID",
		example: [
			905067
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of the article in Basque Vikidia",
		datatype: "external-id",
		id: "P7832",
		label: "Basque Vikidia ID",
		example: [
			5994,
			29,
			96
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"euvd",
			"Vikidia article in Basque",
			"article in Basque Vikidia"
		]
	},
	{
		description: "identifier for geotopes in Bavaria (Germany), issued by the Bayerisches Landesamt für Umwelt",
		datatype: "external-id",
		id: "P4266",
		label: "Bavarian geotope ID",
		example: [
			14544537,
			319104
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for cultural heritage monuments (ensembles, buildings and grounds) in Bavaria, issued by the Bavarian State Office for the Preservation of Monuments",
		datatype: "external-id",
		id: "P4244",
		label: "Bavarian monument authority ID",
		example: [
			19631467
		],
		types: [
		],
		aliases: [
			"BLfD-ID"
		]
	},
	{
		description: "identifier for nature and landscape protected areas in Bavaria (Germany), issued by the Bayerisches Landesamt für Umwelt",
		datatype: "external-id",
		id: "P6230",
		label: "Bavarian protected area ID",
		example: [
			28951282,
			19964654
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a geographical object in the database of places of Bavarikon",
		datatype: "external-id",
		id: "P4005",
		label: "Bavarikon ID",
		example: [
			3974,
			1653,
			23891544
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an Italian church, in the Italian Episcopal Conference database",
		datatype: "external-id",
		id: "P5611",
		label: "BeWeb church ID",
		example: [
			3904601,
			3670076,
			1125412
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a cultural institution, in the Italian Episcopal Conference database",
		datatype: "external-id",
		id: "P8200",
		label: "BeWeb cultural institution ID",
		example: [
			55859362,
			86538395,
			3639656,
			58700502
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a entity, in the Italian Episcopal Conference database",
		datatype: "external-id",
		id: "P7797",
		label: "BeWeb entity ID",
		example: [
			637335,
			3670341
		],
		types: [
			"multi-source external identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a family, in the Italian Episcopal Conference database",
		datatype: "external-id",
		id: "P7798",
		label: "BeWeb family ID",
		example: [
			3700648,
			938697
		],
		types: [
			"multi-source external identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person, in the Italian Episcopal Conference database",
		datatype: "external-id",
		id: "P7796",
		label: "BeWeb person ID",
		example: [
			155971,
			131945,
			2494,
			59530830,
			450675
		],
		types: [
			"multi-source external identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete, in the Beach Volleyball Database",
		datatype: "external-id",
		id: "P2800",
		label: "Beach Volleyball Database ID",
		example: [
			537300,
			182106
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique identifier of an Australian beach in the Beachsafe database operated by Surf Life Saving Australia",
		datatype: "external-id",
		id: "P7396",
		label: "Beachsafe Beach Key",
		example: [
			21919992,
			4974072,
			2123432,
			6863837
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a player at the St. Petersburg Beach Soccer Federation site",
		datatype: "external-id",
		id: "P6253",
		label: "Beachsoccer.ru player ID",
		example: [
			4344717,
			21104409,
			8199175
		],
		types: [
		],
		aliases: [
			"Beachsoccer.ru person ID"
		]
	},
	{
		description: "identifier for an artist on Beatport.com music site",
		datatype: "external-id",
		id: "P6894",
		label: "Beatport artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a label on Beatport.com music site",
		datatype: "external-id",
		id: "P7371",
		label: "Beatport label ID",
		example: [
			68761301,
			389284,
			56760250
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Beatport label identifier"
		]
	},
	{
		description: "identifier for an artefact in the Beazley Archive Pottery Database",
		datatype: "external-id",
		id: "P4178",
		label: "Beazley Archive Pottery Database ID",
		example: [
			834119,
			252376
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on Bebo site",
		datatype: "external-id",
		id: "P6905",
		label: "Bebo profile ID",
		example: [
			383541,
			76244
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film on bechdeltest.com",
		datatype: "external-id",
		id: "P4632",
		label: "Bechdel Test Movie List ID",
		example: [
			200672,
			23010088
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a brewery, in the Beer Advocate database",
		datatype: "external-id",
		id: "P2904",
		label: "Beer Advocate brewery ID",
		example: [
			1828277
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a television show on the website",
		datatype: "external-id",
		id: "P5387",
		label: "Behind The Voice Actors TV show ID",
		example: [
			20590069,
			586025,
			431930,
			22101190
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"BTVA TV show ID"
		]
	},
	{
		description: "identifier of a character from the Behind The Voice Actors website",
		datatype: "external-id",
		id: "P5107",
		label: "Behind The Voice Actors character ID",
		example: [
			1140524,
			1621656
		],
		types: [
		],
		aliases: [
			"BTVA character ID"
		]
	},
	{
		description: "identifier of a film on the website Behind The Voice Actors",
		datatype: "external-id",
		id: "P5384",
		label: "Behind The Voice Actors film ID",
		example: [
			965699,
			1066948,
			1905968,
			1689499
		],
		types: [
		],
		aliases: [
			"BTVA movie ID",
			"Behind The Voice Actors movie ID"
		]
	},
	{
		description: "identifier of a franchise on the website",
		datatype: "external-id",
		id: "P5382",
		label: "Behind The Voice Actors franchise ID",
		example: [
			216655,
			12393,
			192156,
			236821
		],
		types: [
		],
		aliases: [
			"BTVA franchise ID"
		]
	},
	{
		description: "identifier of a person on the website Behind The Voice Actors",
		datatype: "external-id",
		id: "P5007",
		label: "Behind The Voice Actors person ID",
		example: [
			711792,
			11657172
		],
		types: [
		],
		aliases: [
			"BTVA person ID",
			"behindthevoiceactors.com person ID"
		]
	},
	{
		description: "identifier of a short on the website Behind The Voice Actors",
		datatype: "external-id",
		id: "P7318",
		label: "Behind The Voice Actors short ID",
		example: [
			26912012,
			66981516,
			23636660
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"BTVA short ID"
		]
	},
	{
		description: "identifier for video games on the website Behind The Voice Actors",
		datatype: "external-id",
		id: "P4965",
		label: "Behind The Voice Actors video game ID",
		example: [
			22128344,
			27950674,
			16681843
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"BTVA video game ID",
			"behindthevoiceactors.com video game ID"
		]
	},
	{
		description: "reference to works in the Corpus Aristotelicum",
		datatype: "external-id",
		id: "P2683",
		label: "Bekker Number",
		example: [
			3481620,
			1095335
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for notorious individuals, companies and artworks associated to the Belgian heritage in Brazil",
		datatype: "external-id",
		id: "P5528",
		label: "Belgian Heritage in Brazil ID",
		example: [
			55511256,
			5474348,
			1328348
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the website of the Belgian Senate",
		datatype: "external-id",
		id: "P3298",
		label: "Belgian Senate person ID",
		example: [
			19587616
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon in the Belgian Species List",
		datatype: "external-id",
		id: "P7202",
		label: "Belgian Species List ID",
		example: [
			757127,
			163582,
			161533,
			155945
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier assigned to an artist by the Österreichische Galerie Belvedere in Vienna",
		datatype: "external-id",
		id: "P3421",
		label: "Belvedere artist ID",
		example: [
			4015193
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork in the Österreichische Galerie Belvedere in Vienna",
		datatype: "external-id",
		id: "P5823",
		label: "Belvedere object ID",
		example: [
			698487,
			2324643,
			17320370
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "author identifier in Project Ben-Yehuda",
		datatype: "external-id",
		id: "P7507",
		label: "Ben Yehuda author ID",
		example: [
			202749,
			2086130,
			1329454
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for train stations used by Benerail/SNCB/Thalys",
		datatype: "external-id",
		id: "P8448",
		label: "Benerail station ID",
		example: [
			745942,
			50719,
			800587
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in Benezit Dictionary of Artists",
		datatype: "external-id",
		id: "P2843",
		label: "Benezit ID",
		example: [
			16915458,
			493
		],
		types: [
		],
		aliases: [
			"Bénézit",
			"Benezit Dictionary of Artists ID",
			"Bénézit Dictionary of Artists ID"
		]
	},
	{
		description: "link to the Berliner Papyrusdatenbank",
		datatype: "external-id",
		id: "P1948",
		label: "BerlPap identifier",
		example: [
			479542
		],
		types: [
		],
		aliases: [
			"BerlPap ID"
		]
	},
	{
		description: "identifer for an object in the cultural heritage database of Berlin",
		datatype: "external-id",
		id: "P2424",
		label: "Berlin cultural heritage ID",
		example: [
			21776729,
			5086
		],
		types: [
		],
		aliases: [
			"Berliner Denkmaldatenbank ID"
		]
	},
	{
		description: "identifier of protected areas in Berlin, Germany",
		datatype: "string",
		id: "P6280",
		label: "Berlin protected area ID",
		example: [
			59786186,
			59780143,
			21425991,
			59780261,
			15812946
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "artist identifier for the Berlinische Galerie",
		datatype: "external-id",
		id: "P4580",
		label: "Berlinische Galerie artist ID",
		example: [
			1458043
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "stable identifier of a resource linked to the Ethiopic manuscript tradition present in the Beta maṣāḥǝft research environment (https://betamasaheft.eu/)",
		datatype: "external-id",
		id: "P7846",
		label: "Beta maṣāḥǝft ID",
		example: [
			1123371,
			218861,
			887847
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "Identifier in the BiblioNet database of authors, created by the National Book Centre of Greece, many Greek individual publishers and their professional associations",
		datatype: "external-id",
		id: "P2188",
		label: "BiblioNet author ID",
		example: [
			216980
		],
		types: [
		],
		aliases: [
			"BiblioNet author identifier"
		]
	},
	{
		description: "identifier in the BiblioNet database of book editions",
		datatype: "external-id",
		id: "P2187",
		label: "BiblioNet publication ID",
		example: [
			208002
		],
		types: [
		],
		aliases: [
			"BiblioNet publication identifier"
		]
	},
	{
		description: "identifier in the BiblioNet database of publishers",
		datatype: "external-id",
		id: "P2189",
		label: "BiblioNet publisher ID",
		example: [
			16331089
		],
		types: [
		],
		aliases: [
			"BiblioNet publisher identifier"
		]
	},
	{
		description: "identifier of authorities used in Slovak history bibliography BHS",
		datatype: "external-id",
		id: "P8238",
		label: "Bibliography of the History of Slovakia ID",
		example: [
			754790,
			319962,
			13418852
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author in the Bibliopoche database",
		datatype: "external-id",
		id: "P5695",
		label: "Bibliopoche author ID",
		example: [
			231886,
			174210,
			3009753
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "catalogue number for books (editions), periodical, magazine, map, photography and other media in the Biblioteca Nacional de Chile",
		datatype: "external-id",
		id: "P1966",
		label: "Biblioteca Nacional de Chile catalogue number",
		example: [
			19900255,
			7190653
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"BNC catalogue number",
			"BN catalogue number"
		]
	},
	{
		description: "identifier from the authority file of the Biblioteca Nacional de España. Format for persons: \"XX\" followed by 4 to 7 digits",
		datatype: "external-id",
		id: "P950",
		label: "Biblioteca Nacional de España ID",
		example: [
			79822,
			66065,
			55183125
		],
		types: [
		],
		aliases: [
			"BNE identifier",
			"BNE ID"
		]
	},
	{
		description: "authority control identifier used at the Biblioteca Nacional de México",
		datatype: "external-id",
		id: "P4440",
		label: "Biblioteca Nacional de México ID",
		example: [
			46739,
			5495070,
			23548
		],
		types: [
		],
		aliases: [
			"BNM ID"
		]
	},
	{
		description: "authority identifier in the Biblioteca Virtual de Andalucía",
		datatype: "external-id",
		id: "P6496",
		label: "Biblioteca Virtual Andalucía authority ID",
		example: [
			5752699,
			9066346,
			2497655,
			45941543,
			231606
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a philosopher in the project Biblioteche dei filosofi",
		datatype: "external-id",
		id: "P7613",
		label: "Biblioteche dei filosofi ID",
		example: [
			443239,
			3616916,
			954692,
			9381
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author in the website Bibliotheca Augustana",
		datatype: "external-id",
		id: "P8160",
		label: "Bibliotheca Augustana author ID",
		example: [
			213484,
			60059,
			61078
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for Greek hagiographical works",
		datatype: "external-id",
		id: "P7987",
		label: "Bibliotheca Hagiographica Graeca ID",
		example: [
			12902615,
			22906180,
			15649460
		],
		types: [
		],
		aliases: [
			"BHG ID"
		]
	},
	{
		description: "identifier for Latin hagiographical works",
		datatype: "external-id",
		id: "P7924",
		label: "Bibliotheca Hagiographica Latina ID",
		example: [
			4014867,
			50142376,
			6872518
		],
		types: [
		],
		aliases: [
			"BHL ID"
		]
	},
	{
		description: "identifier for an author on the Bibliothèque de la Pléiade website",
		datatype: "external-id",
		id: "P5613",
		label: "Bibliothèque de la Pléiade ID",
		example: [
			448,
			905,
			163118
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for the subject issued by BNF (Bibliothèque nationale de France). Format: 8 digits followed by a check-digit or letter, do not include the initial 'cb'.",
		datatype: "external-id",
		id: "P268",
		label: "Bibliothèque nationale de France ID",
		example: [
			7836,
			212,
			430
		],
		types: [
		],
		aliases: [
			"RAMEAU ID",
			"BnF ID",
			"BNF",
			"BnF identifier"
		]
	},
	{
		description: "identifier for an item in the Spanish heritage register (included RI/ARI)",
		datatype: "external-id",
		id: "P808",
		label: "Bien de Interés Cultural (BIC) code",
		example: [
			14563353
		],
		types: [
		],
		aliases: [
			"BIC code"
		]
	},
	{
		description: "identifier for the Big Cartoon Database",
		datatype: "external-id",
		id: "P4933",
		label: "Big Cartoon Database ID",
		example: [
			7746835,
			19090
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"BCDB ID"
		]
	},
	{
		description: "property for Bildindex",
		datatype: "external-id",
		id: "P2092",
		label: "Bildindex der Kunst und Architektur ID",
		example: [
			232087,
			17149530
		],
		types: [
		],
		aliases: [
			"Bildindex ID",
			"Marburg Picture Index ID"
		]
	},
	{
		description: "identifier of animation episodes on Bilibili",
		datatype: "external-id",
		id: "P6453",
		label: "Bilibili bangumi ID",
		example: [
			1339165,
			24875612
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "number of a tag of Bilibili, a Chinese video website similar to YouTube or Niconico",
		datatype: "external-id",
		id: "P6454",
		label: "Bilibili tag ID",
		example: [
			11078453,
			30948738,
			30593951
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "this item's user ID on Bilibili",
		datatype: "external-id",
		id: "P6455",
		label: "Bilibili userID",
		example: [
			28410217,
			24841278,
			2603945
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Bilibili UID"
		]
	},
	{
		description: "identifier of a video on Bilibili",
		datatype: "external-id",
		id: "P6456",
		label: "Bilibili video ID",
		example: [
			22774508
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist at the Billboard website",
		datatype: "external-id",
		id: "P4208",
		label: "Billboard artist ID",
		example: [
			1299,
			83287,
			25396976,
			51118
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a burial ground, on the BillionGraves website",
		datatype: "external-id",
		id: "P4352",
		label: "BillionGraves cemetery ID",
		example: [
			2972519,
			5430638,
			63457515
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a persona in the Biographisches Lexikon zur Geschichte Südosteuropas",
		datatype: "external-id",
		id: "P7928",
		label: "BioLexSOE ID",
		example: [
			366845,
			36450,
			317911
		],
		types: [
		],
		aliases: [
			"Biographisches Lexikon zur Geschichte Südosteuropas ID"
		]
	},
	{
		description: "identifier for a taxon in the biological encyclopedia BioLib",
		datatype: "external-id",
		id: "P838",
		label: "BioLib taxon ID",
		example: [
			1478899,
			420732
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an academic journal on the BioOne website",
		datatype: "external-id",
		id: "P6143",
		label: "BioOne journal ID",
		example: [
			5735523,
			43617248,
			21385774
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a document in bioRxiv, a preprint repository for the biological sciences launched in November 2013",
		datatype: "external-id",
		id: "P3951",
		label: "BioRxiv ID",
		example: [
			28597702
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a work in the BioStor digital library",
		datatype: "external-id",
		id: "P5315",
		label: "BioStor work ID",
		example: [
			54854529,
			54855075
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a repository, in the Biodiversity Repository database",
		datatype: "external-id",
		id: "P4090",
		label: "Biodiversity Repository ID",
		example: [
			217717,
			934439,
			649895
		],
		types: [
		],
		aliases: [
			"institution code"
		]
	},
	{
		description: "identifier for species found in West Bengal maintained by the 'Biodiversity of West Bengal' database",
		datatype: "external-id",
		id: "P7549",
		label: "Biodiversity of West Bengal species ID",
		example: [
			1305417,
			643738,
			614625
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier at Biografisch Portaal van Nederland",
		datatype: "external-id",
		id: "P651",
		label: "Biografisch Portaal van Nederland ID",
		example: [
			2929721,
			57152093
		],
		types: [
		],
		aliases: [
			"BPN ID"
		]
	},
	{
		description: "identifier for an article in the Biografisch Woordenboek van Nederland: 1880-2000",
		datatype: "external-id",
		id: "P7941",
		label: "Biografisch Woordenboek van Nederland: 1880-2000 ID",
		example: [
			2335258,
			530883,
			21553316
		],
		types: [
		],
		aliases: [
			"Biografisch Woordenboek van Nederland 1880-2000 ID",
			"BWN 1880-2000 ID"
		]
	},
	{
		description: "identifier in the Biografiskt Lexikon för Finland released by Svenska litteratursällskapet i Finland",
		datatype: "external-id",
		id: "P3595",
		label: "Biografiskt Lexikon för Finland ID",
		example: [
			82840,
			354365
		],
		types: [
		],
		aliases: [
			"BLF article ID"
		]
	},
	{
		description: "identifier for an architect in the Biographical Dictionary of Architects in Canada website",
		datatype: "external-id",
		id: "P8098",
		label: "Biographical Dictionary of Architects in Canada ID",
		example: [
			2958277,
			3056906,
			27178148,
			5498584,
			7789839
		],
		types: [
		],
		aliases: [
			"BDAC ID"
		]
	},
	{
		description: "identifier for a person, in the Biographical Dictionary of Georgia",
		datatype: "external-id",
		id: "P4991",
		label: "Biographical Dictionary of Georgia ID",
		example: [
			50577156,
			3506286
		],
		types: [
		],
		aliases: [
			"Georgian Biographical Dictionary",
			"nplg"
		]
	},
	{
		description: "ID of entry in Biographical Dictionary of Iowa",
		datatype: "external-id",
		id: "P6851",
		label: "Biographical Dictionary of Iowa ID",
		example: [
			5080712,
			723993,
			1699584
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a judge in the Biographical Directory of Federal Judges",
		datatype: "external-id",
		id: "P2736",
		label: "Biographical Directory of Federal Judges ID",
		example: [
			7344755,
			7306932,
			6775314
		],
		types: [
		],
		aliases: [
			"Federal Judicial Center biography ID",
			"FJC biography ID"
		]
	},
	{
		description: "identifier for a person on the ''Biographie nationale de Belgique''",
		datatype: "external-id",
		id: "P6234",
		label: "Biographie nationale de Belgique ID",
		example: [
			55911420,
			15486917,
			1708455
		],
		types: [
		],
		aliases: [
			"Biographie nationale belge",
			"National Biography of Belgium",
			"Belgium National Biography"
		]
	},
	{
		description: "identifier for a person on 'Biographie vosgienne",
		datatype: "external-id",
		id: "P6059",
		label: "Biographie vosgienne ID",
		example: [
			3056977,
			2847983,
			3501746
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a collector and/or determiner of natural history specimens, in the Bionomia database",
		datatype: "external-id",
		id: "P6944",
		label: "Bionomia ID",
		example: [
			56033999,
			22113085,
			5367580,
			7356570
		],
		types: [
		],
		aliases: [
			"Bloodhound ID"
		]
	},
	{
		description: "identifier for a species on the BirdLife Australia website",
		datatype: "external-id",
		id: "P6040",
		label: "BirdLife Australia ID",
		example: [
			114477,
			1067859,
			250051
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an area officially-designated an 'Important Bird & Biodiversity Area' (IBA) by BirdLife International",
		datatype: "external-id",
		id: "P6070",
		label: "BirdLife International IBA ID",
		example: [
			57830991,
			3089739,
			849143
		],
		types: [
		],
		aliases: [
			"IBA ID"
		]
	},
	{
		description: "identifier for an avian taxon, in the BirdLife factsheet database",
		datatype: "external-id",
		id: "P5257",
		label: "BirdLife taxon ID",
		example: [
			1591533,
			26431
		],
		types: [
		],
		aliases: [
			"BirdLife International taxon ID",
			"BirdLife International ID"
		]
	},
	{
		description: "identifier for birds found in India maintained by the 'Birds of India' database",
		datatype: "external-id",
		id: "P7536",
		label: "Birds of India ID",
		example: [
			1094743,
			28122714,
			170723
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author in the Digital Library of Galician Literary Translation database (Bitraga) of the University of Vigo",
		datatype: "external-id",
		id: "P6173",
		label: "Bitraga author ID",
		example: [
			47595,
			868,
			692
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a work in the Digital Library of Galician Literary Translation database (Bitraga) of the University of Vigo",
		datatype: "external-id",
		id: "P6175",
		label: "Bitraga work ID",
		example: [
			480,
			3091932,
			41567
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of chemical compound in BitterDB",
		datatype: "external-id",
		id: "P8354",
		label: "BitterDB compound ID",
		example: [
			60235,
			5383219
		],
		types: [
			"related to chemistry",
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a North American mountain, at Bivouac.com",
		datatype: "external-id",
		id: "P3507",
		label: "Bivouac.com mountain ID",
		example: [
			1170479
		],
		types: [
		],
		aliases: [
			"Bivouac Mountain Encyclopedia mountain ID"
		]
	},
	{
		description: "identifier of a North American mountain pass, at Bivouac.com",
		datatype: "external-id",
		id: "P3813",
		label: "Bivouac.com pass ID",
		example: [
			383051,
			2982127
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Encyclopedia of Turkey's Famous People",
		datatype: "external-id",
		id: "P7023",
		label: "Biyografya ID",
		example: [
			344241,
			270739,
			184906
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Internet Encyclopedia of Turkey's Famous People",
			"biyografya.com"
		]
	},
	{
		description: "ID of a female rugby union player of the Black Ferns, the New Zealand women's national rugby union team",
		datatype: "external-id",
		id: "P5636",
		label: "Black Ferns player ID",
		example: [
			17318599,
			40337518,
			39917841
		],
		types: [
		],
		aliases: [
			"Black Ferns ID"
		]
	},
	{
		description: "identifier for articles on BlackPast.org",
		datatype: "external-id",
		id: "P6723",
		label: "BlackPast.org ID",
		example: [
			8027,
			2449,
			747589,
			220497
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a company, in the Bloomberg database",
		datatype: "external-id",
		id: "P3377",
		label: "Bloomberg company ID",
		example: [
			687508,
			687508,
			2287759
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a business person, at Bloomberg",
		datatype: "external-id",
		id: "P3052",
		label: "Bloomberg person ID",
		example: [
			23301821
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Bluebook citation style includes abbreviations",
		datatype: "external-id",
		id: "P1162",
		label: "Bluebook abbreviation",
		example: [
			6054465,
			8027220
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique identifier of a certification granted by Bluetooth SIG for product conformance to Bluetooth standards",
		datatype: "external-id",
		id: "P7428",
		label: "Bluetooth Declaration ID",
		example: [
			66816645,
			66816646,
			66816987
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a rider on the Bmx-results.com website",
		datatype: "external-id",
		id: "P3942",
		label: "Bmx-results.com rider ID",
		example: [
			3183914,
			2855123
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the Business of Fashion website",
		datatype: "external-id",
		id: "P3814",
		label: "BoF person ID",
		example: [
			16197586,
			6557954
		],
		types: [
		],
		aliases: [
			"The Business of Fashion person ID",
			"Business of Fashion person ID"
		]
	},
	{
		description: "identifier for a board game in the Board Game Atlas database",
		datatype: "external-id",
		id: "P6491",
		label: "Board Game Atlas ID",
		example: [
			17276,
			531592,
			17271,
			36719002,
			2697993
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a board game in the BoardGameGeek database",
		datatype: "external-id",
		id: "P2339",
		label: "BoardGameGeek ID",
		example: [
			18352396,
			718
		],
		types: [
		],
		aliases: [
			"BGG ID"
		]
	},
	{
		description: "ID for a game designer at BoardGameGeek",
		datatype: "external-id",
		id: "P3505",
		label: "BoardGameGeek designer ID",
		example: [
			61088
		],
		types: [
		],
		aliases: [
			"BGG designer ID"
		]
	},
	{
		description: "identifier for a game series on the BoardGameGeek website",
		datatype: "external-id",
		id: "P8675",
		label: "BoardGameGeek family ID",
		example: [
			28912766,
			31837127
		],
		types: [
		],
		aliases: [
			"BGG family ID"
		]
	},
	{
		description: "identifier for a publisher on the BoardGameGeek website",
		datatype: "external-id",
		id: "P6160",
		label: "BoardGameGeek game publisher ID",
		example: [
			669137,
			41863826,
			24910983
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a lexeme on Bob",
		datatype: "external-id",
		label: "Bob ID",
		id: "P7766",
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist in the Museum Boijmans Van Beuningen",
		datatype: "external-id",
		id: "P3888",
		label: "Boijmans artist ID",
		example: [
			321245,
			289441
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork in the Museum Boijmans Van Beuningen",
		datatype: "external-id",
		id: "P5499",
		label: "Boijmans work ID",
		example: [
			29856358,
			2400652,
			2663568
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for Indian film at Bollywood Hungama",
		datatype: "external-id",
		id: "P8674",
		label: "Bollywood Hungama movie ID",
		example: [
			1637390,
			7117022
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an actor on Bollywood Hungama",
		datatype: "external-id",
		id: "P7923",
		label: "Bollywood Hungama person alphabetic ID",
		example: [
			9570,
			6366618
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of an actor at Bollywood Hungama in the former scheme. Format: up to 9 digits",
		datatype: "external-id",
		id: "P3910",
		label: "Bollywood Hungama person numeric ID",
		example: [
			9570,
			4725343
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a book at Book Marks",
		datatype: "external-id",
		id: "P8632",
		label: "Book Marks ID",
		example: [
			28846426,
			94661738
		],
		types: [
		],
		aliases: [
			"BookMarks ID",
			"Book Marks book ID",
			"BookMarks book ID"
		]
	},
	{
		description: "identifier for a creator per the BookBrainz open book encyclopedia",
		datatype: "external-id",
		id: "P2607",
		label: "BookBrainz author ID",
		example: [
			211542,
			3827096
		],
		types: [
		],
		aliases: [
			"BookBrainz creator ID"
		]
	},
	{
		description: "identifier for a publisher or imprint on the BookBrainz open book encyclopedia",
		datatype: "external-id",
		id: "P8063",
		label: "BookBrainz publisher ID",
		example: [
			1336200,
			11281443,
			1444698
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a work on the BookBrainz open book encyclopedia",
		datatype: "external-id",
		id: "P7823",
		label: "BookBrainz work ID",
		example: [
			3107329,
			89292126
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"BB work iD"
		]
	},
	{
		description: "identifier for a hotel on the Booking.com website",
		datatype: "external-id",
		id: "P3607",
		label: "Booking.com hotel ID",
		example: [
			3268021,
			7641161
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "a page in Bookogs database which connects to books and magazines authored by a person, or describing a person or thing or idea",
		datatype: "external-id",
		id: "P8230",
		label: "Bookogs credit ID",
		example: [
			34660,
			1336200,
			333,
			170534,
			1511
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a written work in the Bookogs database",
		datatype: "external-id",
		id: "P8211",
		label: "Bookogs work ID",
		example: [
			471726,
			6511,
			206870
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique identifier of a archeological site in Canada",
		datatype: "external-id",
		id: "P3611",
		label: "Borden Code",
		example: [
			3398314,
			1717492
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a movie at the website Box Office Mojo",
		datatype: "external-id",
		id: "P1237",
		label: "Box Office Mojo film ID",
		example: [
			2875,
			634729
		],
		types: [
		],
		aliases: [
			"boxofficemojo"
		]
	},
	{
		description: "identifier of a franchise in the Box Office Mojo database",
		datatype: "external-id",
		id: "P2530",
		label: "Box Office Mojo franchise ID",
		example: [
			642878
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person in the Box Office Mojo database",
		datatype: "external-id",
		id: "P2688",
		label: "Box Office Mojo person ID",
		example: [
			175535
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film studio in the Box Office Mojo database",
		datatype: "external-id",
		id: "P2531",
		label: "Box Office Mojo studio ID",
		example: [
			126399,
			891732
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier for a boxer in the BoxRec database",
		datatype: "external-id",
		id: "P1967",
		label: "BoxRec boxer ID",
		example: [
			36107,
			273206,
			328951
		],
		types: [
		],
		aliases: [
			"BoxRec ID"
		]
	},
	{
		description: "Bpk-identificator, identifier for art photos by picture agency, Image Bank of cultural institutions",
		datatype: "external-id",
		id: "P5891",
		label: "Bpk-ID",
		example: [
			20828882,
			577165
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "reference for a species in the Bradley and Fletcher checklist of British lepidoptera",
		datatype: "external-id",
		id: "P1743",
		label: "Bradley and Fletcher checklist number",
		example: [
			1355083,
			265918
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "numeric identifier of a brain structure in the BrainInfo (NeuroNames) database in hierarchical mode",
		datatype: "external-id",
		id: "P4395",
		label: "BrainInfo ID (hierarchical)",
		example: [
			184215
		],
		types: [
			"related to medicine",
			"representing a unique identifier"
		],
		aliases: [
			"NeuroNames ID (hierarchical)"
		]
	},
	{
		description: "identifier for an artwork, in the \"Brasiliana Infográfica\" database",
		datatype: "external-id",
		id: "P6004",
		label: "Brasiliana Iconográfica ID",
		example: [
			28806054,
			19595116,
			28806053
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a mathematics teacher on the online Dictionnaire des professeurs de mathématiques spéciales",
		datatype: "external-id",
		id: "P5629",
		label: "Brasseur ID",
		example: [
			1874011,
			55984191,
			55985461
		],
		types: [
		],
		aliases: [
			"Dictionnaire des professeurs de mathématiques spéciales ID",
			"DPMS ID"
		]
	},
	{
		description: "unique identifier of an brazilian electoral unit, defined by the Brazilian Superior Electoral Court",
		datatype: "external-id",
		id: "P6555",
		label: "Brazilian Electoral Unit ID",
		example: [
			983810,
			1761456,
			28441,
			174
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a Brazilian athlete at the Brazilian Olympic Committee (Portuguese: Comitê Olímpico do Brasil) website",
		datatype: "external-id",
		id: "P4060",
		label: "Brazilian Olympic Committee athlete ID",
		example: [
			13534184,
			4353360
		],
		types: [
		],
		aliases: [
			"BOC athlete ID",
			"Comitê Olímpico do Brasil athlete ID",
			"COB athlete ID"
		]
	},
	{
		description: "identifier for a member of the Chamber of Deputies of Brazil",
		datatype: "external-id",
		id: "P7480",
		label: "Brazilian federal deputy ID",
		example: [
			519210,
			10299703,
			10270650
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for municipalities in Brazil",
		datatype: "external-id",
		id: "P1585",
		label: "Brazilian municipality code",
		example: [
			43463,
			167436
		],
		types: [
		],
		aliases: [
			"IBGE code"
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P5501",
		label: "Brenda Tissue Ontology ID",
		example: [
			51955198
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"BTO-ID"
		]
	},
	{
		description: "identifier for a species in the Brentidae of the world database",
		datatype: "external-id",
		id: "P6485",
		label: "Brentidae of the world species ID",
		example: [
			9150133,
			55220471,
			21321187
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier from database based on the National Bridge Inventory. Lists every U.S. bridge over 20 feet (6 meters) long",
		datatype: "external-id",
		id: "P1380",
		label: "BridgeReports.com ID",
		example: [
			7407441
		],
		types: [
		],
		aliases: [
			"UglyBridges.com ID"
		]
	},
	{
		description: "identifier for an artist in Bridgeman images",
		datatype: "external-id",
		id: "P3965",
		label: "Bridgeman artist ID",
		example: [
			1282413,
			3291332
		],
		types: [
		],
		aliases: [
			"Bridgeman ID"
		]
	},
	{
		description: "identifier for a Brilliant.org wiki article",
		datatype: "external-id",
		id: "P6564",
		label: "Brilliant Wiki ID",
		example: [
			10861030,
			467699,
			190035
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for sportsperson in the British Bobsleigh & Skeleton Association (BBSA) database",
		datatype: "external-id",
		id: "P4470",
		label: "British Bobsleigh & Skeleton Association ID",
		example: [
			658596
		],
		types: [
		],
		aliases: [
			"BBSA ID"
		]
	},
	{
		description: "identifier for an individual or business entity listed in the  University of Oxford's Bodleian Libraries' British Book Trade Index database",
		datatype: "external-id",
		id: "P2945",
		label: "British Book Trade Index ID",
		example: [
			725733
		],
		types: [
		],
		aliases: [
			"BBTI ID"
		]
	},
	{
		description: "identifier for an artist, in the catalogue of the British Council",
		datatype: "external-id",
		id: "P2399",
		label: "British Council artist ID",
		example: [
			18389785
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a writer on the British Council website",
		datatype: "external-id",
		id: "P5364",
		label: "British Council writer ID",
		example: [
			7421703,
			190379,
			3023093
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person executed in Britain between 1100 and 1964",
		datatype: "external-id",
		id: "P6167",
		label: "British Executions ID",
		example: [
			338655,
			5362758,
			4968443,
			16827431
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a place, in the British History Online digitisation of the Victoria County History",
		datatype: "external-id",
		id: "P3628",
		label: "British History Online VCH ID",
		example: [
			2256,
			2212576,
			7592600,
			23140
		],
		types: [
		],
		aliases: [
			"VCH"
		]
	},
	{
		description: "nine digit identifier for an edition of a book held by the British Library",
		datatype: "external-id",
		id: "P5199",
		label: "British Library system number",
		example: [
			52230303
		],
		types: [
		],
		aliases: [
			"BL sysnum"
		]
	},
	{
		description: "identifier for a person, organisation, or mythological figure on the British Museum main public website",
		datatype: "external-id",
		id: "P6077",
		label: "British Museum bioID",
		example: [
			5598,
			270920,
			130832
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a object in the British Museum",
		datatype: "external-id",
		id: "P8565",
		label: "British Museum object ID",
		example: [
			2324840,
			1603141,
			5299596,
			748518
		],
		types: [
			"multi-source external identifier",
			"for items about works"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person or institution in the British Museum person-institution thesaurus",
		datatype: "external-id",
		id: "P1711",
		label: "British Museum person or institution ID",
		example: [
			5598,
			11637
		],
		types: [
		],
		aliases: [
			"BM id",
			"BMT id",
			"British Museum person ID",
			"British Museum institution ID",
			"BM person ID",
			"BM institution ID",
			"British Museum person-institution ID"
		]
	},
	{
		description: "identifier for a place in the British Museum thesaurus",
		datatype: "external-id",
		id: "P3633",
		label: "British Museum place ID",
		example: [
			79,
			1382
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the British Museum thesaurus",
		datatype: "external-id",
		id: "P3632",
		label: "British Museum thesaurus ID",
		example: [
			47476,
			4673700,
			11635959
		],
		types: [
		],
		aliases: [
			"British Museum thesauri"
		]
	},
	{
		description: "identifier for an athlete on the British Olympic Association's Team GB website",
		datatype: "external-id",
		id: "P4490",
		label: "British Olympic Association athlete ID",
		example: [
			3109448,
			17465546
		],
		types: [
		],
		aliases: [
			"Team GB athlete ID"
		]
	},
	{
		description: "identifier for a person or company, in the British and Irish Furniture Makers Online (BIFMO) database",
		datatype: "external-id",
		id: "P8638",
		label: "British and Irish Furniture Makers Online ID",
		example: [
			98704226,
			16238981,
			3237793,
			8019728
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier linking Wikidata item to the broadcast parameters for a transmission",
		datatype: "external-id",
		id: "P7576",
		label: "Broadcast Radio Bearer URI",
		example: [
			795598,
			3516431,
			5035608,
			5035608,
			4834852,
			1744646
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for historical Broadway photographers and their subjects",
		datatype: "external-id",
		id: "P7467",
		label: "Broadway Photographs person ID",
		example: [
			13560823,
			5986970,
			7934292
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an article in the online version of Brockhaus Enzyklopädie",
		datatype: "external-id",
		id: "P5019",
		label: "Brockhaus Enzyklopädie online ID",
		example: [
			1,
			205966
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "id of an exhibition in the Brooklyn Museum's \"opencollection\" subwebsite",
		datatype: "external-id",
		id: "P4899",
		label: "Brooklyn Museum Exhibition ID",
		example: [
			49758044
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork or other object on the Brooklyn Museum website",
		datatype: "external-id",
		id: "P4740",
		label: "Brooklyn Museum artwork ID",
		example: [
			19858424,
			18178207
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a bridge, in the Brückenweb database",
		datatype: "external-id",
		id: "P4328",
		label: "Brueckenweb ID",
		example: [
			125006
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person or an organization in the Buddhist Author Authority Database",
		datatype: "external-id",
		id: "P6772",
		label: "Buddhist Author Authority Database ID",
		example: [
			42063,
			17293,
			72390,
			24528991
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a member of the Buenos Aires City Legislature",
		datatype: "external-id",
		id: "P4667",
		label: "Buenos Aires legislator ID",
		example: [
			6277643
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in BugGuide.net",
		datatype: "external-id",
		id: "P2464",
		label: "BugGuide ID",
		example: [
			285029
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an album on Bugs! music site",
		datatype: "external-id",
		id: "P5144",
		label: "Bugs! album ID",
		example: [
			20646648,
			29948806
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on Bugs! music site",
		datatype: "external-id",
		id: "P5145",
		label: "Bugs! artist ID",
		example: [
			6667429,
			26876,
			383541
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "article name on Bulbapedia, a Pokémon encyclopedia",
		datatype: "external-id",
		id: "P4845",
		label: "Bulbapedia article",
		example: [
			26414547,
			26897926,
			308950,
			645494
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Bulbapedia ID"
		]
	},
	{
		description: "identifier of a location in Antarctica in the Bulgarian Antarctic Gazetteer",
		datatype: "external-id",
		id: "P5388",
		label: "Bulgarian Antarctic Gazetteer ID",
		example: [
			55096272,
			55096278,
			55096254
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique identifier for an application used in iOS, iPadOS, macOS, watchOS and tvOS systems",
		datatype: "external-id",
		id: "P7429",
		label: "Bundle ID",
		example: [
			69940813,
			69942818,
			284115
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a member of the 'Bureau des longitudes' between 1795 and 1932",
		datatype: "external-id",
		id: "P7131",
		label: "Bureau des longitudes ID",
		example: [
			974219,
			154356,
			4457291
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an Australian meteorological station issued by the Bureau of Meteorology",
		datatype: "external-id",
		id: "P3796",
		label: "Bureau of Meteorology station ID",
		example: [
			28692248
		],
		types: [
		],
		aliases: [
			"BoM station ID",
			"BoM station number",
			"Bureau of Meteorology station number"
		]
	},
	{
		description: "stock code on Bursa Malaysia",
		datatype: "external-id",
		id: "P7288",
		label: "Bursa Malaysia stock code",
		example: [
			6805531,
			1640639,
			1584297,
			4207443
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a juridical person registered in Estonia",
		datatype: "external-id",
		id: "P6518",
		label: "Business Registry code (Estonia)",
		example: [
			1976140
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a butterfly or moth genus in the UK Natural History Museum's 'Butterflies and Moths of the World' database",
		datatype: "external-id",
		id: "P3060",
		label: "ButMoth ID",
		example: [
			1937176
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "table containing the coefficients of a Runge-Kutta method",
		datatype: "math",
		id: "P8558",
		label: "Butcher tableau",
		example: [
			2736820,
			51846055,
			51879118
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for taxa in the \"Butterflies and Moths of North America\" database",
		datatype: "external-id",
		id: "P3398",
		label: "Butterflies and Moths of North America ID",
		example: [
			13231708,
			59905
		],
		types: [
		],
		aliases: [
			"BAMONA ID",
			"BaMoNA ID"
		]
	},
	{
		description: "Bygdeband is a site containing local history material added by +600 local history communities in Sweden",
		datatype: "external-id",
		id: "P6192",
		label: "Bygdeband ID",
		example: [
			21567631
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person, a journal or an institution on the website of the Bérose online encyclopedia",
		datatype: "external-id",
		id: "P5333",
		label: "Bérose ID",
		example: [
			361365,
			15763539
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"BEROSE International Encyclopaedia of the Histories of Anthropology ID",
			"Bérose - Encyclopédie internationale des histoires de l’anthropologie ID",
			"Berose ID"
		]
	},
	{
		description: "identifier for an organization, on C-SPAN",
		datatype: "external-id",
		id: "P4725",
		label: "C-SPAN organization ID",
		example: [
			66096,
			655286,
			484538
		],
		types: [
		],
		aliases: [
			"CSPAN organization ID"
		]
	},
	{
		description: "identifier for a person's appearances on C-SPAN",
		datatype: "external-id",
		id: "P2190",
		label: "C-SPAN person ID",
		example: [
			7937768,
			463877
		],
		types: [
		],
		aliases: [
			"C-SPAN identifier of a person",
			"CSPAN person ID"
		]
	},
	{
		description: "identifier for a taxon on the Steere Herbarium website",
		datatype: "external-id",
		id: "P6035",
		label: "C.V. Starr Virtual Herbarium ID",
		example: [
			311448,
			15572570,
			57668556
		],
		types: [
		],
		aliases: [
			"Steere Herbarium ID"
		]
	},
	{
		description: "identifier of a video game in the WWW.C64.COM database",
		datatype: "external-id",
		id: "P7852",
		label: "C64.COM ID",
		example: [
			5692802,
			1812308,
			7632176,
			5304691
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID for substance in California Proposition 65 list of chemicals known to cause cancer or reproductive harm",
		datatype: "external-id",
		id: "P7524",
		label: "CA PROP 65 ID",
		example: [
			27888393,
			61457,
			421721
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a subject in CAB Thesaurus",
		datatype: "external-id",
		id: "P8072",
		label: "CAB ID",
		example: [
			15587874,
			933694,
			419107
		],
		types: [
		],
		aliases: [
			"CAB Thesaurus ID"
		]
	},
	{
		description: "player ID of national teams on the Argentine Basketball Confederation website",
		datatype: "external-id",
		id: "P6475",
		label: "CABB player ID",
		example: [
			213132,
			1636795,
			16606161,
			26207334
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a supplier to government agencies",
		datatype: "external-id",
		id: "P5574",
		label: "CAGE code",
		example: [
			16995840
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for authority control per CALIS (China Academic Library & Information System)",
		datatype: "external-id",
		id: "P270",
		label: "CALIS ID",
		example: [
			17790,
			33772
		],
		types: [
		],
		aliases: [
			"CALIS Union Catalog Authorities"
		]
	},
	{
		description: "identifier for an entry on the CALS Encyclopedia of Arkansas website",
		datatype: "external-id",
		id: "P7685",
		label: "CALS Encyclopedia of Arkansas ID",
		example: [
			1999165,
			6324721,
			409975,
			61148
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Encyclopedia of Arkansas ID"
		]
	},
	{
		description: "identifier for authority control managed by the Library of Catalonia. Format: \"a\", 7 digits, \"x\" or digit.",
		datatype: "external-id",
		id: "P1273",
		label: "CANTIC ID",
		example: [
			561147,
			3609164
		],
		types: [
		],
		aliases: [
			"CANTIC",
			"BNC ID",
			"BNC"
		]
	},
	{
		description: "identifier for a chemical substance or compound per Chemical Abstract Service's Registry database",
		datatype: "external-id",
		id: "P231",
		label: "CAS Registry Number",
		example: [
			244408,
			21098900
		],
		types: [
		],
		aliases: [
			"CASRN",
			"CAS Number"
		]
	},
	{
		description: "Identifier in Classifier of administrative-territorial objects of Kazakhstan",
		datatype: "external-id",
		id: "P4838",
		label: "CATO ID",
		example: [
			484706
		],
		types: [
		],
		aliases: [
			"KATO ID"
		]
	},
	{
		description: "identifer for a person in the China Biographical Database",
		datatype: "external-id",
		id: "P497",
		label: "CBDB ID",
		example: [
			334323,
			6101
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "rating in the Indian film rating system",
		datatype: "wikibase-item",
		id: "P6452",
		label: "CBFC rating",
		example: [
			14948561,
			1757288,
			29169280
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a Dutch municipality as defined by Statistics Netherlands (CBS)",
		datatype: "external-id",
		id: "P382",
		label: "CBS municipality code",
		example: [
			9769
		],
		types: [
		],
		aliases: [
			"municipality code (Netherlands)"
		]
	},
	{
		description: "code for schools affiliated to Central Board of Secondary Education",
		datatype: "external-id",
		id: "P7568",
		label: "CBSE affiliation number",
		example: [
			23022948,
			7206620,
			5766370
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "Collective Catalog of Bibliographic Authorities of Chile ID",
		datatype: "external-id",
		id: "P1890",
		label: "CCAB ID",
		example: [
			320,
			39803,
			15435037
		],
		types: [
		],
		aliases: [
			"Collective Catalog of Bibliographic Authorities of Chile ID"
		]
	},
	{
		description: "authority identifier in the Catálogo Colectivo de la Red de Bibliotecas de los Archivos Estatales y del CIDA",
		datatype: "external-id",
		id: "P6493",
		label: "CCBAE publication ID",
		example: [
			18921075,
			8248654,
			25909441
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a single crystal structure per the Cambridge Crystallographic Data Centre (CCDC)",
		datatype: "external-id",
		id: "P6852",
		label: "CCDC Number",
		example: [
			419626,
			2535469,
			7843940
		],
		types: [
			"multi-source external identifier"
		],
		aliases: [
			"CCDC Id"
		]
	},
	{
		description: "identifier for an author on the catalogue of the \"Centre de documentation et d'archives\" of the \"Parc national des Cévennes\"",
		datatype: "external-id",
		id: "P8215",
		label: "CDAPNC author ID",
		example: [
			92401737,
			40954282,
			62486315
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID in UCI chemical database",
		datatype: "external-id",
		id: "P2072",
		label: "CDB Chemical ID",
		example: [
			223107,
			9357475
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a chemical compound in the Collaborative Drug Discovery database",
		datatype: "external-id",
		id: "P2086",
		label: "CDD Public ID",
		example: [
			9357475
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID for the Italian victims of the Nazi Holocaust, from the database of CDEC - Italian center for Jewish contemporary documentation",
		datatype: "external-id",
		id: "P6636",
		label: "CDEC ID",
		example: [
			61041578,
			16268590,
			824780,
			31763034
		],
		types: [
		],
		aliases: [
			"Italian center for Jewish contemporary documentation ID"
		]
	},
	{
		description: "unique identifier of an object in the Cuneiform Digital Library Initiative",
		datatype: "external-id",
		id: "P2474",
		label: "CDLI ID",
		example: [
			4868081,
			279559
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a musician in the Centre de documentation de la musique contemporaine database",
		datatype: "external-id",
		id: "P5272",
		label: "CDMC musician ID",
		example: [
			5125291,
			3165266
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "code issued by the College Board for K-12 schools",
		datatype: "external-id",
		id: "P7801",
		label: "CEEB K-12 school code",
		example: [
			4971932,
			4785629,
			6455569
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"CEEB code",
			"K–12"
		]
	},
	{
		description: "identifier for European legal texts in EUR-Lex database",
		datatype: "external-id",
		id: "P476",
		label: "CELEX number",
		example: [
			52843,
			5412779
		],
		types: [
		],
		aliases: [
			"CELEX code"
		]
	},
	{
		description: "identifier for people who were killed or went missing during the Brazilian military dictatorship (1964-1985)",
		datatype: "external-id",
		id: "P6692",
		label: "CEMDP ID",
		example: [
			17413797,
			18237983,
			4313901
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Consortium of European Research Libraries Thesaurus",
		datatype: "external-id",
		id: "P1871",
		label: "CERL Thesaurus ID",
		example: [
			18945790
		],
		types: [
		],
		aliases: [
			"CERL identifier",
			"CERL ID",
			"CT ID"
		]
	},
	{
		description: "Japanese video game rating system - see talk page for appropriate values",
		datatype: "wikibase-item",
		id: "P853",
		label: "CERO rating",
		example: [
			11168,
			1153708,
			214232,
			308961,
			40166
		],
		types: [
		],
		aliases: [
			"Computer Entertainment Rating Organization rating"
		]
	},
	{
		description: "identifier for a person in the CESAR database of French theatre of the seventeenth and eighteenth centuries",
		datatype: "external-id",
		id: "P2340",
		label: "CESAR person ID",
		example: [
			3275311,
			267962
		],
		types: [
		],
		aliases: [
			"CESAR ID"
		]
	},
	{
		description: "Council of Europe treaty number",
		datatype: "external-id",
		id: "P3968",
		label: "CETS number",
		example: [
			1378142
		],
		types: [
			"for items about works",
			"representing a unique identifier"
		],
		aliases: [
			"CETS no."
		]
	},
	{
		description: "identifier for a player on the European Volleyball Confederation's website",
		datatype: "external-id",
		id: "P3725",
		label: "CEV player ID",
		example: [
			3298769,
			28659502
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier(s) for a geographical feature contained in the Canadian Geographical Names Data Base (CGNDB)",
		datatype: "external-id",
		id: "P821",
		label: "CGNDB Unique ID",
		example: [
			156006,
			794549
		],
		types: [
		],
		aliases: [
			"CGNDB",
			"CGNDB Unique Identifier",
			"CGNDB UID",
			"GNBC Code",
			"Geographical Names Board of Canada ID",
			"Canadian Geographical Names Board ID",
			"CGNDB-ID"
		]
	},
	{
		description: "identifier for politician on CHESNO site",
		datatype: "external-id",
		id: "P7145",
		label: "CHESNO politician ID",
		example: [
			12169545,
			20067554,
			12119499
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a historical administrative region of China in the China Historical Geographic Information System (CHGIS)",
		datatype: "external-id",
		id: "P4711",
		label: "CHGIS ID",
		example: [
			10883119
		],
		types: [
		],
		aliases: [
			"China Historical Geographic Information System ID"
		]
	},
	{
		description: "Canadian movie classification",
		datatype: "wikibase-item",
		id: "P6657",
		label: "CHVRS Classification",
		example: [
			5552455,
			62393177,
			205028
		],
		types: [
		],
		aliases: [
			"Canadian Home Video Rating System Classification"
		]
	},
	{
		description: "identifier for an author on the 'Centre pour le livre, l'image et la culture numérique'﻿ website",
		datatype: "external-id",
		id: "P5547",
		label: "CICLIC author ID",
		example: [
			3292341,
			2829883,
			3295797
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "property for Bosnian-Herzegovinian politicians biographies and property status given by Centar za istraživačko novinarstvo (CIN) website",
		datatype: "external-id",
		id: "P6910",
		label: "CIN ID",
		example: [
			8074419,
			335688,
			6996487
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a food category in the French CIQUAL 2017 nutritional database",
		datatype: "external-id",
		id: "P4696",
		label: "CIQUAL2017 ID",
		example: [
			348947
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for ancient authors in the CIRIS database",
		datatype: "external-id",
		id: "P8065",
		label: "CIRIS author ID",
		example: [
			305267,
			719224,
			580565
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "code for schools affiliated to the Council for the Indian School Certificate Examinations",
		datatype: "external-id",
		id: "P7565",
		label: "CISCE school code",
		example: [
			4808698,
			7397188,
			6479812
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "appendix of a taxon according to CITES convention",
		datatype: "wikibase-item",
		label: "CITES Appendix",
		id: "P7603",
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon in the Species+ database (CITES)",
		datatype: "external-id",
		id: "P2040",
		label: "CITES Species+ ID",
		example: [
			2384229
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "page for the country at the CIVICUS Monitor",
		datatype: "external-id",
		id: "P5180",
		label: "CIVICUS Monitor country entry",
		example: [
			155
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier used in the CIViC database to identify specific variant",
		datatype: "external-id",
		id: "P3329",
		label: "CIViC variant ID",
		example: [
			21851559
		],
		types: [
			"representing a unique identifier",
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "identifier for journal articles in China National Knowledge Infrastructure (CNKI)'s China Journal Full-text Database (CJFD)",
		datatype: "external-id",
		id: "P6769",
		label: "CJFD journal article ID",
		example: [
			63449394,
			63445767,
			63459841
		],
		types: [
		],
		aliases: [
			"CJFD ID",
			"CNKI journal article ID"
		]
	},
	{
		description: "equivalent forms of Han characters used in different regions or writing systems",
		datatype: "wikibase-item",
		id: "P5475",
		label: "CJKV variant character",
		example: [
			54552723,
			55634770,
			55634770,
			3594925
		],
		types: [
			"for items about languages"
		],
		aliases: [
			"variant Chinese character",
			"variant character",
			"simplified character",
			"traditional character",
			"Z-variant"
		]
	},
	{
		description: "identifier from database about women visual artists",
		datatype: "external-id",
		id: "P1615",
		label: "CLARA-ID",
		example: [
			6781930,
			298213
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the Clay Mathematics Institute website",
		datatype: "external-id",
		id: "P5948",
		label: "CMI person ID",
		example: [
			715043,
			14942107,
			23721911
		],
		types: [
		],
		aliases: [
			"Clay Mathematics Institute ID"
		]
	},
	{
		description: "identifier for a taxon on the 'Convention on the Conservation of Migratory Species of Wild Animals' website",
		datatype: "external-id",
		id: "P6033",
		label: "CMS ID",
		example: [
			629227,
			3280996,
			61857
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a newspaper or magazine issued by State Administration of Press, Publication, Radio, Film and Television of the People’s Republic of China",
		datatype: "external-id",
		id: "P1209",
		label: "CN",
		example: [
			14511704
		],
		types: [
		],
		aliases: [
			"GAPP Identifier",
			"SAPPRFT Identifier",
			"SAPPRFT ID"
		]
	},
	{
		description: "identifier for an artist on the Centre national des arts plastiques website",
		datatype: "external-id",
		id: "P5403",
		label: "CNAP artist ID",
		example: [
			2380981,
			26758096,
			28497839
		],
		types: [
		],
		aliases: [
			"CNAP ID"
		]
	},
	{
		description: "authorization number to operate a movie theater in France",
		datatype: "external-id",
		id: "P3458",
		label: "CNC authorization number",
		example: [
			1809902,
			3273026,
			3547187
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "category assigned to a film by the Board of Film Classification (CNC) which what audiences may view it in France",
		datatype: "wikibase-item",
		id: "P2758",
		label: "CNC film rating (France)",
		example: [
			190050,
			165512,
			842720
		],
		types: [
		],
		aliases: [
			"Commission de classification des œuvres cinématographiques film rating",
			"film classification category (CNC)",
			"CNC film rating",
			"CNC movie rating",
			"CNC rating"
		]
	},
	{
		description: "rating of a movie in the Romanian content rating system",
		datatype: "wikibase-item",
		id: "P3402",
		label: "CNC film rating (Romania)",
		example: [
			23762934
		],
		types: [
		],
		aliases: [
			"CNC film rating",
			"CNC movie rating",
			"CNC rating"
		]
	},
	{
		description: "identifier for an author on the Centre national du livre website",
		datatype: "external-id",
		id: "P5637",
		label: "CNL author ID",
		example: [
			264283,
			9612519,
			470557
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Spanish classification of occupations CNO-11 maintained by the Spanish INE (Instituto Nacional de Estadística)",
		datatype: "external-id",
		id: "P1022",
		label: "CNO-11 occupation code",
		example: [
			182436
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identification number issued to Brazilian companies by the Secretariat of the Federal Revenue of Brazil",
		datatype: "external-id",
		id: "P6204",
		label: "CNPJ",
		example: [
			10280251,
			3411543,
			10371188,
			10302895
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the California Native Plant Society database",
		datatype: "external-id",
		id: "P4194",
		label: "CNPS ID",
		example: [
			521327
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an academic research group issued by the CNRS",
		datatype: "external-id",
		id: "P4550",
		label: "CNRS research group ID",
		example: [
			3214478,
			30262390,
			88514559
		],
		types: [
		],
		aliases: [
			"CNRS UMR number",
			"UMR ID"
		]
	},
	{
		description: "page on the Centre national de la recherche scientifique website presenting a person who has received certain prizes or medals",
		datatype: "external-id",
		id: "P5552",
		label: "CNRS talents page",
		example: [
			33133919,
			1303301,
			468049
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the Centre national du théâtre website",
		datatype: "external-id",
		id: "P5615",
		label: "CNT ID",
		example: [
			20807816,
			19843734,
			3198262
		],
		types: [
		],
		aliases: [
			"Centre national du théâtre ID"
		]
	},
	{
		description: "identifier for people who were killed or went missing during the Brazilian military dictatorship (1964-1985) in the São Paulo State compiled by the São Paulo State Truth Commission",
		datatype: "external-id",
		id: "P6690",
		label: "CNV-SP ID",
		example: [
			4313901,
			18237983,
			17413797
		],
		types: [
		],
		aliases: [
			"Comissão da Verdade do Estado de São Paulo ID"
		]
	},
	{
		description: "identifier of a person that has built or projected relevant buildings or structures of the city of Madrid included in the Official Architects' Association of Madrid (COAM) database",
		datatype: "external-id",
		id: "P4488",
		label: "COAM architect ID",
		example: [
			8201368,
			26882307
		],
		types: [
		],
		aliases: [
			"COAM ID"
		]
	},
	{
		description: "identifier of a building or structure of the city of Madrid in the Official Architects' Association of Madrid (COAM) database",
		datatype: "external-id",
		id: "P2917",
		label: "COAM structure ID",
		example: [
			1364394,
			849711,
			2919969,
			6974501,
			7691967
		],
		types: [
		],
		aliases: [
			"COAM inm ID",
			"Official Architects' Association of Madrid structure ID",
			"COAM building ID"
		]
	},
	{
		description: "identifier in CODECS database for Celtic studies",
		datatype: "external-id",
		id: "P4165",
		label: "CODECS ID",
		example: [
			3402390
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "CODEN bibliographic code",
		datatype: "external-id",
		id: "P1159",
		label: "CODEN",
		example: [
			32246,
			135122
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon, issued by the National Commission for the Knowledge and Use of Biodiversity (aka CONABIO), a Federal Agency of the Mexican Government",
		datatype: "external-id",
		id: "P4902",
		label: "CONABIO ID",
		example: [
			1606492
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Conselho de Defesa do Patrimônio Histórico identifier for monuments in São Paulo, Brazil",
		datatype: "external-id",
		id: "P5525",
		label: "CONDEPHAAT ID",
		example: [
			8341735,
			868441,
			28677842
		],
		types: [
		],
		aliases: [
			"Council for the Defense of Historical, Archaeological, Artistic and Tourist Heritage ID"
		]
	},
	{
		description: "ID of an Italian sportperson that was awarded a sports award by the Italian Olympic Committe",
		datatype: "external-id",
		id: "P8161",
		label: "CONI honoured ID",
		example: [
			253450,
			639810,
			624
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a researcher, scholar or support personnel at National Scientific and Technical Research Council (Argentina)",
		datatype: "external-id",
		id: "P3900",
		label: "CONICET person ID",
		example: [
			8470945
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the National and University Library, Ljubljana database",
		datatype: "external-id",
		id: "P1280",
		label: "CONOR ID",
		example: [
			1031,
			12785612,
			4956650
		],
		types: [
		],
		aliases: [
			"CONOR.SI",
			"CONOR identifier",
			"National and University Library, Ljubljana id",
			"COBISS.SI",
			"NUK id"
		]
	},
	{
		description: "identifier for a species in the COOL (Cercopoidea Organised On Line) database",
		datatype: "external-id",
		id: "P6408",
		label: "COOL species ID",
		example: [
			1543506,
			10457717,
			10579866
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique identifier for research projects funded by the European Commission, in the CORDIS database.",
		datatype: "external-id",
		id: "P3400",
		label: "CORDIS Project ID",
		example: [
			25203447,
			1640362,
			21755493,
			25106053
		],
		types: [
		],
		aliases: [
			"EU project ID",
			"EU PID"
		]
	},
	{
		description: "ID of an article in CORE (Connecting Repositories)",
		datatype: "external-id",
		id: "P6409",
		label: "CORE ID",
		example: [
			57405293,
			26236257,
			26707522
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Connecting Repositories ID"
		]
	},
	{
		description: "international satellite designation, administered by the UN Committee on Space Research (COSPAR) and the US National Space Science Data Center (NSSDC)",
		datatype: "external-id",
		id: "P247",
		label: "COSPAR ID",
		example: [
			152800
		],
		types: [
		],
		aliases: [
			"International Designator",
			"COSPAR designation",
			"NSSDC ID"
		]
	},
	{
		description: "identifier for a trail on the Colorado Trail Explorer website",
		datatype: "external-id",
		id: "P8113",
		label: "COTREX trail ID",
		example: [
			66092328,
			65953693,
			87769652
		],
		types: [
		],
		aliases: [
			"Colorado Trail Explorer ID"
		]
	},
	{
		description: "COURAGE (“Cultural Opposition – Understanding the CultuRal HeritAGE of Dissent in the Former Socialist Countries”) is a three-year international research project funded by Horizon 2020, the EU Framework Programme for Research and Innovation",
		datatype: "external-id",
		id: "P7037",
		label: "COURAGE ID",
		example: [
			11816037,
			534403,
			460839
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of an article in the WHO COVID-19 Global literature on coronavirus disease database",
		datatype: "external-id",
		id: "P8150",
		label: "COVIDWHO ID",
		example: [
			82838328,
			82840590,
			86729469,
			86730001
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"WHO COVID-19 Global literature on coronavirus disease database identifier",
			"COVIDWHO",
			"covidence #"
		]
	},
	{
		description: "ID of a author in CPAN",
		datatype: "external-id",
		id: "P8124",
		label: "CPAN author ID",
		example: [
			87056831,
			92597,
			15025
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "name of a project in CPAN",
		datatype: "external-id",
		id: "P5779",
		label: "CPAN project",
		example: [
			458025,
			5010968,
			5204401
		],
		types: [
			"representing a unique identifier",
			"for software"
		],
		aliases: [
			"CPAN package",
			"package, CPAN"
		]
	},
	{
		description: "identifier in the CPC-Power database of Amstrad CPC videogames",
		datatype: "external-id",
		id: "P4847",
		label: "CPC-Power ID",
		example: [
			1182594,
			2121419
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"CPC-Power identifier"
		]
	},
	{
		description: "identifier in the CPCRulez database of Amstrad CPC videogames",
		datatype: "external-id",
		id: "P5780",
		label: "CPCRulez ID",
		example: [
			849328,
			24817849,
			3495141
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"cpcrulez ID",
			"CPC Rulez ID"
		]
	},
	{
		description: "identifier in the CPCWiki",
		datatype: "external-id",
		id: "P7824",
		label: "CPCWiki ID",
		example: [
			4748798,
			4966176,
			20874880,
			4748865,
			3491702,
			653222,
			62578291,
			62594230
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a work or person, in the Choral Public Domain Library",
		datatype: "external-id",
		id: "P2000",
		label: "CPDL ID",
		example: [
			1033824,
			98593434
		],
		types: [
		],
		aliases: [
			"ChoralWiki ID",
			"Choral Public Domain Library ID"
		]
	},
	{
		description: "identifier for a bibliographic record in the Center for Research and Documentation of Contemporary History of Brazil (CPDOC)",
		datatype: "external-id",
		id: "P4660",
		label: "CPDOC ID",
		example: [
			1797502
		],
		types: [
		],
		aliases: [
			"Centro de Pesquisa e Documentação de História Contemporânea do Brasil ID"
		]
	},
	{
		description: "ID issued by the French \"Commission paritaire des publications et des agences de presse\" for a registered periodical",
		datatype: "external-id",
		id: "P5968",
		label: "CPPAP ID",
		example: [
			2817930,
			387273,
			262581,
			3148897,
			3156632,
			17632203,
			85788885,
			1798898
		],
		types: [
		],
		aliases: [
			"CPPAP No."
		]
	},
	{
		description: "central processing unit found within the subject item",
		datatype: "wikibase-item",
		id: "P880",
		label: "CPU",
		example: [
			99775,
			454390
		],
		types: [
		],
		aliases: [
			"central processing unit",
			"processor"
		]
	},
	{
		description: "x86/x86-64 processor type information returned by the CPUID instruction into the EAX register",
		datatype: "external-id",
		id: "P7289",
		label: "CPUID",
		example: [
			65584693,
			28972984,
			28972895
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"CPUID Fn0000_0001_EAX",
			"CPUID Fn8000_0001_EAX",
			"CPUID, INPUT EAX = 01H"
		]
	},
	{
		description: "identifier for a female cyclist at cqranking.com",
		datatype: "external-id",
		id: "P2709",
		label: "CQ Ranking female cyclist ID",
		example: [
			933927
		],
		types: [
		],
		aliases: [
			"CQR female cyclist ID",
			"Cycling Quotient female cyclist ID"
		]
	},
	{
		description: "identifier for a male cyclist at cqranking.com",
		datatype: "external-id",
		id: "P1541",
		label: "CQ Ranking male cyclist ID",
		example: [
			2172
		],
		types: [
		],
		aliases: [
			"CQR male cyclist ID",
			"Cycling Quotient male cyclist ID"
		]
	},
	{
		description: "identifier for a men's cycling race at cqranking.com",
		datatype: "external-id",
		id: "P2648",
		label: "CQ Ranking men's race ID",
		example: [
			18710420
		],
		types: [
		],
		aliases: [
			"CQR men's race ID",
			"Cycling Quotient men's race ID"
		]
	},
	{
		description: "URL for a men's cycling team at cqranking.com",
		datatype: "url",
		id: "P2649",
		label: "CQ Ranking men's team URL",
		example: [
			18746658
		],
		types: [
		],
		aliases: [
			"CQR men's team URL",
			"Cycling Quotient men's team URL"
		]
	},
	{
		description: "identifier for a women's cycling race at cqranking.com",
		datatype: "external-id",
		id: "P2708",
		label: "CQ Ranking women's race ID",
		example: [
			20681024
		],
		types: [
		],
		aliases: [
			"CQR women's race ID",
			"Cycling Quotient women's race ID"
		]
	},
	{
		description: "name of a project in CRAN",
		datatype: "external-id",
		id: "P5565",
		label: "CRAN project",
		example: [
			4798127,
			7276692,
			28957051
		],
		types: [
			"for software"
		],
		aliases: [
			"CRAN package",
			"package, CRAN"
		]
	},
	{
		description: "unique identifier for Australian education providers assigned by the Commonwealth Register of Institutions and Courses for Overseas Students (CRICOS)",
		datatype: "external-id",
		id: "P2651",
		label: "CRICOS Provider Code",
		example: [
			598841
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID in the database for Norwegian scientists",
		datatype: "external-id",
		id: "P2287",
		label: "CRIStin ID",
		example: [
			5208426
		],
		types: [
		],
		aliases: [
			"Norwegian Scientific Index ID",
			"NVI"
		]
	},
	{
		description: "identifier for a lynching victim in the CSDE Lynching Database",
		datatype: "external-id",
		id: "P5563",
		label: "CSDE Lynching Database ID",
		example: [
			5169977,
			4772327,
			15997357
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for person on the website of CSKA Moscow",
		datatype: "external-id",
		id: "P6613",
		label: "CSKA person ID",
		example: [
			7911484,
			4344088,
			235058
		],
		types: [
			"related to sport"
		],
		aliases: [
		]
	},
	{
		description: "keyword that refers to the element, according to CSS standard",
		datatype: "string",
		id: "P8112",
		label: "CSS color keyword",
		example: [
			84237818,
			843607,
			39338
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a building as used on the CTBUH's www.skyscrapercenter.com",
		datatype: "external-id",
		id: "P1305",
		label: "CTBUH Skyscraper Center building ID",
		example: [
			1509747,
			1510431
		],
		types: [
		],
		aliases: [
			"CTBUH ID",
			"Skyscraper Center ID"
		]
	},
	{
		description: "identifier for a building complex as used on the CTBUH's www.skyscrapercenter.com",
		datatype: "external-id",
		id: "P2762",
		label: "CTBUH Skyscraper Center building complex ID",
		example: [
			15246,
			5877175
		],
		types: [
		],
		aliases: [
			"Skyscraper Center building complex ID"
		]
	},
	{
		description: "identifier for an author on the website of the Comité des travaux historiques et scientifiques",
		datatype: "external-id",
		id: "P8251",
		label: "CTHS author ID",
		example: [
			80355276,
			80103374,
			2926731
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the directory of French learned societies",
		datatype: "external-id",
		id: "P2383",
		label: "CTHS person ID",
		example: [
			3048,
			94766673
		],
		types: [
		],
		aliases: [
			"La France savante ID"
		]
	},
	{
		description: "identifier for a publication on the CTHS website (ENC)",
		datatype: "external-id",
		id: "P8553",
		label: "CTHS publication ID",
		example: [
			96482279,
			3428658
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of organization of Comité des travaux historiques et scientifiques",
		datatype: "external-id",
		id: "P1961",
		label: "CTHS society ID",
		example: [
			161806,
			2822394
		],
		types: [
		],
		aliases: [
			"identifier of CTHS"
		]
	},
	{
		description: "identifier for a participants of 2002 FIFA World Cup at CUP2002.RU site",
		datatype: "external-id",
		id: "P7112",
		label: "CUP2002.RU person ID",
		example: [
			310544,
			551381,
			485885
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for regions, provinces, and municipalities in Chile as defined by Ministerio de Bienes Nacionales",
		datatype: "external-id",
		id: "P6929",
		label: "CUT code",
		example: [
			2114,
			251456,
			2217
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "unique identifier for a business in Denmark's Central Business Register (CVR), the official database of Danish businesses.",
		datatype: "external-id",
		id: "P1059",
		label: "CVR number",
		example: [
			18559647,
			12308319
		],
		types: [
		],
		aliases: [
			"Central Business Register number"
		]
	},
	{
		description: "unique identifier for a persons (owners/directors) in Denmark's Central Business Register (CVR), the official database of Danish businesses.",
		datatype: "external-id",
		id: "P7972",
		label: "CVR person ID",
		example: [
			57652,
			14917285,
			182397
		],
		types: [
			"for items about people",
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a writer on the Crime Writers' Association website",
		datatype: "external-id",
		id: "P5747",
		label: "CWA writer ID",
		example: [
			7368303,
			19518078,
			3812968
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a software weakness type identified in the Common Weakness Enumeration (CWE) list",
		datatype: "external-id",
		id: "P3624",
		label: "CWE ID",
		example: [
			19423
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Common Weakness Enumeration ID"
		]
	},
	{
		description: "identifier for a cemetery, churchyard, or memorial, in the online database of Commonwealth War Graves Commission",
		datatype: "external-id",
		id: "P1920",
		label: "CWGC burial ground ID",
		example: [
			7594339
		],
		types: [
		],
		aliases: [
			"Commonwealth War Graves Commission burial ground identifier",
			"CWGC burial ground ID",
			"CWGC burial ID",
			"Commonwealth War Graves Commission burial ground ID",
			"CWGC memorial ID"
		]
	},
	{
		description: "identifier for a person, in the online database of Commonwealth War Graves Commission",
		datatype: "external-id",
		id: "P1908",
		label: "CWGC person ID",
		example: [
			6130229
		],
		types: [
		],
		aliases: [
			"CWGC person identifier",
			"Commonwealth War Graves Commission person identifier",
			"Commonwealth War Graves Commission person ID"
		]
	},
	{
		description: "identifier for listed buildings in Wales",
		datatype: "external-id",
		id: "P1459",
		label: "Cadw Building ID",
		example: [
			17737810
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a scheduled monument in Wales",
		datatype: "external-id",
		id: "P3007",
		label: "Cadw Monument ID",
		example: [
			24116880
		],
		types: [
		],
		aliases: [
			"scheduled monument ID Wales",
			"Wales scheduled monument ID",
			"Welsh scheduled monument ID"
		]
	},
	{
		description: "identifier for a professional wrestling tag team at www.cagematch.net",
		datatype: "external-id",
		id: "P2939",
		label: "CageMatch tag team ID",
		example: [
			20900198
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a professional wrestling performer at www.cagematch.net",
		datatype: "external-id",
		id: "P2728",
		label: "CageMatch worker ID",
		example: [
			44176
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a professional wrestling stable at CageMatch.net",
		datatype: "external-id",
		id: "P3042",
		label: "CageMatch wrestling stable ID",
		example: [
			247125
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author in Cairn, an online library of French-language scholarly journals",
		datatype: "external-id",
		id: "P4369",
		label: "Cairn author ID",
		example: [
			40118171,
			3350899
		],
		types: [
		],
		aliases: [
			"Cairn.info author ID",
			"Cairn"
		]
	},
	{
		description: "identifier for a journal or an article in Cairn, an online library of French-language scholarly journals",
		datatype: "external-id",
		id: "P4700",
		label: "Cairn publication ID",
		example: [
			2823586,
			2823791,
			88883506
		],
		types: [
		],
		aliases: [
			"Cairn journal ID",
			"Cairn article ID"
		]
	},
	{
		description: "identifier for a species on the California Invasive Plant Council website",
		datatype: "external-id",
		id: "P6176",
		label: "Cal-IPC ID",
		example: [
			161568,
			158413,
			27164
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon in Calflora",
		datatype: "external-id",
		id: "P3420",
		label: "Calflora ID",
		example: [
			638217
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a point of interest on the website of the Office of Historic Preservation of California",
		datatype: "external-id",
		id: "P6012",
		label: "California Office of Historic Preservation ID",
		example: [
			5031298,
			4272608,
			57601177
		],
		types: [
		],
		aliases: [
			"Cal OHP ID"
		]
	},
	{
		description: "identifier for an athlete on the California Sports Hall of Fame website",
		datatype: "external-id",
		id: "P4507",
		label: "California Sports Hall of Fame athlete ID",
		example: [
			235254,
			52656
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Cambridge Alumni Database/Alumni Cantabrigienses (ACAD)",
		datatype: "external-id",
		id: "P1599",
		label: "Cambridge Alumni Database ID",
		example: [
			45546,
			936766
		],
		types: [
		],
		aliases: [
			"ACAD",
			"Venn"
		]
	},
	{
		description: "identifier for an article in the Cambridge Encyclopedia of Anthropology",
		datatype: "external-id",
		id: "P7889",
		label: "Cambridge Encyclopedia of Anthropology ID",
		example: [
			26841,
			12131,
			336
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"CEA ID"
		]
	},
	{
		description: "identifier for people on Cameo",
		datatype: "external-id",
		id: "P6908",
		label: "Cameo ID",
		example: [
			356541,
			221464,
			352733,
			13938,
			205435
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a camera, on the Camera Decision website",
		datatype: "external-id",
		id: "P4487",
		label: "Camera Decision ID",
		example: [
			585275,
			18392303
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a place on the Campendium website",
		datatype: "external-id",
		id: "P6842",
		label: "Campendium ID",
		example: [
			5194696,
			63438477,
			63558355
		],
		types: [
		],
		aliases: [
			"Campendium.com ID"
		]
	},
	{
		description: "identifier of a video game in the database of Can You Run it?",
		datatype: "external-id",
		id: "P7909",
		label: "Can You Run it ID",
		example: [
			27438121,
			24807230,
			218568,
			837923,
			741244
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for decisions of Canadian court cases",
		datatype: "external-id",
		id: "P6749",
		label: "CanLII ID",
		example: [
			3406496,
			19876915,
			7307146
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Canadian Legal Information System ID"
		]
	},
	{
		description: "identifier for an athlete on the Canada Games website",
		datatype: "external-id",
		id: "P4555",
		label: "Canada Games athlete ID",
		example: [
			5515953,
			441217
		],
		types: [
		],
		aliases: [
			"Canada Games ID"
		]
	},
	{
		description: "identifier for an athlete on the Canada's Sports Hall of Fame webiste",
		datatype: "external-id",
		id: "P4398",
		label: "Canada's Sports Hall of Fame athlete ID",
		example: [
			445612,
			2077801
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person at the CanadaSoccer.com",
		datatype: "external-id",
		id: "P7459",
		label: "CanadaSoccer.com person ID",
		example: [
			362857,
			2071001,
			505836
		],
		types: [
		],
		aliases: [
			"Canada Soccer player ID",
			"CanadaSoccer.com player ID",
			"Canada Soccer person ID"
		]
	},
	{
		description: "identifier for an inductee on the Canadian Baseball Hall of Fame website",
		datatype: "external-id",
		id: "P4462",
		label: "Canadian Baseball Hall of Fame inductee ID",
		example: [
			1134401,
			840927
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a Canadian lighthouse or beacon in the Canadian Coast Guard List of Lights, Buoys and Fog Signals",
		datatype: "external-id",
		id: "P3920",
		label: "Canadian Coastguard Lighthouse ID",
		example: [
			3378454
		],
		types: [
		],
		aliases: [
			"CCG ID"
		]
	},
	{
		description: "identifier for articles in the Canadian Encyclopedia",
		datatype: "external-id",
		id: "P5395",
		label: "Canadian Encyclopedia article ID",
		example: [
			147849,
			188574,
			35301
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a protected area of Canada used by the Canadian Environmental Sustainability Indicators",
		datatype: "external-id",
		id: "P3412",
		label: "Canadian Environmental Sustainability Indicators ID (Protected areas)",
		example: [
			1543478,
			41858
		],
		types: [
		],
		aliases: [
			"Protected areas of Canada ID"
		]
	},
	{
		description: "identifier for a player on the Canadian Football League website",
		datatype: "external-id",
		id: "P8321",
		label: "Canadian Football League player ID",
		example: [
			20666343,
			4757239
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a Canadian athlete at Olympic.ca, the official website of the Canadian Olympic Committee",
		datatype: "external-id",
		id: "P4054",
		label: "Canadian Olympic Committee athlete ID",
		example: [
			7827488,
			438695,
			5230766
		],
		types: [
		],
		aliases: [
			"Team Canada athlete ID",
			"COC athlete ID"
		]
	},
	{
		description: "identifier in the Canadian Register of Historic Places",
		datatype: "external-id",
		id: "P477",
		label: "Canadian Register of Historic Places ID",
		example: [
			3077289
		],
		types: [
		],
		aliases: [
			"Canadian Historic Places identifier"
		]
	},
	{
		description: "identifier for an inductee on the Canadian Ski Hall of Fame website",
		datatype: "external-id",
		id: "P4463",
		label: "Canadian Ski Hall of Fame inductee ID",
		example: [
			1684883,
			1147403
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the artist database of Canadian Women Artists History Initiative",
		datatype: "external-id",
		id: "P8631",
		label: "Canadian Women Artists History Initiative ID",
		example: [
			28957217,
			29032056
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "obsolete identifier for authority control per the Library and Archives Canada. Format: 4 digits + 1 letter + 4 digits + optional F",
		datatype: "external-id",
		id: "P1670",
		label: "Canadiana Authorities ID",
		example: [
			5362452,
			559409
		],
		types: [
		],
		aliases: [
			"Canadiana Authorities",
			"Canadiana Authority Control Number",
			"Library and Archives Canada ID",
			"Library and Archives Canada identifier",
			"LAC ID",
			"Canadian Authority Control Number",
			"LACNAF ID‏",
			"Library and Archives Canada Name Authorities File ID"
		]
	},
	{
		description: "new ID used by Canadiana. Format: \"ncf\" followed by 8 digits",
		datatype: "external-id",
		id: "P8179",
		label: "Canadiana NCF ID",
		example: [
			42,
			233,
			180865
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"NCF ID",
			"CAOONL"
		]
	},
	{
		description: "identifier of an academician on Canal Académie's website",
		datatype: "external-id",
		id: "P5631",
		label: "Canal Académie ID",
		example: [
			3035010,
			207958,
			265104
		],
		types: [
		],
		aliases: [
			"Canalacadémie"
		]
	},
	{
		description: "ID of a channel on Canal-U, the online video library of French Higher Education",
		datatype: "external-id",
		id: "P4699",
		label: "Canal-U channel ID",
		example: [
			838691,
			273631,
			202660
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person on Canal-U",
		datatype: "external-id",
		id: "P5243",
		label: "Canal-U person ID",
		example: [
			42718729,
			18350948,
			16540118,
			3311134
		],
		types: [
		],
		aliases: [
			"CANALU person ID"
		]
	},
	{
		description: "identifier for a feature on or near a British canal, in the CanalPlan AC database",
		datatype: "external-id",
		id: "P6017",
		label: "CanalPlan AC place ID",
		example: [
			26527577,
			48159,
			1659434
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "the cangjie input code for the character",
		datatype: "string",
		id: "P5519",
		label: "Cangjie input",
		example: [
			3595029,
			3594965,
			3594998
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Royal Commission on the Ancient and Historical Monuments of Scotland's Canmore database",
		datatype: "external-id",
		id: "P718",
		label: "Canmore ID",
		example: [
			57803,
			5228156
		],
		types: [
		],
		aliases: [
			"RCAHMS"
		]
	},
	{
		description: "Identifier for a type of boat or ship or other maritime craft in the Canmore maritime thesaurus",
		datatype: "external-id",
		id: "P7906",
		label: "Canmore maritime-type ID",
		example: [
			189418,
			1153376,
			776704
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier for a heritage site-type in the Canmore thesaurus",
		datatype: "external-id",
		id: "P7922",
		label: "Canmore monument-type ID",
		example: [
			91312,
			82137,
			16970
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier for an archaeological object-type in the Canmore thesaurus",
		datatype: "external-id",
		id: "P7907",
		label: "Canmore object-type ID",
		example: [
			30113226,
			44475,
			1135567
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the online database Carl-Maria-von-Weber-Gesamtausgabe (WeGA)",
		datatype: "external-id",
		id: "P8589",
		label: "Carl-Maria-von-Weber-Gesamtausgabe ID",
		example: [
			1017,
			94802019,
			76302663
		],
		types: [
		],
		aliases: [
			"WeGA ID"
		]
	},
	{
		description: "classification of colleges and universities in the United States",
		datatype: "wikibase-item",
		id: "P2643",
		label: "Carnegie Classification of Institutions of Higher Education",
		example: [
			7566983
		],
		types: [
			"for items about organizations"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person or ensemble in the Carnegie Hall Linked Open Data (LOD)",
		datatype: "external-id",
		id: "P4104",
		label: "Carnegie Hall agent ID",
		example: [
			131861
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an event in the Carnegie Hall Linked Open Data (LOD) database",
		datatype: "external-id",
		id: "P5227",
		label: "Carnegie Hall event ID",
		example: [
			52212596
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a work in the Carnegie Hall Linked Open Data (LOD) database",
		datatype: "external-id",
		id: "P5229",
		label: "Carnegie Hall work ID",
		example: [
			52241789,
			3092981
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork or other object on the Carnegie Museum of Art website",
		datatype: "external-id",
		id: "P4686",
		label: "Carnegie Museum of Art ID",
		example: [
			21468088,
			28145876
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of a page at \"Carthalia - Theatres on Postcards\"",
		datatype: "external-id",
		id: "P5652",
		label: "Carthalia ID",
		example: [
			1464212,
			290852,
			56022593
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a cartoonist on the Cartooning for Peace website",
		datatype: "external-id",
		id: "P5665",
		label: "Cartooning for Peace cartoonist ID",
		example: [
			4828468,
			19629597,
			952263
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for single case in Caselaw Access Project",
		datatype: "external-id",
		id: "P6090",
		label: "Caselaw Access Project case ID",
		example: [
			4999666,
			17156924,
			656660
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"CAP ID",
			"case.law ID",
			"case ID"
		]
	},
	{
		description: "identifier in the biographical dictionary of Catalan women",
		datatype: "external-id",
		id: "P2498",
		label: "Catalan Biographical Dictionary of Women ID",
		example: [
			1895642,
			296806
		],
		types: [
		],
		aliases: [
			"Diccionari Biogràfic de Dones",
			"Biographical Dictionary of Women (Catalan ) ID"
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P1586",
		label: "Catalan object of cultural interest ID",
		example: [
			48435,
			12586
		],
		types: [
		],
		aliases: [
			"BCIN ID",
			"BCIN code"
		]
	},
	{
		description: "manuscript identifier in the British Library's Catalogue of Illuminated Manuscripts",
		datatype: "external-id",
		id: "P3702",
		label: "Catalogue of Illuminated Manuscripts ID",
		example: [
			4978668
		],
		types: [
		],
		aliases: [
			"CIM ID",
			"BL CIM ID",
			"British Library Catalogue of Illuminated Manuscripts ID"
		]
	},
	{
		description: "identifier (name code) for a taxon in the Catalogue of Life in Taiwan",
		datatype: "external-id",
		id: "P3088",
		label: "Catalogue of Life in Taiwan ID",
		example: [
			21400341,
			10470501
		],
		types: [
		],
		aliases: [
			"TaiBNET Name Code",
			"ID of TaiBNET",
			"ID of Catalogue of Life in Taiwan"
		]
	},
	{
		description: "identifier for a professor, in the Catalogus Professorum Academiae Groninganae",
		datatype: "external-id",
		id: "P2016",
		label: "Catalogus Professorum Academiae Groninganae id",
		example: [
			19587939
		],
		types: [
		],
		aliases: [
			"CPAG id"
		]
	},
	{
		description: "identifier for a professor at Utrecht University",
		datatype: "external-id",
		id: "P2862",
		label: "Catalogus Professorum Academiae Rheno-Traiectinae ID",
		example: [
			441099
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "biographical entry in the Catalogus Professorum Halensis",
		datatype: "external-id",
		id: "P2005",
		label: "Catalogus Professorum Halensis ID",
		example: [
			66607
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "biographical entry in the University of Leipzig catalog of professors",
		datatype: "external-id",
		id: "P3409",
		label: "Catalogus Professorum Lipsiensis ID",
		example: [
			25351
		],
		types: [
		],
		aliases: [
			"CPL ID",
			"Professorenkatalog der Universität Leipzig"
		]
	},
	{
		description: "identifier in the Catalogus Professorum Rostochensium database on professors of the Rostock University from 1419 to present",
		datatype: "external-id",
		id: "P2940",
		label: "Catalogus Professorum Rostochiensium ID",
		example: [
			57568
		],
		types: [
		],
		aliases: [
			"CPR ID"
		]
	},
	{
		description: "page of an article on newadvent.org",
		datatype: "external-id",
		id: "P3241",
		label: "Catholic Encyclopedia ID",
		example: [
			43739,
			1746003
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifer for a diocese on catholic-hierarchy.org",
		datatype: "external-id",
		id: "P1866",
		label: "Catholic Hierarchy diocese ID",
		example: [
			1242250,
			835426
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for the person on catholic-hierarchy.org",
		datatype: "external-id",
		id: "P1047",
		label: "Catholic Hierarchy person ID",
		example: [
			450675,
			2494
		],
		types: [
		],
		aliases: [
			"Catholic Hierarchy bishop identifier"
		]
	},
	{
		description: "Catholic rite associated with this item",
		datatype: "wikibase-item",
		id: "P3501",
		label: "Catholic rite",
		example: [
			1365378
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a catholic saint in the website CatholicSaints.info",
		datatype: "external-id",
		id: "P6725",
		label: "CatholicSaints.info ID",
		example: [
			76555,
			3947895,
			244380,
			133704
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a cultural heritage monument in the Catálogo de Patrimonio Cultural de Castilla-La Mancha",
		datatype: "external-id",
		id: "P6539",
		label: "Catálogo de Patrimonio Cultural de Castilla-La Mancha ID",
		example: [
			5911392,
			5961944,
			2956550
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID in the Cave E-Cadastre of Slovenia",
		datatype: "external-id",
		id: "P3256",
		label: "Cave E-Cadastre ID",
		example: [
			15903
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "phonetic algorithm",
		datatype: "string",
		id: "P3880",
		label: "Caverphone",
		example: [
			2803433,
			61666959,
			2793400
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a composer on the CeBeDem website",
		datatype: "external-id",
		id: "P5411",
		label: "CeBeDem composer ID",
		example: [
			603520,
			3572495,
			52224583
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for the Cell Line Ontology which describes anatomic origin and nature of eukaryotic cell lines",
		datatype: "external-id",
		id: "P2158",
		label: "Cell Line Ontology ID",
		example: [
			1632589
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"CLO ID"
		]
	},
	{
		description: "ID in the Cell Ontology",
		datatype: "external-id",
		id: "P7963",
		label: "Cell Ontology ID",
		example: [
			247101,
			37187,
			43054,
			184204,
			30029740
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Cellosaurus cell line identifier",
		datatype: "external-id",
		id: "P3289",
		label: "Cellosaurus ID",
		example: [
			3273166,
			847482
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an archive in Censo-Guía de Archivos de España e Iberoamérica",
		datatype: "external-id",
		id: "P3998",
		label: "Censo-Guía archive ID",
		example: [
			537883,
			2860546,
			5702972,
			17374317,
			2860529,
			9630359
		],
		types: [
		],
		aliases: [
			"Censo-Guia archive ID",
			"Censo-Guía de Archivos de España e Iberoamérica ID"
		]
	},
	{
		description: "identifier for a taxon on the Center for Biological Diversity website",
		datatype: "external-id",
		id: "P6003",
		label: "Center for Biological Diversity ID",
		example: [
			2276511,
			5553629,
			776670
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "number given to an individual or company by the United States Securities and Exchange Commission",
		datatype: "external-id",
		id: "P5531",
		label: "Central Index Key",
		example: [
			219508,
			483551,
			37158
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"CIK number",
			"SEC CIK",
			"CIK",
			"U.S. Securities and Exchange Commission CIK",
			"U.S. Securities and Exchange Commission Central Index Key",
			"Securities and Exchange Commission Central Index Key",
			"US SEC CIK"
		]
	},
	{
		description: "identifier for an entry on the 'Centre national d'art et de culture Georges-Pompidou' website",
		datatype: "external-id",
		id: "P6323",
		label: "Centre Pompidou ID",
		example: [
			18938367,
			16661255,
			60056756
		],
		types: [
		],
		aliases: [
			"Pompidou ID"
		]
	},
	{
		description: "identifier from database and ontology of molecular entities focused on 'small' chemical compounds",
		datatype: "external-id",
		id: "P683",
		label: "ChEBI ID",
		example: [
			407217,
			133145,
			151313
		],
		types: [
		],
		aliases: [
			"Chemical Entities of Biological Interest"
		]
	},
	{
		description: "identifier from a chemical database of bioactive molecules with drug-like properties",
		datatype: "external-id",
		id: "P592",
		label: "ChEMBL ID",
		example: [
			29310,
			18216,
			60235,
			127900
		],
		types: [
			"related to medicine",
			"related to chemistry"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a member of the Chamber of Deputies of the Kingdom of Sardinia, Chamber of Deputies of the Kingdom of Italy, or of the Chamber of Deputies of Italy, on the Chamber of Deputies of Italy website",
		datatype: "external-id",
		id: "P3935",
		label: "Chamber of Deputies of Italy storia ID",
		example: [
			539,
			166092,
			297190
		],
		types: [
		],
		aliases: [
			"Italian Chamber of Deputies storia ID"
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P5863",
		label: "CharacTour character ID",
		example: [
			247120,
			2583524,
			2338941,
			177329,
			190679
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "official number of a charity registered with the Charity Commission of England and Wales",
		datatype: "external-id",
		id: "P3057",
		label: "Charity Commission no.",
		example: [
			1892802
		],
		types: [
		],
		aliases: [
			"charity number",
			"Charity Commission number",
			"charity ID",
			"registered charity ID",
			"registered charity no",
			"registered charity number",
			"charity no",
			"Charity Commission no",
			"CCEW Charity number",
			"CCEW number"
		]
	},
	{
		description: "identifier for a charitable organisation in the United States, in the Charity Navigator database",
		datatype: "external-id",
		id: "P4861",
		label: "Charity Navigator ID",
		example: [
			180
		],
		types: [
		],
		aliases: [
			"CN ID"
		]
	},
	{
		description: "identifier for an artist on Charts in France music site",
		datatype: "external-id",
		id: "P6909",
		label: "Charts in France artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in a free chemical database, owned by the Royal Society of Chemistry",
		datatype: "external-id",
		id: "P661",
		label: "ChemSpider ID",
		example: [
			179996,
			199678,
			4118
		],
		types: [
			"related to chemistry"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a chemical compound in ChemSynthesis",
		datatype: "external-id",
		id: "P8508",
		label: "ChemSynthesis ID",
		example: [
			82427,
			82264706
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P2382",
		label: "Chemins de mémoire ID",
		example: [
			2073286
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a researcher on the online version of Chercheurs d'Asie",
		datatype: "external-id",
		id: "P5602",
		label: "Chercheurs d'Asie ID",
		example: [
			50276582,
			55847260,
			30118362
		],
		types: [
		],
		aliases: [
			"EFEO researcher ID"
		]
	},
	{
		description: "identifier on the website Chess Club (www.chessclub.com)",
		datatype: "external-id",
		id: "P1666",
		label: "Chess Club ID",
		example: [
			367277,
			211634
		],
		types: [
		],
		aliases: [
			"Internet Chess Club player ID",
			"Chessclub player ID"
		]
	},
	{
		description: "ID of a player at Chess.com",
		datatype: "external-id",
		id: "P3654",
		label: "Chess.com player ID",
		example: [
			183250
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier on the website Chess Games (www.chessgames.com)",
		datatype: "external-id",
		id: "P1665",
		label: "ChessGames.com player ID",
		example: [
			367277
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ChessGames.com ID",
			"ChessGames ID",
			"Chess Games ID"
		]
	},
	{
		description: "identifier for a protected property on the Chicago Landmarks website",
		datatype: "external-id",
		id: "P7958",
		label: "Chicago Landmarks ID",
		example: [
			158989,
			305286,
			3569046
		],
		types: [
		],
		aliases: [
			"Chicago Landmark"
		]
	},
	{
		description: "identifier for a rugby union player selected with the Chile national team on the Chile Rugby website",
		datatype: "external-id",
		id: "P5018",
		label: "Chile Rugby player ID",
		example: [
			25999872
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID for someone killed or sacrificed themself in China",
		datatype: "external-id",
		id: "P7365",
		label: "China Martyrs ID",
		example: [
			706851,
			701435,
			697362
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a treaty in the China Treaty Database",
		datatype: "external-id",
		id: "P8609",
		label: "China Treaty Database ID",
		example: [
			671479,
			6269155
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the China Vitae database",
		datatype: "external-id",
		id: "P1631",
		label: "China Vitae ID",
		example: [
			15031
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for administrative divisions of People's Republic of China (with spaces)",
		datatype: "external-id",
		id: "P442",
		label: "China administrative division code",
		example: [
			661533
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a railway station used in China railway system",
		datatype: "external-id",
		id: "P1378",
		label: "China railway TMIS station code",
		example: [
			529728,
			523887,
			17038341
		],
		types: [
		],
		aliases: [
			"GB/T 10302-2010"
		]
	},
	{
		description: "identifier for the clinical trials registry in China",
		datatype: "external-id",
		id: "P8064",
		label: "Chinese Clinical Trial Registry ID",
		example: [
			88374607,
			88454081
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"ChiCTR ID"
		]
	},
	{
		description: "ID of a person in Chinese Engineering Expert Tank, a database of Chinese researchers in science and engineering fields",
		datatype: "external-id",
		id: "P7237",
		label: "Chinese Engineering Expert Tank ID",
		example: [
			9127263,
			1059181,
			9364514
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"CEET",
			"CEET ID"
		]
	},
	{
		description: "identifier used for this class in the CLC",
		datatype: "external-id",
		id: "P1189",
		label: "Chinese Library Classification",
		example: [
			34749,
			11042
		],
		types: [
		],
		aliases: [
			"CLC"
		]
	},
	{
		description: "identifier for a Chinese athlete at the Chinese Olympic Committee's CIS Chinese Athletes Database website",
		datatype: "external-id",
		id: "P4068",
		label: "Chinese Olympic Committee athlete ID",
		example: [
			703812,
			254995
		],
		types: [
		],
		aliases: [
			"CIS Chinese Athletes Database ID",
			"www.sports.cn person ID",
			"data.stars.sports.cn person ID"
		]
	},
	{
		description: "identifer for a Chinese politician in the Chinese Political Elites Database",
		datatype: "external-id",
		id: "P5142",
		label: "Chinese Political Elites Database ID",
		example: [
			15031
		],
		types: [
		],
		aliases: [
			"CPED ID",
			"CPE ID"
		]
	},
	{
		description: "ID of a player in Chinese Professional Baseball League website of Taiwan",
		datatype: "external-id",
		id: "P7515",
		label: "Chinese Professional Baseball League player ID",
		example: [
			67935644,
			5090724,
			8983490
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"CPBL Player ID"
		]
	},
	{
		description: "identifier for a Chinese propaganda poster artist in the database of chineseposters.net",
		datatype: "external-id",
		id: "P4531",
		label: "ChinesePosters artist ID",
		example: [
			42430450
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist in the Christie's online database",
		datatype: "external-id",
		id: "P4200",
		label: "Christie's creator ID",
		example: [
			154340
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an object offered for sale by Christies",
		datatype: "external-id",
		id: "P3783",
		label: "Christie's object ID",
		example: [
			17861783,
			16038459
		],
		types: [
		],
		aliases: [
			"Christie's Lotfinder",
			"Christie's work ID"
		]
	},
	{
		description: "unique identifier for a Google Chrome extension",
		datatype: "external-id",
		id: "P8559",
		label: "Chrome Webstore extension ID",
		example: [
			352742,
			1566093,
			17559386
		],
		types: [
			"for software"
		],
		aliases: [
		]
	},
	{
		description: "numerical identifier in the \"Chromosome numbers of the Flora of Germany\" database",
		datatype: "external-id",
		id: "P5231",
		label: "Chromosome numbers of the Flora of Germany database ID",
		example: [
			212547
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a newspaper issued by the Library of Congress",
		datatype: "external-id",
		id: "P4898",
		label: "Chronicling America newspaper ID",
		example: [
			45077201,
			49816440,
			84392277,
			9684
		],
		types: [
		],
		aliases: [
			"LOC newspaper ID"
		]
	},
	{
		description: "identifier for a church building in the Church Heritage Cymru database (not the church code but a separate identifier)",
		datatype: "external-id",
		id: "P7621",
		label: "Church Heritage Cymru ID",
		example: [
			7593267,
			7595030,
			7594293
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a church building listed by Church of Norway (\"Kirkebyggdatabasen\")",
		datatype: "external-id",
		id: "P5294",
		label: "Church of Norway building ID",
		example: [
			15138199,
			1499934,
			1386244,
			1319441
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the database of dioceses, pastorates and church buildings of Sweden",
		datatype: "external-id",
		id: "P5048",
		label: "Church of Sweden ID",
		example: [
			8059845,
			8059846
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Svenskakyrkan ID"
		]
	},
	{
		description: "identifier for a pastoral district of the Church of Sweden",
		datatype: "external-id",
		id: "P779",
		label: "Church of Sweden Pastoratskod",
		example: [
			627556
		],
		types: [
		],
		aliases: [
			"Pastoratskod",
			"Church of Sweden Pastoratskod"
		]
	},
	{
		description: "identifier for a parish of the Church of Sweden",
		datatype: "external-id",
		id: "P778",
		label: "Church of Sweden parish code",
		example: [
			10401125,
			10401135
		],
		types: [
		],
		aliases: [
			"Församlingskod",
			"code for parishes in the Church of Sweden"
		]
	},
	{
		description: "identifier of an object in the Churches in Limburg database",
		datatype: "external-id",
		id: "P8449",
		label: "Churches in Limburg",
		example: [
			908127,
			634410,
			17405964
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a movie at the Iranian movie database CiNetMag",
		datatype: "external-id",
		id: "P3128",
		label: "CiNetMag film ID",
		example: [
			1753074
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person at the Iranian movie database CiNetMag",
		datatype: "external-id",
		id: "P3146",
		label: "CiNetMag person ID",
		example: [
			31637
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an article in CiNii",
		datatype: "external-id",
		id: "P2409",
		label: "CiNii article ID",
		example: [
			38492499
		],
		types: [
		],
		aliases: [
			"NAID",
			"Nii article ID"
		]
	},
	{
		description: "identifier for a journal article author in CiNii (Scholarly and Academic Information Navigator)",
		datatype: "external-id",
		id: "P4787",
		label: "CiNii author ID (articles)",
		example: [
			47393070
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a book author in CiNii (Scholarly and Academic Information Navigator)",
		datatype: "external-id",
		id: "P271",
		label: "CiNii author ID (books)",
		example: [
			8739,
			7300
		],
		types: [
		],
		aliases: [
			"CiNii author identifier",
			"NII",
			"CiNii author ID"
		]
	},
	{
		description: "identifier for books in the Japanese CiNii bibliography by NII aka National institute of informatics",
		datatype: "external-id",
		id: "P1739",
		label: "CiNii book ID",
		example: [
			183883,
			3775610
		],
		types: [
		],
		aliases: [
			"NCID",
			"CiNii book identifier",
			"NACSIS-CAT book identifier"
		]
	},
	{
		description: "identifier for a cemetery in the Cimetières de France database",
		datatype: "external-id",
		id: "P8337",
		label: "Cimetières de France ID",
		example: [
			2780931,
			94999808
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork on the Cincinnati Art Museum website",
		datatype: "external-id",
		id: "P8639",
		label: "Cincinnati Art Museum ID",
		example: [
			19900807,
			46957657
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for people listed at CineChile, the Chilean cinema encyclopedia",
		datatype: "external-id",
		id: "P6750",
		label: "CineChile filmmaker ID",
		example: [
			15304738,
			6146331,
			441727
		],
		types: [
		],
		aliases: [
			"CineChile.cl - Enciclopedia del cine chileno ID"
		]
	},
	{
		description: "identifier for a movie on the Cinemagia.ro website",
		datatype: "external-id",
		id: "P4665",
		label: "CineMagia film ID",
		example: [
			44864980,
			24514642
		],
		types: [
		],
		aliases: [
			"Cinemagia.ro film ID"
		]
	},
	{
		description: "identifier for a person on the Cinemagia.ro website",
		datatype: "external-id",
		id: "P4666",
		label: "CineMagia person ID",
		example: [
			12729197,
			80405
		],
		types: [
		],
		aliases: [
			"Cinemagia actor ID",
			"Cinemagia.ro person ID"
		]
	},
	{
		description: "identifier for a film on the CinePT website",
		datatype: "external-id",
		id: "P7593",
		label: "CinePT film ID",
		example: [
			33139,
			200981,
			322734
		],
		types: [
		],
		aliases: [
			"Cinema Português film ID"
		]
	},
	{
		description: "identifier for a person or organisatin on the CinePT website",
		datatype: "external-id",
		id: "P7594",
		label: "CinePT person ID",
		example: [
			2646378,
			55427,
			75157655
		],
		types: [
		],
		aliases: [
			"Cinema Português person ID"
		]
	},
	{
		description: "identifier of an item in Cinema Context",
		datatype: "external-id",
		id: "P8296",
		label: "Cinema Context ID",
		example: [
			132689,
			599272,
			1807410,
			330084
		],
		types: [
		],
		aliases: [
			"cinemacontext.nl ID"
		]
	},
	{
		description: "ID for movies backed by the Cinema Project / Yehoshua Rabinovich Foundation (Israel)",
		datatype: "external-id",
		id: "P5146",
		label: "Cinema Project (Israel) ID",
		example: [
			23838429
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a cinema in the Cinema Treasures database",
		datatype: "external-id",
		id: "P4129",
		label: "Cinema Treasures ID",
		example: [
			26561748,
			42296703
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier number in \"Cinema of Israel\" website",
		datatype: "external-id",
		id: "P3445",
		label: "Cinema of Israel ID",
		example: [
			5417437,
			56071291
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film or person in the German film website cinema.de",
		datatype: "external-id",
		id: "P3933",
		label: "Cinema.de ID",
		example: [
			496316,
			2263
		],
		types: [
		],
		aliases: [
			"Cinema ID"
		]
	},
	{
		description: "identifier for a person on the CinemaRx.ro website",
		datatype: "external-id",
		id: "P7483",
		label: "CinemaRx person ID",
		example: [
			14500720,
			13412172,
			12720629
		],
		types: [
		],
		aliases: [
			"CinemaRx.ro person ID"
		]
	},
	{
		description: "identifier for a movie at cinenacional.com database (from Argentina)",
		datatype: "external-id",
		id: "P3851",
		label: "Cinenacional.com movie ID",
		example: [
			1404323,
			22344512
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person at cinenacional.com database (from Argentina)",
		datatype: "external-id",
		id: "P3857",
		label: "Cinenacional.com person ID",
		example: [
			4888833,
			5766607
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for films in the Cineplex database",
		datatype: "external-id",
		id: "P3077",
		label: "Cineplex film ID",
		example: [
			44578,
			4536
		],
		types: [
		],
		aliases: [
			"Cineplex movie ID",
			"Cineplex ID"
		]
	},
	{
		description: "identifier for a person on the Cinepub site",
		datatype: "external-id",
		id: "P7586",
		label: "Cinepub person ID",
		example: [
			5297701,
			12744253
		],
		types: [
		],
		aliases: [
			"cinepub.ro person ID"
		]
	},
	{
		description: "external identifier for Indian movies",
		datatype: "external-id",
		id: "P7177",
		label: "Cinestaan film ID",
		example: [
			622380,
			843949,
			949228
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "external identifier for people related to Indian movies",
		datatype: "external-id",
		id: "P7178",
		label: "Cinestaan person ID",
		example: [
			8873,
			9570,
			465060
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a movie at Cineuropa",
		datatype: "external-id",
		id: "P5791",
		label: "Cineuropa film ID",
		example: [
			37816911,
			30726990,
			52063134
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person at Cineuropa",
		datatype: "external-id",
		id: "P6083",
		label: "Cineuropa person ID",
		example: [
			484779,
			231096,
			19630656
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork on the Cini Foundation website",
		datatype: "external-id",
		id: "P6633",
		label: "Cini Foundation ID",
		example: [
			3656454,
			3842412,
			48808013
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "page of a movie on the website \"Ciné-Ressources\"",
		datatype: "external-id",
		id: "P3203",
		label: "Ciné-Ressources film ID",
		example: [
			1197293
		],
		types: [
		],
		aliases: [
			"Ciné-Ressources movie ID",
			"Bifi film ID"
		]
	},
	{
		description: "page of a person on the website \"Ciné-Ressources\"",
		datatype: "external-id",
		id: "P3204",
		label: "Ciné-Ressources person ID",
		example: [
			52409,
			8927,
			84199
		],
		types: [
		],
		aliases: [
			"Bifi person ID",
			"cineressources.net person ID"
		]
	},
	{
		description: "Cinémathèque québécoise identifier for a work",
		datatype: "external-id",
		id: "P4276",
		label: "Cinémathèque québécoise work identifier",
		example: [
			3576908
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a movie in Cinépolis KLIC website",
		datatype: "external-id",
		id: "P7679",
		label: "Cinépolis KLIC ID",
		example: [
			28561715,
			40895,
			246283,
			190135
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for writers at CircleID",
		datatype: "external-id",
		id: "P3455",
		label: "CircleID writer ID",
		example: [
			92777
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for entries in the online database \"cistercian biographie online\" www.zisterzienserlexikon.de",
		datatype: "external-id",
		id: "P8441",
		label: "Cistercian Biography Online ID",
		example: [
			16007496,
			1540014,
			691787
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier string for a scientific article available from CiteSeer",
		datatype: "external-id",
		id: "P3784",
		label: "CiteSeerX article ID",
		example: [
			22241718,
			30364179
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a musical work in the Cité de la Musique-Philharmonie de Paris database",
		datatype: "external-id",
		id: "P5235",
		label: "Cité de la Musique-Philharmonie de Paris work ID",
		example: [
			327331,
			1190965
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of scientific author in www.cienciavitae.pt",
		datatype: "external-id",
		id: "P7893",
		label: "Ciência ID",
		example: [
			21341624,
			42176461,
			62071836
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "rating of an audiovisual work, video game or RPG in the Brazilian Advisory Rating System (ClassInd)",
		datatype: "wikibase-item",
		id: "P3216",
		label: "ClassInd rating",
		example: [
			1054036
		],
		types: [
		],
		aliases: [
			"BARS"
		]
	},
	{
		description: "code representing academic disciplines in the U.S. Department of Education's Classification of Instructional Programs",
		datatype: "string",
		id: "P2357",
		label: "Classification of Instructional Programs code",
		example: [
			9161265
		],
		types: [
		],
		aliases: [
			"Classification of Instructional Programs ID",
			"CIP code",
			"CIP ID"
		]
	},
	{
		description: "identifier on the Classiques des sciences sociales website",
		datatype: "external-id",
		id: "P5390",
		label: "Classiques des sciences sociales ID",
		example: [
			193670,
			128126,
			62833,
			78204721
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for Patristic, Medieval and Byzantine authors and texts in Latin and Greek",
		datatype: "external-id",
		id: "P7908",
		label: "Clavis Clavium ID",
		example: [
			8018,
			5244902,
			27455934
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ClaCla ID"
		]
	},
	{
		description: "identifier for Greek patristic works",
		datatype: "external-id",
		id: "P7988",
		label: "Clavis Patrum Graecorum ID",
		example: [
			181698,
			4331063,
			2617907,
			15649460
		],
		types: [
		],
		aliases: [
			"CPG ID"
		]
	},
	{
		description: "identifier for Latin patristic works",
		datatype: "external-id",
		id: "P7980",
		label: "Clavis Patrum Latinorum ID",
		example: [
			5244902,
			212318,
			372941
		],
		types: [
		],
		aliases: [
			"CPL ID"
		]
	},
	{
		description: "external identifiers for Cleartrip hotels",
		datatype: "external-id",
		id: "P7133",
		label: "Cleartrip hotel ID",
		example: [
			15217311,
			65658567,
			7074789
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for people in the Church of England database, covering English clergy from 1540–1835",
		datatype: "external-id",
		id: "P3410",
		label: "Clergy of the Church of England database ID",
		example: [
			5344312
		],
		types: [
		],
		aliases: [
			"CCEd person ID"
		]
	},
	{
		description: "identifier in the ClinVar database for human genomic variation",
		datatype: "external-id",
		id: "P1929",
		label: "ClinVar Variation ID",
		example: [
			19888172
		],
		types: [
			"related to medicine",
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the ClinicalTrials.gov database",
		datatype: "external-id",
		id: "P3098",
		label: "ClinicalTrials.gov Identifier",
		example: [
			288786,
			89901927
		],
		types: [
			"related to medicine",
			"related to chemistry"
		],
		aliases: [
			"NCT Number",
			"ClinicalTrials.gov ID",
			"NCT ID",
			"NCTID"
		]
	},
	{
		description: "identifier of a religious building on the clochers.org website",
		datatype: "external-id",
		id: "P3963",
		label: "Clochers de France ID",
		example: [
			193193
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "official number given by the NHA to official clubs",
		datatype: "external-id",
		id: "P8126",
		label: "Club Netherlands Handball Association ID",
		example: [
			13469764,
			18397024,
			65593547
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author on 'La Clé des langues'",
		datatype: "external-id",
		id: "P6024",
		label: "Clé des langues ID",
		example: [
			43455217,
			3490856,
			55771417
		],
		types: [
		],
		aliases: [
			"La Clé des langues"
		]
	},
	{
		description: "identifier of a video game in the co-optimus.com database",
		datatype: "external-id",
		id: "P8229",
		label: "Co-Optimus ID",
		example: [
			64566657,
			14558333,
			1779100
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID for authors in CoBiS, Coordination of the Special and Specialist Libraries of the Turin Metropolitan Area",
		datatype: "external-id",
		id: "P7865",
		label: "CoBiS author ID",
		example: [
			307,
			1035,
			14282
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a concept in the Cochrane linked-data vocabulary, relating to health and medicine",
		datatype: "external-id",
		id: "P7647",
		label: "Cochrane concept ID",
		example: [
			12125,
			12206,
			186005
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon on the Cockroach Species File website",
		datatype: "external-id",
		id: "P6052",
		label: "Cockroach Species File ID",
		example: [
			16538090,
			267996,
			2906271
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Coco Game List of Color Computer video games",
		datatype: "external-id",
		id: "P6853",
		label: "Coco Game List ID",
		example: [
			4817196,
			5472743,
			5196783,
			57649998
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "an identifer for Chinese reservoirs",
		datatype: "external-id",
		id: "P3119",
		label: "Code for China Reservoir Name",
		example: [
			12514
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "This code is official for the administrative divisions in Taiwan, and manages by the Department of Household Registration, Ministry of Interior.",
		datatype: "external-id",
		id: "P5020",
		label: "Code of Household Registration and Conscription Information System (Taiwan)",
		example: [
			249994,
			700818,
			10907763
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "codes used in the Q759874  as identifier for habitats",
		datatype: "external-id",
		id: "P6436",
		label: "Code of Natura 2000/FFH habitat",
		example: [
			47053,
			26269133,
			9282435,
			184358
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "the Code that governs the scientific name of this taxon",
		datatype: "wikibase-item",
		id: "P944",
		label: "Code of nomenclature",
		example: [
			729
		],
		types: [
			"for a taxon"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an historic site, monument or building in the National Monuments Record of Wales (NMRW) database",
		datatype: "external-id",
		id: "P4658",
		label: "Coflein ID",
		example: [
			7595030,
			2253186,
			5270727
		],
		types: [
		],
		aliases: [
			"NMRW ID",
			"National Monuments Record of Wales ID"
		]
	},
	{
		description: "identifier for a cryptocurrency on CoinMarketCap",
		datatype: "external-id",
		id: "P5777",
		label: "CoinMarketCap cryptocurrency ID",
		example: [
			131723,
			16783523,
			47494147,
			15377916
		],
		types: [
			"representing a unique identifier",
			"related to economics"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a coin in the Coinage of the Roman Republic Online platform, a digital version of Michael Crawford's 1974 publication Roman Republican Coinage (RRC)",
		datatype: "external-id",
		id: "P4455",
		label: "Coinage of the Roman Republic Online ID",
		example: [
			40798014
		],
		types: [
		],
		aliases: [
			"CRRO"
		]
	},
	{
		description: "identifier of a video game in the ColecoVision.dk database",
		datatype: "external-id",
		id: "P8003",
		label: "ColecoVision.dk ID",
		example: [
			4955790,
			1323953,
			12384
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the Colecovision Addict database",
		datatype: "external-id",
		id: "P8066",
		label: "Colecovision Addict ID",
		example: [
			4955790,
			1323953,
			12384
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the Colecovision Zone database",
		datatype: "external-id",
		id: "P7994",
		label: "Colecovision Zone ID",
		example: [
			1323953,
			4955790,
			24663098
		],
		types: [
			"for software",
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person, in the Collective Biographies of Women database",
		datatype: "external-id",
		id: "P4539",
		label: "Collective Biographies of Women ID",
		example: [
			7504
		],
		types: [
		],
		aliases: [
			"Collective Biographies of Women - person ID"
		]
	},
	{
		description: "ID at College Football Data Warehouse",
		datatype: "external-id",
		id: "P3560",
		label: "College Football Data Warehouse ID",
		example: [
			187983
		],
		types: [
		],
		aliases: [
			"CFDWH ID"
		]
	},
	{
		description: "identifier for American football players in the College Football Hall of Fame",
		datatype: "external-id",
		id: "P3044",
		label: "College Football HoF ID",
		example: [
			5325701,
			1849885
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a professor on the online version of Les Professeurs du Collège de France",
		datatype: "external-id",
		id: "P5546",
		label: "College de France professor ID (1909-1939)",
		example: [
			3059682,
			282132,
			3056833
		],
		types: [
		],
		aliases: [
			"CdF professor ID (1909-1939)"
		]
	},
	{
		description: "identifier of a professor at the 'Collège de France' on its website",
		datatype: "external-id",
		id: "P5443",
		label: "Collège de France professor ID",
		example: [
			160640,
			310590,
			19276262
		],
		types: [
		],
		aliases: [
			"CDF ID"
		]
	},
	{
		description: "phonetic algorithm which assigns to words a sequence of digits, the phonetic code",
		datatype: "string",
		id: "P3879",
		label: "Cologne phonetics",
		example: [
			8157228,
			11703653
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "type of library classification, to be used for topics, not for written works; use with qualifier \"edition (P747)\" with item value \"CC 6\" or \"CC 7\"",
		datatype: "external-id",
		id: "P8248",
		label: "Colon Classification",
		example: [
			57699384,
			8242,
			5369,
			7791,
			26997323
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a massacre in the database of Colonial Frontier Massacres in Central and Eastern Australia 1788-1930",
		datatype: "external-id",
		id: "P7044",
		label: "Colonial Frontier Massacres ID",
		example: [
			777916,
			1785309,
			2552587,
			653857,
			653857
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an entry on the Colorado Encyclopedia website",
		datatype: "external-id",
		id: "P7680",
		label: "Colorado Encyclopedia ID",
		example: [
			6759284,
			1111312,
			7998164
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete on the Colorado Sports Hall of Fame website",
		datatype: "external-id",
		id: "P4642",
		label: "Colorado Sports Hall of Fame ID",
		example: [
			44627607,
			1378223
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier issued by Colour Index International, for manufactured colour products",
		datatype: "external-id",
		id: "P2027",
		label: "Colour Index International constitution ID",
		example: [
			422662
		],
		types: [
		],
		aliases: [
			"CIIC ID",
			"constitution ID"
		]
	},
	{
		description: "identifier for Commonwealth of Australia legislation, bills, regulations, etc, in the ComLaw database",
		datatype: "external-id",
		id: "P2461",
		label: "ComLaw ID",
		example: [
			322945,
			55273934,
			4824660
		],
		types: [
		],
		aliases: [
			"legislation.gov.au ID"
		]
	},
	{
		description: "identifier in Comedien.ch database of actors and commedians",
		datatype: "external-id",
		id: "P1735",
		label: "Comedien.ch ID",
		example: [
			3196076,
			17305574,
			3311095
		],
		types: [
		],
		aliases: [
			"Comedien.ch identifier",
			"Comedien ID"
		]
	},
	{
		description: "identifier of comics creators from the ComiXology digital comics storefront",
		datatype: "external-id",
		id: "P5951",
		label: "ComiXology creator ID",
		example: [
			3313196,
			205739,
			3292795
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier at the Comic Vine database of comic books, fictional characters, people, films and television series/episodes",
		datatype: "external-id",
		id: "P5905",
		label: "Comic Vine ID",
		example: [
			2695156,
			163872,
			461264
		],
		types: [
		],
		aliases: [
			"ComicVine ID"
		]
	},
	{
		description: "identifier for creators at the online database ComicBookDB",
		datatype: "external-id",
		id: "P1392",
		label: "ComicBookDB ID",
		example: [
			2895012,
			3014784,
			2161172
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film in the website ComingSoon.it",
		datatype: "external-id",
		id: "P7132",
		label: "ComingSoon.it film ID",
		example: [
			4749765,
			63498440,
			64016309,
			577581
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in Common Database on Designated Areas",
		datatype: "external-id",
		id: "P4762",
		label: "Common Database on Designated Areas ID",
		example: [
			16648922,
			1538407,
			3287376,
			5821113,
			204931
		],
		types: [
		],
		aliases: [
			"CDDA-ID"
		]
	},
	{
		description: "massively multilingual and public domain taxonomy legislated by the EU for goods and services",
		datatype: "external-id",
		id: "P5417",
		label: "Common Procurement Vocabulary",
		example: [
			205647,
			4456821,
			627
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"CPV"
		]
	},
	{
		description: "identifier for a website or work of fiction on Common Sense Media",
		datatype: "external-id",
		id: "P7091",
		label: "Common Sense Media ID",
		example: [
			19798734,
			349375,
			29588607,
			483815
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an information security vulnerability",
		datatype: "external-id",
		id: "P3587",
		label: "Common Vulnerabilities and Exposures ID",
		example: [
			14579,
			16244272,
			8038
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"CVE ID"
		]
	},
	{
		description: "name of Commons Infobox template residing  in \"Creator\" namespace on Wikimedia Commons",
		datatype: "string",
		id: "P1472",
		label: "Commons Creator page",
		example: [
			7599919,
			5044454
		],
		types: [
			"for Commons"
		],
		aliases: [
			"creator page",
			"creator template"
		]
	},
	{
		description: "name of the institutions's page on Wikimedia Commons (without the prefix \"Institution\")",
		datatype: "string",
		id: "P1612",
		label: "Commons Institution page",
		example: [
			19675,
			132783,
			3329346,
			19882251
		],
		types: [
			"for Commons"
		],
		aliases: [
			"Institution template"
		]
	},
	{
		description: "name of the Wikimedia Commons category containing files related to this item (without the prefix \"Category:\")",
		datatype: "string",
		id: "P373",
		label: "Commons category",
		example: [
			569101,
			36611
		],
		types: [
			"for Commons",
			"about Wikimedia categories"
		],
		aliases: [
			"commonscat",
			"category Commons"
		]
	},
	{
		description: "image with Commons compatible copyright status is available at the following URL. It could be uploaded to Commons to illustrate the item.",
		datatype: "url",
		label: "Commons compatible image available at URL",
		id: "P4765",
		types: [
		],
		aliases: [
		]
	},
	{
		description: "name of the Wikimedia Commons gallery page(s) related to this item (is suitable to allow multiple links to more gallery pages)",
		datatype: "string",
		id: "P935",
		label: "Commons gallery",
		example: [
			1460,
			1514053,
			383541
		],
		types: [
			"for Commons"
		],
		aliases: [
			"gallery"
		]
	},
	{
		description: "assessment on Wikimedia Commons of the file: featured picture, valued image, quality images, picture of the day, picture of the year etc. Use on media entities only",
		datatype: "wikibase-item",
		label: "Commons quality assessment",
		id: "P6731",
		types: [
		],
		aliases: [
			"Commons featured picture",
			"Commons valued image",
			"Quality assessment",
			"Commons assessment",
			"Wikimedia Commons assessment",
			"assessment on Commons",
			"assessment on Wikimedia Commons"
		]
	},
	{
		description: "identifier for an athlete on the Commonwealth Games Federation website",
		datatype: "external-id",
		id: "P4548",
		label: "Commonwealth Games Federation athlete ID",
		example: [
			462986,
			5225079
		],
		types: [
		],
		aliases: [
			"CGF athlete ID"
		]
	},
	{
		description: "identifier of a Companion of the Liberation on the website of that French order",
		datatype: "external-id",
		id: "P4804",
		label: "Compagnon de la Libération ID",
		example: [
			3557261,
			3013877,
			8341040
		],
		types: [
		],
		aliases: [
			"Libération ID",
			"ordre de la Libération ID"
		]
	},
	{
		description: "numeric identifier for company registered with Companies House in the United Kingdom",
		datatype: "external-id",
		id: "P2622",
		label: "Companies House ID",
		example: [
			301092
		],
		types: [
		],
		aliases: [
			"Company House ID",
			"Companies House number",
			"Companies House no.",
			"company number",
			"registered company number"
		]
	},
	{
		description: "identifier for an officer (natural person or legal person) of companies registered with Companies House in the United Kingdom",
		datatype: "external-id",
		id: "P5297",
		label: "Companies House officer ID",
		example: [
			7395367,
			15023,
			700167
		],
		types: [
		],
		aliases: [
			"CHO ID"
		]
	},
	{
		description: "identifier for an article in the Compendium heroicum",
		datatype: "external-id",
		id: "P8014",
		label: "Compendium heroicum ID",
		example: [
			110910,
			188784,
			659396
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Complete BBC Games Archive (bbcmicro.co.uk)",
		datatype: "external-id",
		id: "P6292",
		label: "Complete BBC Micro Games Archive ID",
		example: [
			7602414,
			5122370,
			4785189,
			91282
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Complete BBC Games Archive identifier",
			"bbcmicro.co.uk identifier"
		]
	},
	{
		description: "accession number of protein complex at the Complex Portal",
		datatype: "external-id",
		id: "P7718",
		label: "Complex Portal accession ID",
		example: [
			50265911,
			50273129,
			50267824
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the Computer Emuzone database",
		datatype: "external-id",
		id: "P7733",
		label: "Computer Emuzone game ID",
		example: [
			15121695,
			599426,
			1067092,
			21620192
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a stage actor on the Comédie-Française website",
		datatype: "external-id",
		id: "P5616",
		label: "Comédie-Française ID",
		example: [
			2851148,
			3427191,
			3131932
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a secretary of the 'Conférence du stage de Paris' on its website",
		datatype: "external-id",
		id: "P6357",
		label: "Conférence du stage secretary ID",
		example: [
			3351380,
			60456294,
			58330304
		],
		types: [
		],
		aliases: [
			"Conférence des avocats du barreau de Paris ID"
		]
	},
	{
		description: "identifier of a member of the 'Conseil constitutionnel' on its website",
		datatype: "external-id",
		id: "P5457",
		label: "Conseil constitutionnel ID",
		example: [
			3102151,
			3308857,
			158772
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"CC ID",
			"ConCon ID"
		]
	},
	{
		description: "identifier for a journalist at the Conseil de Presse Luxembourg, the body that governs the professional title of journalist in Luxembourg",
		datatype: "external-id",
		id: "P4698",
		label: "Conseil de Presse Luxembourg journalist ID",
		example: [
			13104009,
			13104496
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier on the Conservatoire du littoral website",
		datatype: "external-id",
		id: "P3009",
		label: "Conservatoire du littoral ID",
		example: [
			3591756,
			3041303
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Belarus library catalog code",
		datatype: "external-id",
		id: "P3390",
		label: "Consolidated code of the electronic catalog of libraries of Belarus",
		example: [
			93366,
			4520868
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "invariant of a knot. Use z as variable and list monomials in decreasing order.",
		datatype: "math",
		id: "P5351",
		label: "Conway polynomial",
		example: [
			1188344,
			168620,
			7797291
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "a measurement of how strongly a United States congressional district or state leans toward the Democratic or Republican Party, compared to the nation as a whole",
		datatype: "string",
		id: "P6586",
		label: "Cook Partisan Voting Index",
		example: [
			9553880,
			7902303,
			6868116
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person or organization in the Cooper-Hewitt (Smithsonian Institution) catalogue",
		datatype: "external-id",
		id: "P2011",
		label: "Cooper-Hewitt Person ID",
		example: [
			20726418,
			37156
		],
		types: [
		],
		aliases: [
			"Cooper Hewitt Person or Org ID",
			"Cooper-Hewitt Person or Organization ID"
		]
	},
	{
		description: "patent classification code used between the European Patent Office and United States Patent and Trademark Office",
		datatype: "string",
		id: "P5778",
		label: "Cooperative Patent Classification code",
		example: [
			1139975,
			19793,
			221262,
			47481343,
			1402123
		],
		types: [
		],
		aliases: [
			"CPC code"
		]
	},
	{
		description: "identifier for an opera on the Corago website",
		datatype: "external-id",
		id: "P5251",
		label: "Corago opera ID",
		example: [
			185968,
			1880650
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon on the Coreoidea Species File website",
		datatype: "external-id",
		id: "P6053",
		label: "Coreoidea Species File ID",
		example: [
			1640226,
			3110569,
			468719
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier assigned to companies and other organizations by the National Tax Agency of Japan",
		datatype: "external-id",
		id: "P3225",
		label: "Corporate Number (Japan)",
		example: [
			11235261,
			1322605,
			120730,
			34600
		],
		types: [
		],
		aliases: [
			"hōjin bangō"
		]
	},
	{
		description: "identifier assigned to companies registered in South Korea by the Registration Office, the Court of South Korea",
		datatype: "external-id",
		id: "P6859",
		label: "Corporate Number (South Korea)",
		example: [
			213147,
			20718,
			162345
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a Latin author in the database Corpus Corporum",
		datatype: "external-id",
		id: "P7935",
		label: "Corpus Corporum author ID",
		example: [
			170863,
			258369,
			310777
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a typeface on the Corpus typographique français website",
		datatype: "external-id",
		id: "P6165",
		label: "Corpus typographique français ID",
		example: [
			582888,
			17174895,
			25394786
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "Number for a chemical substance in the European CosIng database",
		datatype: "external-id",
		id: "P3073",
		label: "CosIng number",
		example: [
			10844270
		],
		types: [
			"related to chemistry"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a magistrate in the French Court of Audit online biographical dictionary",
		datatype: "external-id",
		id: "P4821",
		label: "Cour des comptes magistrate ID",
		example: [
			27916032,
			18619801,
			2960500
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a report about an organization on the 'Cour des comptes's website",
		datatype: "external-id",
		id: "P6577",
		label: "Cour des comptes report ID",
		example: [
			864120,
			3326,
			3114753
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a source on the Courrier international website",
		datatype: "external-id",
		id: "P5554",
		label: "Courrier international source ID",
		example: [
			720503,
			525592,
			16903296
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a topic on the Courrier international website",
		datatype: "external-id",
		id: "P5551",
		label: "Courrier international topic ID",
		example: [
			264766,
			7184,
			90
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "database for 1700 paintings by Cranach and his circle",
		datatype: "external-id",
		id: "P5783",
		label: "Cranach Digital Archive artwork ID",
		example: [
			20175476
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist or group, in the Cravo Albin Dictionary of Brazilian Popular Music",
		datatype: "external-id",
		id: "P4351",
		label: "Cravo Albin artist ID",
		example: [
			200131,
			239074
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for persons in the Crew united database of German films, TV series, and related productions",
		datatype: "external-id",
		id: "P6521",
		label: "Crew United person ID",
		example: [
			1452981,
			529519,
			1171155
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for films and series on Crew united",
		datatype: "external-id",
		id: "P6359",
		label: "Crew United title ID",
		example: [
			39072263,
			35115274,
			1193360
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the CricketArchive.com database",
		datatype: "external-id",
		id: "P2698",
		label: "CricketArchive player ID",
		example: [
			22958463,
			600090
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a cricket ground at CricketArchive",
		datatype: "external-id",
		id: "P3586",
		label: "CricketArchive playing ground ID",
		example: [
			7136359
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for football player of Crimean Football Union",
		datatype: "external-id",
		id: "P6318",
		label: "Crimean Football Union player ID",
		example: [
			2446608,
			4154832,
			20069064
		],
		types: [
		],
		aliases: [
			"CFU player ID"
		]
	},
	{
		description: "identifier for a concept in the United Nations Interregional Crime and Justice Research Institute's Criminological Thesaurus",
		datatype: "external-id",
		id: "P8374",
		label: "Criminological Thesaurus ID",
		example: [
			1378517,
			36633,
			29957548
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an entry on the Critique d'art website",
		datatype: "external-id",
		id: "P6325",
		label: "Critique d'art ID",
		example: [
			33102666,
			60057151,
			2994035
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for musicians in the Croatia Records database (www.crorec.hr)",
		datatype: "external-id",
		id: "P6730",
		label: "CroRec ID",
		example: [
			93292,
			62841663,
			2037516,
			935263
		],
		types: [
		],
		aliases: [
			"Croatia Records ID",
			"Croatia Records database ID"
		]
	},
	{
		description: "ID of player at Croatian Football Federation website",
		datatype: "external-id",
		id: "P3577",
		label: "Croatian Football Federation player ID",
		example: [
			496071
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of an association football (soccer) player at hrnogomet.com, the Croatian Football Statistics (Statistike hrvatskog nogometa) website",
		datatype: "external-id",
		id: "P3657",
		label: "Croatian Football Statistics player ID",
		example: [
			553325
		],
		types: [
		],
		aliases: [
			"hrnogomet.com ID",
			"Croatian Football Statistics ID",
			"Statistike hrvatskog nogometa"
		]
	},
	{
		description: "identifier for an athlete on the Croatian Olympic Committee (Hrvatski olimpijski odbor / HOO)",
		datatype: "external-id",
		id: "P4541",
		label: "Croatian Olympic Committee athlete ID",
		example: [
			2254042,
			210814
		],
		types: [
		],
		aliases: [
			"HOO athlete ID"
		]
	},
	{
		description: "ID of a Scrabble player at cross-tables.com",
		datatype: "external-id",
		id: "P3656",
		label: "Cross-tables.com Scrabble player ID",
		example: [
			7945871
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an organisation that funds research, in the Crossref registry",
		datatype: "external-id",
		id: "P3153",
		label: "Crossref funder ID",
		example: [
			309388,
			1200258,
			8880
		],
		types: [
		],
		aliases: [
			"Funder ID",
			"FundRef ID"
		]
	},
	{
		description: "identifier of a journal in Crossref",
		datatype: "external-id",
		id: "P8375",
		label: "Crossref journal ID",
		example: [
			50817291,
			58468270
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier for an organization, in the Crunchbase database of companies and start-ups, operated by Oath Tech",
		datatype: "external-id",
		id: "P2088",
		label: "Crunchbase organization ID",
		example: [
			355,
			3884,
			192864
		],
		types: [
		],
		aliases: [
			"Crunchbase organisation ID",
			"Crunchbase company ID"
		]
	},
	{
		description: "Identifier for a person, in the Crunchbase database of companies and start-ups, operated by TechCrunch",
		datatype: "external-id",
		id: "P2087",
		label: "Crunchbase person ID",
		example: [
			4208540
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an anime or drama topic on Crunchyroll",
		datatype: "external-id",
		id: "P4110",
		label: "Crunchyroll ID",
		example: [
			65086934
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID about a specific snooker player at the CueTracker.net database",
		datatype: "external-id",
		id: "P3830",
		label: "CueTracker player ID",
		example: [
			295376,
			918418
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID about a specific snooker tournament at the CueTracker.net database",
		datatype: "external-id",
		id: "P4924",
		label: "CueTracker tournament ID",
		example: [
			502948
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a graduate of the US Military Academy (West Point)",
		datatype: "external-id",
		id: "P4026",
		label: "Cullum number",
		example: [
			34836,
			127417
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier of an item in the Cult of Saints in Late Antiquity database",
		datatype: "external-id",
		id: "P8073",
		label: "Cult of Saints in Late Antiquity ID",
		example: [
			44248,
			8018,
			771956
		],
		types: [
		],
		aliases: [
			"The Cult of Saints in Late Antiquity ID",
			"CSLA ID"
		]
	},
	{
		description: "identification number for the CulturaItalia LOD section",
		datatype: "external-id",
		id: "P1949",
		label: "CulturaItalia ID",
		example: [
			3661158
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a cultural object in Armenia",
		datatype: "external-id",
		id: "P3170",
		label: "Cultural Heritage Armenia ID",
		example: [
			1294648,
			684072
		],
		types: [
		],
		aliases: [
			"Armenian Cultural Heritage ID"
		]
	},
	{
		description: "identifier for a cultural object in Kosovo",
		datatype: "external-id",
		id: "P3227",
		label: "Cultural Heritage Kosovo ID",
		example: [
			22827385
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier from Cultural Objects Name Authority",
		datatype: "external-id",
		id: "P1669",
		label: "Cultural Objects Names Authority ID",
		example: [
			2943
		],
		types: [
		],
		aliases: [
			"Cultural Objects Names Authority identifier",
			"Cultural Objects Names Authority ID",
			"CONA identifier",
			"CONA ID"
		]
	},
	{
		description: "identifier given by the published BDA (Bundesdenkmalamt) list of monuments",
		datatype: "external-id",
		id: "P2951",
		label: "Cultural heritage database in Austria ObjektID",
		example: [
			18818498
		],
		types: [
		],
		aliases: [
			"Austria Cultural ObjectID",
			"Denkmalgeschütztes Objekt Österreich ID"
		]
	},
	{
		description: "identifier for a concept in the Dutch Cultureel Woordenboek ('Cultural Dictionary')",
		datatype: "external-id",
		id: "P3569",
		label: "Cultureel Woordenboek ID",
		example: [
			102561,
			13909,
			153996
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Cultureel Woordenboek identifier"
		]
	},
	{
		description: "ID on the CurlingZone database",
		datatype: "external-id",
		id: "P3556",
		label: "CurlingZone ID",
		example: [
			5585589,
			518841
		],
		types: [
		],
		aliases: [
			"CurlingZone ID",
			"CZ ID"
		]
	},
	{
		description: "identifier for a periodical contributor indexed in the Curran Index",
		datatype: "external-id",
		id: "P8085",
		label: "Curran Index contributor ID",
		example: [
			24091208,
			722533,
			30875
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a cyclist on the CycleBase website",
		datatype: "external-id",
		id: "P4508",
		label: "CycleBase cyclist ID",
		example: [
			453352,
			123548
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Cycling Archives",
		datatype: "external-id",
		id: "P1409",
		label: "Cycling Archives cyclist ID",
		example: [
			6242,
			59535,
			103756
		],
		types: [
		],
		aliases: [
			"Cycling Archives ID (cyclist)"
		]
	},
	{
		description: "identifier in the Cycling Archives",
		datatype: "external-id",
		id: "P2330",
		label: "Cycling Archives race ID",
		example: [
			20872499,
			2204042
		],
		types: [
		],
		aliases: [
			"Cycling Archives ID (race)"
		]
	},
	{
		description: "identifier in the Cycling Archives",
		datatype: "external-id",
		id: "P2331",
		label: "Cycling Archives team ID",
		example: [
			18746658
		],
		types: [
		],
		aliases: [
			"Cycling Archives ID (team)"
		]
	},
	{
		description: "identifier on the website Cycling Database (www.cyclingdatabase.com)",
		datatype: "external-id",
		id: "P1664",
		label: "Cycling Database ID",
		example: [
			2172
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of the subject at Cyworld",
		datatype: "external-id",
		id: "P4226",
		label: "Cyworld ID",
		example: [
			464663
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for football player on site Czech Fortuna liga",
		datatype: "external-id",
		id: "P7451",
		label: "Czech Fortuna liga player ID",
		example: [
			299717,
			20860081,
			388835
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier assigned to geomorphological units (regions) in Czechia",
		datatype: "external-id",
		id: "P5258",
		label: "Czech Geomorphological Unit Code",
		example: [
			704453,
			1396039
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID of a race horse in the database of the Jockey Club of the Czech Republic",
		datatype: "external-id",
		id: "P4472",
		label: "Czech Jockey Club horse ID",
		example: [
			12054337
		],
		types: [
		],
		aliases: [
			"Jockey Club České republiky ID"
		]
	},
	{
		description: "ID given to protected but also some unprotected monuments and other objects in the Czech Republic on the official Monument Catalogue of the National Heritage Institute",
		datatype: "external-id",
		id: "P4075",
		label: "Czech Monument Catalogue Number",
		example: [
			12046031
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon in the Conservancy Species Occurrence Finding Database, managed by the Nature Conservation Agency of the Czech Republic",
		datatype: "external-id",
		id: "P5263",
		label: "Czech NDOP taxon ID",
		example: [
			159629
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a book at the Czech National Library",
		datatype: "external-id",
		id: "P3184",
		label: "Czech National Bibliography book ID",
		example: [
			26162388,
			1752739
		],
		types: [
		],
		aliases: [
			"čČNB",
			"cnb"
		]
	},
	{
		description: "identifier for a Czech athlete on the website of the Czech Olympic Committee (Český olympijský výbor – ČOV)",
		datatype: "external-id",
		id: "P4062",
		label: "Czech Olympic Committee athlete ID",
		example: [
			3363011,
			6776387
		],
		types: [
		],
		aliases: [
			"COV athlete ID",
			"ČOV athlete ID"
		]
	},
	{
		description: "8-digit identifier for an organization (or self-employed enterpreneur) in the Czech Republic, conferred by the Czech Statistical Office",
		datatype: "external-id",
		id: "P4156",
		label: "Czech Registration ID",
		example: [
			336735,
			11781505
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in a database of war graves and other related memorials of the Czech Ministry of Defence",
		datatype: "external-id",
		id: "P7949",
		label: "Czech War Graves Register",
		example: [
			12043650,
			20050719,
			47169439
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a cadastral area in the Czech Republic, conferred by 'Český úřad zeměměřický a katastrální'",
		datatype: "external-id",
		id: "P7526",
		label: "Czech cadastral area ID",
		example: [
			12045877,
			12059686,
			2003486
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a city district in the Czech Republic, conferred by 'Český úřad zeměměřický a katastrální'",
		datatype: "external-id",
		id: "P7577",
		label: "Czech city district ID",
		example: [
			11342272,
			2189635,
			3509575
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a cohesion region, conferred by 'Český úřad zeměměřický a katastrální'",
		datatype: "external-id",
		id: "P7735",
		label: "Czech cohesion region ID",
		example: [
			5061457,
			6192497,
			7458002
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for cultural heritage properties in the Czech Republic",
		datatype: "external-id",
		id: "P762",
		label: "Czech cultural heritage ID",
		example: [
			193369
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a district, conferred by 'Český úřad zeměměřický a katastrální'",
		datatype: "external-id",
		id: "P7673",
		label: "Czech district ID",
		example: [
			582488,
			838338,
			838308
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a municipality in the Czech Republic",
		datatype: "external-id",
		id: "P7606",
		label: "Czech municipality ID",
		example: [
			1085,
			43453,
			2003425,
			1669094
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a neighbourhood in the Czech Republic",
		datatype: "external-id",
		id: "P2788",
		label: "Czech neighbourhood ID code",
		example: [
			11088947
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the public database of the deputies of the Czech Parliament",
		datatype: "external-id",
		id: "P6828",
		label: "Czech parliament ID",
		example: [
			165114,
			152274
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a region, conferred by 'Český úřad zeměměřický a katastrální'",
		datatype: "external-id",
		id: "P7674",
		label: "Czech region ID",
		example: [
			192697,
			193266,
			191091
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a street in the official registry of the Czech Republic",
		datatype: "external-id",
		id: "P4533",
		label: "Czech street ID",
		example: [
			847613,
			44611089
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a territorial region, conferred by 'Český úřad zeměměřický a katastrální'",
		datatype: "external-id",
		id: "P7736",
		label: "Czech territorial region ID",
		example: [
			960992,
			1807822,
			3491317
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film on the César Awards website",
		datatype: "external-id",
		id: "P5318",
		label: "César Award film ID",
		example: [
			1049604,
			73803
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the César Awards website",
		datatype: "external-id",
		id: "P5319",
		label: "César Award person ID",
		example: [
			639888,
			276005
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a company in the D&B Hoovers database ID",
		datatype: "external-id",
		id: "P5232",
		label: "D&B Hoovers company profile",
		example: [
			23498557,
			180
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Hoovers ID",
			"Hoovers.com ID"
		]
	},
	{
		description: "identifier of a video game in the D-MSX database",
		datatype: "external-id",
		id: "P7802",
		label: "D-MSX ID",
		example: [
			6552947,
			1995422,
			7389524
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "unique company identifier from Dun & Bradstreet",
		datatype: "external-id",
		id: "P2771",
		label: "D-U-N-S number",
		example: [
			15825279
		],
		types: [
			"related to economics"
		],
		aliases: [
			"DUNS",
			"Data Universal Numbering System",
			"DUNS Number",
			"D-U-N-S Number"
		]
	},
	{
		description: "identifier per Design & Art Australia Online",
		datatype: "external-id",
		id: "P1707",
		label: "DAAO ID",
		example: [
			1975172
		],
		types: [
		],
		aliases: [
			"DAAO identifier",
			"Design and Art Australia Online ID"
		]
	},
	{
		description: "code to identify 50,000 artists as members of the British collective rights management organisation DACS and sister organisations worldwide",
		datatype: "external-id",
		id: "P4663",
		label: "DACS ID",
		example: [
			24654988,
			5603
		],
		types: [
		],
		aliases: [
			"Design and Artists Copyright Society ID"
		]
	},
	{
		description: "identifier for a lexeme on the 9th edition of the Dictionnaire de l'Académie française on the Académie française website",
		datatype: "external-id",
		label: "DAF ID",
		id: "P7732",
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier for an artist in the Discography of American Historical Recordings (DAHR)",
		datatype: "external-id",
		id: "P4457",
		label: "DAHR artist ID",
		example: [
			41804451,
			4030,
			1625070
		],
		types: [
		],
		aliases: [
			"Discography of American Historical Recordings Artist ID"
		]
	},
	{
		description: "identifier for a person the ''Dictionnaire des auteurs de langue française en Amérique du Nord''",
		datatype: "external-id",
		id: "P6470",
		label: "DALFAN ID",
		example: [
			3102051,
			3287758,
			3106384
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an asteroid in the Database of Asteroid Models from Inversion Techniques (DAMIT)",
		datatype: "external-id",
		id: "P4384",
		label: "DAMIT asteroid ID",
		example: [
			3002
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identification code for Colombian municipalities according to the Departamento Administrativo Nacional de Estadística (DANE)",
		datatype: "external-id",
		id: "P7325",
		label: "DANE code",
		example: [
			979097,
			1150886,
			1442422
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a ship on the Dictionary of American Naval Fighting Ships website",
		datatype: "external-id",
		id: "P7910",
		label: "DANFS ship ID",
		example: [
			7869293,
			3502970,
			7875148
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID of someone in the ancestor database of Daughters of the American Revolution",
		datatype: "external-id",
		id: "P7969",
		label: "DAR ancestor ID",
		example: [
			75764755,
			81110974,
			11812,
			61698690
		],
		types: [
		],
		aliases: [
			"DAR ID",
			"DAR person ID",
			"DAR ancestor ID",
			"Daughters of the American Revolution ID"
		]
	},
	{
		description: "identifier for a doctoral thesis on DART-Europe",
		datatype: "external-id",
		id: "P8184",
		label: "DART-Europe thesis ID",
		example: [
			91997003,
			47020660,
			92185404
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier (RDF URI) for the subject issued by DATAtourisme database",
		datatype: "external-id",
		id: "P8486",
		label: "DATAtourisme ID",
		example: [
			3329229,
			243,
			3991
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a hut on the German Alpine Club website",
		datatype: "external-id",
		id: "P5757",
		label: "DAV hut ID",
		example: [
			865809,
			3423242,
			1734718
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person in the online 'Nouveau dictionnaire de biographie alsacienne'",
		datatype: "external-id",
		id: "P4992",
		label: "DBA ID",
		example: [
			3573330,
			46616296,
			361004,
			50617821,
			50617288
		],
		types: [
		],
		aliases: [
			"NetDBA",
			"Net DBA",
			"DBA en ligne"
		]
	},
	{
		description: "identifier for authors set by the Danish Bibliographic Centre",
		datatype: "external-id",
		id: "P3846",
		label: "DBC author ID",
		example: [
			522203,
			76
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for person entries in the DBLP computer science bibliography (use portion of DBLP person key after homepages/)",
		datatype: "external-id",
		id: "P2456",
		label: "DBLP ID",
		example: [
			6173703,
			20111994,
			777234,
			28914141,
			5113370
		],
		types: [
		],
		aliases: [
			"DBLP person ID",
			"DBLP person identifier",
			"DBLP pID",
			"DBLP key"
		]
	},
	{
		description: "identifier in the German/Austrian Library Statistics (DBS/ÖBS)",
		datatype: "external-id",
		id: "P4007",
		label: "DBS ID",
		example: [
			2327042,
			2326869
		],
		types: [
		],
		aliases: [
			"ÖBS ID",
			"Deutsche Bibliotheksstatistik",
			"Österreichische Bibliotheksstatistik"
		]
	},
	{
		description: "database identifier from the Italian Ministry MIBACT (DBUnico 2.0)",
		datatype: "external-id",
		id: "P5782",
		label: "DBUnico MIBACT ID",
		example: [
			4012942,
			2047566,
			1115846
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "external identifier for authors whose books were published by DC Books",
		datatype: "external-id",
		id: "P7356",
		label: "DC Books author ID",
		example: [
			3521624,
			7635072,
			4849743,
			9513
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for writers and artists on DCComics.com",
		datatype: "external-id",
		id: "P7951",
		label: "DC Comics talent ID",
		example: [
			1507300,
			1145350,
			205739,
			210059
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the DCMOTO database of Thomson MO/TO software",
		datatype: "external-id",
		id: "P6068",
		label: "DCMOTO identifier",
		example: [
			3201630,
			88828,
			91282,
			3554350
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for items in Deutsche Digitale Bibliothek",
		datatype: "external-id",
		id: "P4948",
		label: "DDB ID",
		example: [
			47532607
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the film database of the DEFA foundation",
		datatype: "external-id",
		id: "P5510",
		label: "DEFA film database ID",
		example: [
			55554342,
			151177
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a lexeme on the Dictionnaire électronique des synonymes",
		datatype: "external-id",
		label: "DES ID",
		id: "P7765",
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a facility indexed by Bangladesh's Directorate General of Health Services",
		datatype: "external-id",
		id: "P8162",
		label: "DGHS facility code",
		example: [
			4778088,
			4678070,
			5304399
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier per Direction générale opérationelle (Wallonia)",
		datatype: "external-id",
		id: "P1133",
		label: "DGO4 identifier",
		example: [
			2477151
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the DGPC (Directorate General of Cultural Heritage) database of heritage sites in Portugal",
		datatype: "external-id",
		id: "P1702",
		label: "DGPC ID",
		example: [
			1549939
		],
		types: [
		],
		aliases: [
			"DGPC identifier",
			"IGESPAR ID"
		]
	},
	{
		description: "ID of water objects (rivers, ponds, lakes, ...) of the Czech republic referenced in DIgitální BÁze VOdohospodářských Dat (DIBAVOD) of VÚV TGM",
		datatype: "external-id",
		id: "P7227",
		label: "DIBAVOD ID",
		example: [
			5210826,
			52184978,
			131574
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "numerical identifier for a lithographer in the 'Dictionnaire des imprimeurs-lithographes du XIXe siècle'",
		datatype: "external-id",
		id: "P8595",
		label: "DIL ID",
		example: [
			98822597,
			98822629,
			99231546
		],
		types: [
		],
		aliases: [
			"Dictionnaire des imprimeurs-lithographes du XIXe siècle ID"
		]
	},
	{
		description: "identifier from database of geologic units in the Netherlands (Data Informatie Nederlandse Ondergrond)",
		datatype: "external-id",
		id: "P733",
		label: "DINOloket",
		example: [
			2214078
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "official identifier of a public Spanish organization",
		datatype: "external-id",
		id: "P6222",
		label: "DIR3 ID",
		example: [
			8210807,
			28663941,
			578863,
			633561,
			19746,
			11680571,
			539149
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a topic on the online version of the ''Dizionario dell'integrazione europea''",
		datatype: "external-id",
		id: "P6414",
		label: "DIZIE ID",
		example: [
			60717503,
			832200,
			663538
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a past or present member of the Legislative Council of Hong Kong in the Database on Legislative Council Members",
		datatype: "external-id",
		id: "P5303",
		label: "DLCM ID",
		example: [
			15940901
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "word in the Spanish Language Dictionary of the Spanish Royal Academy",
		datatype: "external-id",
		label: "DLE RAE ID",
		id: "P7790",
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a work in the Digital Library of India",
		datatype: "external-id",
		id: "P2185",
		label: "DLI ID",
		example: [
			3124055
		],
		types: [
		],
		aliases: [
			"DLI identifier",
			"Digital Library of India Identifier"
		]
	},
	{
		description: "identifier for a Latin author in the catalog Digital Latin Library",
		datatype: "external-id",
		id: "P8122",
		label: "DLL Catalog author ID",
		example: [
			1541,
			275500,
			1334915
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a Latin work in the catalog Digital Latin Library",
		datatype: "external-id",
		id: "P8123",
		label: "DLL Catalog work ID",
		example: [
			1559179,
			1155892,
			1233645
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a video game on the dlive.tv website",
		datatype: "external-id",
		id: "P8333",
		label: "DLive game ID",
		example: [
			63595820,
			61478103
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "category path at Open Directory Project",
		datatype: "external-id",
		id: "P998",
		label: "DMOZ ID",
		example: [
			15,
			1435,
			133050,
			187832,
			41142
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Open Directory Project",
			"ODP",
			"Netscape Open Directory",
			"NewHoo",
			"GNUHoo",
			"directory.mozilla",
			"Mozilla Directory",
			"dmoz",
			"Curlie.org"
		]
	},
	{
		description: "identifier in the German National Library catalogue (see also authority data P227)",
		datatype: "external-id",
		id: "P1292",
		label: "DNB editions",
		example: [
			15220473
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film in the Danish National Filmography",
		datatype: "external-id",
		id: "P1804",
		label: "DNF film ID",
		example: [
			775356,
			3346699
		],
		types: [
		],
		aliases: [
			"DNF film",
			"DNF ID (film)",
			"Danish National Filmography film ID"
		]
	},
	{
		description: "identifier for a ship, in the DNV GL Vessel register",
		datatype: "external-id",
		id: "P5006",
		label: "DNV GL Vessel register ID",
		example: [
			194109
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Directory of Open Access Books (DOAB)",
		datatype: "external-id",
		id: "P5062",
		label: "DOAB publisher ID",
		example: [
			27612534,
			917031
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a building, structure or group of buildings in Registros del Movimiento Moderno database, DOCOMOMO Ibérico",
		datatype: "external-id",
		id: "P3758",
		label: "DOCOMOMO Ibérico ID",
		example: [
			3995702,
			27656886,
			14755471
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "external and unique identifier which represents a publication in Diari Oficial de la Generalitat de Catalunya",
		datatype: "external-id",
		id: "P6514",
		label: "DOGC ID",
		example: [
			19920902,
			28091116,
			23541363
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "serial code used to uniquely identify digital objects like academic papers (use upper case letters only)",
		datatype: "external-id",
		id: "P356",
		label: "DOI",
		example: [
			15567682,
			84371583
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Digital Object Identifier"
		]
	},
	{
		description: "a formatter string that will create an DOI",
		datatype: "string",
		label: "DOI formatter",
		id: "P8404",
		types: [
			"metaproperty"
		],
		aliases: [
		]
	},
	{
		description: "identifier specific to a DOI registrant",
		datatype: "external-id",
		id: "P1662",
		label: "DOI prefix",
		example: [
			233358,
			905549
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"DOIP"
		]
	},
	{
		description: "identifier of an orientalist on the online version of the Dictionnaire des orientalistes de langue française",
		datatype: "external-id",
		id: "P5605",
		label: "DOLF ID",
		example: [
			370987,
			179825,
			317616
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an underwater animal or plant species from French metropolitan and overseas waters on the participatory site DORIS",
		datatype: "external-id",
		id: "P4630",
		label: "DORIS ID",
		example: [
			29995,
			33115
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an educational institution issued by Bangladesh's Directorate of Primary Education",
		datatype: "external-id",
		id: "P8186",
		label: "DPE school code",
		example: [
			43301375,
			25587074,
			25587055
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for books, paintings, films, museum objects and archival records that have been digitised throughout United States",
		datatype: "external-id",
		label: "DPLA ID",
		id: "P760",
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Digital Public Library of America ID"
		]
	},
	{
		description: "identifier for a subject area in the Digital Public Library of America",
		datatype: "external-id",
		id: "P4272",
		label: "DPLA subject ID",
		example: [
			729,
			717956
		],
		types: [
		],
		aliases: [
			"Digital Public Library of America subject ID"
		]
	},
	{
		description: "identifier of plant virus in DPV (Descriptions of Plant Viruses) database",
		datatype: "external-id",
		id: "P8164",
		label: "DPVweb ID",
		example: [
			332874,
			3530126,
			3560908
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on DR site",
		datatype: "external-id",
		id: "P8041",
		label: "DR music artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a topic for news on DR's website",
		datatype: "external-id",
		id: "P6849",
		label: "DR topic ID",
		example: [
			28913413,
			1028,
			847
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier used to format links in a database of Czech protected areas and trees",
		datatype: "external-id",
		id: "P3296",
		label: "DRÚSOP ID",
		example: [
			11775258
		],
		types: [
		],
		aliases: [
			"DRÚSOP code"
		]
	},
	{
		description: "identifier in the Diccionario Biográfico del Socialismo Español",
		datatype: "external-id",
		id: "P2985",
		label: "DSBE ID",
		example: [
			450299,
			2074856
		],
		types: [
		],
		aliases: [
			"Diccionario Biográfico del Socialismo Español ID",
			"Biographical Dictionary of Spanish Socialism ID",
			"Spanish Socialist Biographical Dictionary ID"
		]
	},
	{
		description: "identifier for cultural monuments in Hamburg, Germany",
		datatype: "external-id",
		id: "P1822",
		label: "DSH object ID",
		example: [
			444036
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a mental disorder in the 5th edition of Diagnostic and Statistical Manual of Mental Disorders",
		datatype: "external-id",
		id: "P1930",
		label: "DSM-5 classification",
		example: [
			622604
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"DSMV",
			"DSM 5",
			"DSM5",
			"DSM V"
		]
	},
	{
		description: "identifier for a mental disorder in the 4th edition of Diagnostic and Statistical Manual of Mental Disorders",
		datatype: "external-id",
		id: "P663",
		label: "DSM-IV classification",
		example: [
			742672,
			177190
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"DSMIV",
			"DSM-4",
			"DSM IV",
			"DSM 4",
			"DSM-IV code",
			"DSM-Ⅳ",
			"DSM-IV"
		]
	},
	{
		description: "identifier for an athlete on the Delaware Sports Museum and Hall of Fame website",
		datatype: "external-id",
		id: "P4363",
		label: "DSMHOF athlete ID",
		example: [
			2071833,
			5236950
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of compound in DSSTOX",
		datatype: "external-id",
		id: "P8494",
		label: "DSSTOX compound identifier",
		example: [
			2270,
			18216
		],
		types: [
			"related to chemistry"
		],
		aliases: [
		]
	},
	{
		description: "DSSTox substance identifier (DTXSID) used in the Environmental Protection Agency CompTox Dashboard",
		datatype: "external-id",
		id: "P3117",
		label: "DSSTox substance ID",
		example: [
			2270,
			408652,
			271980,
			418348,
			18216,
			60168
		],
		types: [
		],
		aliases: [
			"DTXSID"
		]
	},
	{
		description: "identifier for a person on the German Ski Association website",
		datatype: "external-id",
		id: "P5784",
		label: "DSV person ID",
		example: [
			61727,
			106468,
			480102
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a noted woman on the online version of the ''Dictionnaire universel des créatrices''",
		datatype: "external-id",
		id: "P7578",
		label: "DUC ID",
		example: [
			466654,
			20004897,
			450612
		],
		types: [
		],
		aliases: [
			"Le Dictionnaire universel des Créatrices ID"
		]
	},
	{
		description: "identifier in the Dutch Digitaal Vrouwenlexicon van Nederland (Online Dictionary of Dutch Women), a biography portal of prominent women in Dutch history.",
		datatype: "external-id",
		id: "P1788",
		label: "DVN ID",
		example: [
			150747,
			232423
		],
		types: [
		],
		aliases: [
			"DVN identifier",
			"Digitaal Vrouwenlexicon van Nederland ID"
		]
	},
	{
		description: "identifier for data processing Austrian organisations",
		datatype: "external-id",
		id: "P6326",
		label: "DVR Number",
		example: [
			1531553,
			1172519,
			19312241
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a beach volleyball player on the website of the German Volleyball Federation",
		datatype: "external-id",
		id: "P4617",
		label: "DVV player ID",
		example: [
			4578,
			1901419
		],
		types: [
		],
		aliases: [
			"Deutscher Volleyball-Verband player ID"
		]
	},
	{
		description: "ID of a football player at DZFoot.com",
		datatype: "external-id",
		id: "P3658",
		label: "DZFoot.com player ID",
		example: [
			3318433
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a topic, used by the Swedish daily newspaper Dagens Nyheter",
		datatype: "external-id",
		id: "P3509",
		label: "Dagens Nyheter topic ID",
		example: [
			22686,
			699872,
			75779
		],
		types: [
		],
		aliases: [
			"DN topic ID",
			"DN.se topic ID"
		]
	},
	{
		description: "identifier for a topic, used by the Norwegian daily newspaper Dagens Næringsliv",
		datatype: "external-id",
		id: "P4167",
		label: "Dagens Næringsliv topic ID",
		example: [
			291644,
			2283,
			571
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of the Dailymotion channel of a person, or organization",
		datatype: "external-id",
		id: "P2942",
		label: "Dailymotion channel ID",
		example: [
			82892
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork on the Dallas Museum of Art website",
		datatype: "external-id",
		id: "P8640",
		label: "Dallas Museum of Art ID",
		example: [
			18668539,
			18665648,
			79166135
		],
		types: [
		],
		aliases: [
			"DMA ID"
		]
	},
	{
		description: "identifier for part of the URI for a word in the DanNet resource",
		datatype: "external-id",
		label: "DanNet 2.2 word ID",
		id: "P6140",
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "mineral classification Dana 8th edition",
		datatype: "external-id",
		id: "P714",
		label: "Dana 8th edition",
		example: [
			5283
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "serial & conference identifier",
		datatype: "external-id",
		id: "P1250",
		label: "Danish Bibliometric Research Indicator (BFI) SNO/CNO",
		example: [
			15750864,
			15754348
		],
		types: [
		],
		aliases: [
			"BFI SNO",
			"BFI CNO"
		]
	},
	{
		description: "Danish scientific level of research publications, coordinated with the nordic list of publication channels. See also item {{q|Q57408668}}",
		datatype: "string",
		id: "P1240",
		label: "Danish Bibliometric Research Indicator level",
		example: [
			26535
		],
		types: [
			"for items about works",
			"with datatype string that is not an external identifier"
		],
		aliases: [
			"BFI level",
			"Danish scientific level"
		]
	},
	{
		description: "identifier for Danish national team player's page at the official website of the Danish Football Association (in Danish: Dansk Boldspil-Union or DBU)",
		datatype: "external-id",
		id: "P6109",
		label: "Danish Football Union player ID",
		example: [
			188720,
			295797,
			294951
		],
		types: [
		],
		aliases: [
			"DBU player ID",
			"Dansk Boldspil-Union player ID"
		]
	},
	{
		description: "identifier in the Danish List of a Lighthouse, beacon or fog signal in the Kingdom of Denmark",
		datatype: "external-id",
		id: "P4038",
		label: "Danish List of Lights and Fog signals ID",
		example: [
			27919578
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the Danish National Filmography",
		datatype: "external-id",
		id: "P2626",
		label: "Danish National Filmography person ID",
		example: [
			788060
		],
		types: [
		],
		aliases: [
			"Danish National Filmography name",
			"DNF name",
			"DNF ID (person)",
			"DFI person ID",
			"DNF person ID"
		]
	},
	{
		description: "identifier for protected ancient monument site in Denmark, assigned by Heritage Agency of Denmark",
		datatype: "external-id",
		id: "P3596",
		label: "Danish ancient monument ID",
		example: [
			12302975
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "case number of a listed building in Denmark",
		datatype: "external-id",
		id: "P2783",
		label: "Danish listed buildings case ID",
		example: [
			12304760
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an parish in Denmark",
		datatype: "external-id",
		id: "P2290",
		label: "Danish parish code",
		example: [
			1398978
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for Danish protected area",
		datatype: "external-id",
		id: "P2763",
		label: "Danish protected area ID",
		example: [
			3375908
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "official identifier for an urban area in Denmark",
		datatype: "external-id",
		id: "P1894",
		label: "Danish urban area code",
		example: [
			1748,
			26563
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of fungus taxa in Danmarks svampeatlas",
		datatype: "external-id",
		id: "P6268",
		label: "Danmarks svampeatlas ID",
		example: [
			2501490,
			541818,
			2826419
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person in the online encyclopedia biografiskleksikon at lex.dk",
		datatype: "external-id",
		id: "P8341",
		label: "Dansk Biografisk Leksikon ID",
		example: [
			182804,
			1928794,
			7085,
			153940
		],
		types: [
		],
		aliases: [
			"DBL ID",
			"Dansk Biografisk Leksikon Identifier",
			"DBL Identifier",
			"Danish Biographical Lexicon ID"
		]
	},
	{
		description: "identifier for a person in the Dansk kvindebiografisk leksikon",
		datatype: "external-id",
		id: "P7939",
		label: "Dansk kvindebiografisk leksikon ID",
		example: [
			1486239,
			4954291,
			55369948
		],
		types: [
		],
		aliases: [
			"KVINFO ID"
		]
	},
	{
		description: "identifier of an article in the online encyclopedia dansklitteraturshistorie.lex.dk",
		datatype: "external-id",
		id: "P8332",
		label: "Dansk litteraturs historie ID",
		example: [
			12339838,
			154432,
			1021184
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"DLH ID"
		]
	},
	{
		description: "Identifier for speaker on the ''Danske Taler'' website",
		datatype: "external-id",
		id: "P6232",
		label: "Danske Taler speaker ID",
		example: [
			952472,
			441594,
			331893
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in danskefilm.dk",
		datatype: "external-id",
		id: "P3786",
		label: "Danskefilm person ID",
		example: [
			133730,
			232404
		],
		types: [
		],
		aliases: [
			"Danskefilm database person ID"
		]
	},
	{
		description: "identifier of an voice actor, director or translator in the Danish DanskeFilmStemmer.dk database",
		datatype: "external-id",
		id: "P6777",
		label: "Danskefilmstemmer.dk person ID",
		example: [
			3362157,
			943173,
			4993909
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a school in Indonesia",
		datatype: "external-id",
		id: "P5884",
		label: "Dapodikdasmen ID",
		example: [
			7391097
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Indonesian Basic Data of Primary and Secondary Education ID"
		]
	},
	{
		description: "identifier of a player at Darts Database",
		datatype: "external-id",
		id: "P3621",
		label: "Darts Database player ID",
		example: [
			5567701,
			3545098
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for persons in the Database of Classical Scholars",
		datatype: "external-id",
		id: "P1935",
		label: "Database of Classical Scholars ID",
		example: [
			971011,
			70478
		],
		types: [
		],
		aliases: [
			"DBCS identifier",
			"Database of Classical Scholars identifier"
		]
	},
	{
		description: "Datahub page of a dataset",
		datatype: "external-id",
		id: "P2666",
		label: "Datahub page",
		example: [
			23017666
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for content in the Daum Encyclopedia",
		datatype: "external-id",
		id: "P5184",
		label: "Daum Encyclopedia ID",
		example: [
			7888194,
			833,
			866,
			39666
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a TV Series in the Daum database",
		datatype: "external-id",
		id: "P4270",
		label: "Daum TV series ID",
		example: [
			19854621
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film in the Daum database",
		datatype: "external-id",
		id: "P4277",
		label: "Daum movie ID",
		example: [
			15635278,
			190086,
			774269
		],
		types: [
		],
		aliases: [
			"Daum film ID"
		]
	},
	{
		description: "identifier for a tennis player, in the Davis Cup database",
		datatype: "external-id",
		id: "P2641",
		label: "Davis Cup player ID",
		example: [
			105550
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a subject on the Enciclopedia De Agostini online",
		datatype: "external-id",
		id: "P6706",
		label: "De Agostini ID",
		example: [
			539,
			343501,
			2966014,
			712504,
			232052
		],
		types: [
		],
		aliases: [
			"Sapere ID",
			"Sapere.it ID"
		]
	},
	{
		description: "name of the official Debian stable package",
		datatype: "external-id",
		id: "P3442",
		label: "Debian stable package",
		example: [
			8038
		],
		types: [
			"for software"
		],
		aliases: [
			"Debian package",
			"package, Debian stable"
		]
	},
	{
		description: "identifier for a person, in Debrett's \"People of Today\"",
		datatype: "external-id",
		id: "P2255",
		label: "Debrett's People of Today ID",
		example: [
			332412
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film or TV series on the website decine21.com",
		datatype: "external-id",
		id: "P7978",
		label: "Decine21 film ID",
		example: [
			48741246,
			1217355,
			29057443
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the website decine21.com",
		datatype: "external-id",
		id: "P7803",
		label: "Decine21 person ID",
		example: [
			3470450,
			555578,
			181900,
			55238
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Person ID on Declarator.org database",
		datatype: "external-id",
		id: "P1883",
		label: "Declarator.org ID",
		example: [
			7747,
			23530
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an album or single on Deezer",
		datatype: "external-id",
		id: "P2723",
		label: "Deezer album ID",
		example: [
			283221,
			44320
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on Deezer",
		datatype: "external-id",
		id: "P2722",
		label: "Deezer artist ID",
		example: [
			93341,
			3015811,
			383541
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a show or podcast on Deezer",
		datatype: "external-id",
		id: "P5988",
		label: "Deezer show ID",
		example: [
			52215119,
			56887666,
			3210524
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a track on Deezer",
		datatype: "external-id",
		id: "P2724",
		label: "Deezer track ID",
		example: [
			919291,
			3156658
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a definition in definedterm.com dictionary",
		datatype: "external-id",
		label: "Defined Term ID",
		id: "P6205",
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the Deku Deals website",
		datatype: "external-id",
		id: "P8364",
		label: "Deku Deals ID",
		example: [
			17185964,
			96239073,
			65040623
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Democracy Club database of political candidates",
		datatype: "external-id",
		id: "P6465",
		label: "Democracy Club candidate ID",
		example: [
			153454,
			24039485,
			27943421
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Democracy Club database of elections",
		datatype: "external-id",
		id: "P6649",
		label: "Democracy Club election ID",
		example: [
			24039224,
			3586935,
			21030558
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Democracy Index rating of a country",
		datatype: "quantity",
		id: "P8328",
		label: "Democracy Index",
		example: [
			30,
			20
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a Danish city in \"Den Digitale Byport\"",
		datatype: "external-id",
		id: "P6471",
		label: "Den Digitale Byport ID",
		example: [
			741067,
			1748,
			25319
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an article in the online encyclopedia denstoredanske.lex.dk",
		datatype: "external-id",
		id: "P8313",
		label: "Den Store Danske ID",
		example: [
			362,
			44519,
			133050,
			1744
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"DSD ID"
		]
	},
	{
		description: "Unique identifier for monuments in Lower Saxony",
		datatype: "external-id",
		id: "P7900",
		label: "Denkmalatlas Niedersachsen Objekt-ID",
		example: [
			685476,
			1687056,
			17117949
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the database of protected properties maintained by the Kanton of Thurgau",
		datatype: "external-id",
		id: "P8493",
		label: "Denkmaldatenbank Thurgau ID",
		example: [
			29525748,
			29525733
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in official government database of Irish schools",
		datatype: "external-id",
		id: "P4331",
		label: "Department of Education and Skills roll number",
		example: [
			4923314
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "online guide that includes most of the deportation transports that originated from cities in central, western and southern European countries between 1939 and 1945",
		datatype: "external-id",
		id: "P6581",
		label: "Deportation Database transport ID",
		example: [
			1833561,
			27859714,
			61942953
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a publication in Spain",
		datatype: "external-id",
		id: "P6164",
		label: "Depósito Legal ID",
		example: [
			56650936,
			82772000
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"DL"
		]
	},
	{
		description: "identifier for people who were killed or went missing during the Brazilian military dictatorship (1964-1985)",
		datatype: "external-id",
		id: "P6674",
		label: "Desaparecidos Políticos ID",
		example: [
			4313901,
			18237983,
			17413797
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier code from Described and Captioned Media Program, a program fully funded by the United States Department of Education which provides resources for students with disabilities",
		datatype: "external-id",
		id: "P8481",
		label: "Described and Captioned Media Program producer ID",
		example: [
			89510019,
			7864132
		],
		types: [
		],
		aliases: [
			"dcmp ID (producer)"
		]
	},
	{
		description: "category a German railway station operated by DB Station&Service is assigned to",
		datatype: "wikibase-item",
		id: "P5105",
		label: "Deutsche Bahn station category",
		example: [
			28053390
		],
		types: [
		],
		aliases: [
			"station category (Deutsche Bahn)"
		]
	},
	{
		description: "Identifier for train stations and other operating points used by Deutsche Bahn",
		datatype: "string",
		id: "P8671",
		label: "Deutsche Bahn station code",
		example: [
			828172,
			1097,
			320682
		],
		types: [
		],
		aliases: [
			"DS-100 code"
		]
	},
	{
		description: "identifier for a person in the Deutsche Biographie",
		datatype: "external-id",
		id: "P7902",
		label: "Deutsche Biographie ID",
		example: [
			61483266,
			260,
			18759689,
			853
		],
		types: [
		],
		aliases: [
			"DtBio ID",
			"German Biography ID"
		]
	},
	{
		description: "Identifier for actors in the synchronisation (dubbing) database Deutsche Synchronkartei. Format: digits",
		datatype: "external-id",
		id: "P4332",
		label: "Deutsche Synchronkartei actor ID",
		example: [
			348445,
			108935
		],
		types: [
		],
		aliases: [
			"Synchronkartei actor ID"
		]
	},
	{
		description: "identifier for a dubbing voice actor, in the synchronisation (dubbing) database Deutsche Synchronkartei",
		datatype: "external-id",
		id: "P4727",
		label: "Deutsche Synchronkartei dubbing voice actor ID",
		example: [
			124433,
			109253
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier for films in the synchronisation database Deutsche Synchronkartei",
		datatype: "external-id",
		id: "P3844",
		label: "Deutsche Synchronkartei film ID",
		example: [
			595,
			5890
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a TV series in the synchronisation (dubbing) database Deutsche Synchronkartei",
		datatype: "external-id",
		id: "P4834",
		label: "Deutsche Synchronkartei series ID",
		example: [
			192837,
			39071657
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for individual runners in the Deutsche Ultramarathon-Vereinigung (German Ultramarathon Association) database",
		datatype: "external-id",
		id: "P2162",
		label: "Deutsche Ultramarathon-Vereinigung ID",
		example: [
			16011113,
			15110703,
			20745593
		],
		types: [
		],
		aliases: [
			"DUV ID"
		]
	},
	{
		description: "use with qualifier \"edition (P747)\" with item value \"DDC 23\" or create new item to represent the corresponding DDC edition",
		datatype: "external-id",
		id: "P1036",
		label: "Dewey Decimal Classification",
		example: [
			735,
			872,
			33
		],
		types: [
		],
		aliases: [
			"DDC"
		]
	},
	{
		description: "DDC number assigned to a publication",
		datatype: "string",
		id: "P8359",
		label: "Dewey Decimal Classification (works and editions)",
		example: [
			19128645,
			19851135,
			19983442,
			20592194
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Department for Education Unique Reference Number; school identifier used by the UK government",
		datatype: "external-id",
		id: "P2253",
		label: "DfE URN",
		example: [
			7084691,
			34433,
			35794
		],
		types: [
		],
		aliases: [
			"Department for Education URN",
			"EDUBase URN",
			"EDUBase ID",
			"Department for Education Unique Reference Number",
			"URN of Department of Education"
		]
	},
	{
		description: "identifier for a person in DDBC",
		datatype: "external-id",
		id: "P1187",
		label: "Dharma Drum Buddhist College person ID",
		example: [
			9333,
			9441,
			7419
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a place in DDBC",
		datatype: "external-id",
		id: "P1188",
		label: "Dharma Drum Buddhist College place ID",
		example: [
			622616,
			16666
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an article in Dialnet",
		datatype: "external-id",
		id: "P1610",
		label: "Dialnet article ID",
		example: [
			17519401
		],
		types: [
		],
		aliases: [
			"Dialnet article identifier",
			"Dialnet article",
			"Dialnet paper ID",
			"Dialnet paper identifier"
		]
	},
	{
		description: "identifier of an author in Dialnet",
		datatype: "external-id",
		id: "P1607",
		label: "Dialnet author ID",
		example: [
			5949894,
			44015223
		],
		types: [
		],
		aliases: [
			"Dialnet author",
			"Dialnet author identifier"
		]
	},
	{
		description: "identifier of a book in Dialnet",
		datatype: "external-id",
		id: "P1608",
		label: "Dialnet book ID",
		example: [
			21686259
		],
		types: [
		],
		aliases: [
			"Dialnet book",
			"Dialnet book identifier"
		]
	},
	{
		description: "identifier of a journal in Dialnet",
		datatype: "external-id",
		id: "P1609",
		label: "Dialnet journal ID",
		example: [
			17519325
		],
		types: [
		],
		aliases: [
			"Dialnet journal",
			"Dialnet journal identifier"
		]
	},
	{
		description: "identifier for an athlete on the Diamond League website",
		datatype: "external-id",
		id: "P3923",
		label: "Diamond League athlete ID",
		example: [
			16787454,
			1655
		],
		types: [
		],
		aliases: [
			"IAAF Diamond League athlete ID",
			"Wanda Diamond League athlete ID",
			"diamondleague.com ID"
		]
	},
	{
		description: "identifier for an item in the Diccionari de la Literatura Catalana",
		datatype: "external-id",
		id: "P7357",
		label: "Diccionari de la Literatura Catalana ID",
		example: [
			379290,
			23505633
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"DLC ID"
		]
	},
	{
		description: "identifier for an item in the Diccionari del cinema a Catalunya",
		datatype: "external-id",
		id: "P7872",
		label: "Diccionari del cinema a Catalunya ID",
		example: [
			4516605,
			2990318
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID for argentinian scientists and researchers from the Diccionario de científicos argentinos Dra. Grierson",
		datatype: "external-id",
		id: "P3946",
		label: "Dictionary Grierson ID",
		example: [
			233985
		],
		types: [
		],
		aliases: [
			"Diccionario de científicos argentinos Dra. Cecilia Grierson ID",
			"Diccionario de científicos argentinos ID"
		]
	},
	{
		description: "identifier for an entry in the Dictionary of Algorithms and Data Structures",
		datatype: "external-id",
		id: "P5106",
		label: "Dictionary of Algorithms and Data Structures ID",
		example: [
			486598,
			207440
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"DADS ID"
		]
	},
	{
		description: "identifier for a writer in ''Dictionary of Anhui Writers'' which was edited by Anhui Writers Association",
		datatype: "external-id",
		id: "P6763",
		label: "Dictionary of Anhui Writers ID",
		example: [
			61054543,
			61014804,
			61054563
		],
		types: [
			"multi-source external identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the Dictionary of Art Historians",
		datatype: "external-id",
		id: "P2332",
		label: "Dictionary of Art Historians ID",
		example: [
			60185,
			2831339,
			2851334,
			107195
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "entry of the item in the Dictionary of Canadian Biography",
		datatype: "external-id",
		id: "P2753",
		label: "Dictionary of Canadian Biography ID",
		example: [
			764557,
			72536515
		],
		types: [
		],
		aliases: [
			"DCB ID"
		]
	},
	{
		description: "identifier in the Dictionary of Irish Biography",
		datatype: "external-id",
		id: "P6829",
		label: "Dictionary of Irish Biography ID",
		example: [
			213374,
			469093,
			152690
		],
		types: [
		],
		aliases: [
			"DIB ID",
			"Irish Biography ID"
		]
	},
	{
		description: "entry in the Dictionary of Medieval Names from European Sources",
		datatype: "external-id",
		id: "P1888",
		label: "Dictionary of Medieval Names from European Sources entry",
		example: [
			18042461,
			27648524
		],
		types: [
			"Wikidata name property"
		],
		aliases: [
			"DMNES"
		]
	},
	{
		description: "identifier in the Dictionary of New Zealand Biography",
		datatype: "external-id",
		id: "P2745",
		label: "Dictionary of New Zealand Biography ID",
		example: [
			775773,
			6120216
		],
		types: [
		],
		aliases: [
			"Dictionary of New Zealand Biography identifier",
			"Te Ara identifier",
			"Te Ara – The Encyclopedia of New Zealand ID",
			"DNZB ID"
		]
	},
	{
		description: "identifier for a person on the online Dictionary of Scottish Architects",
		datatype: "external-id",
		id: "P5308",
		label: "Dictionary of Scottish Architects ID",
		example: [
			15488682
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a building in the Dictionary of Scottish Architects database and website",
		datatype: "external-id",
		id: "P7630",
		label: "Dictionary of Scottish Architects building ID",
		example: [
			2933232,
			5289193,
			5193119
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"DSA building ID"
		]
	},
	{
		description: "identifier for a sculptor in A Biographical Dictionary of Sculptors in Britain, 1660-1851",
		datatype: "external-id",
		id: "P7430",
		label: "Dictionary of Sculptors in Britain ID",
		example: [
			3120721,
			53505183,
			1246573
		],
		types: [
		],
		aliases: [
			"Biographical Dictionary of Sculptors in Britain"
		]
	},
	{
		description: "entry in the Dictionary of Swedish National Biography",
		datatype: "external-id",
		id: "P3217",
		label: "Dictionary of Swedish National Biography ID",
		example: [
			44519,
			52930,
			52947
		],
		types: [
		],
		aliases: [
			"SBL ID",
			"Svenskt biografiskt lexikon",
			"SBLID"
		]
	},
	{
		description: "article in the Dictionary of Swedish Translators",
		datatype: "external-id",
		id: "P5147",
		label: "Dictionary of Swedish Translators ID",
		example: [
			6185909,
			366311
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Dictionary of Sydney",
		datatype: "external-id",
		id: "P3794",
		label: "Dictionary of Sydney ID",
		example: [
			320,
			744558,
			7660035,
			49070
		],
		types: [
		],
		aliases: [
			"Dictionary of Sydney identifier"
		]
	},
	{
		description: "identifer for a person in the Dictionary of Ulster Biography",
		datatype: "external-id",
		id: "P2029",
		label: "Dictionary of Ulster Biography ID",
		example: [
			6138726
		],
		types: [
		],
		aliases: [
			"DUB ID",
			"DoUB ID",
			"Ulster Biography ID"
		]
	},
	{
		description: "identifier per the Dictionary of Welsh Biography",
		datatype: "external-id",
		id: "P1648",
		label: "Dictionary of Welsh Biography ID",
		example: [
			134982,
			3402447
		],
		types: [
		],
		aliases: [
			"DWB"
		]
	},
	{
		description: "article identifier for the Dictionary of Wisconsin History",
		datatype: "external-id",
		id: "P7614",
		label: "Dictionary of Wisconsin History ID",
		example: [
			878682,
			714534,
			37836
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Wisconsin Historical Society ID"
		]
	},
	{
		description: "identifier on an art historian on the online Dictionnaire critique des historiens de l'art actifs en France de la Révolution à la Première Guerre mondiale",
		datatype: "external-id",
		id: "P5372",
		label: "Dictionnaire critique des historiens de l'art ID",
		example: [
			1063751,
			16214296,
			2960038
		],
		types: [
		],
		aliases: [
			"DCHA ID"
		]
	},
	{
		description: "identifier for a topic on the ''Dictionnaire de spiritualité''",
		datatype: "external-id",
		id: "P6302",
		label: "Dictionnaire de spiritualité ID",
		example: [
			334965,
			60028787,
			368470
		],
		types: [
		],
		aliases: [
			"Spiritualité ID"
		]
	},
	{
		description: "identifier for a person on the online Dictionnaire des Vendéens",
		datatype: "external-id",
		id: "P6728",
		label: "Dictionnaire des Vendéens ID",
		example: [
			50745631,
			50758290,
			62984681
		],
		types: [
		],
		aliases: [
			"DHV ID",
			"Vendéens ID"
		]
	},
	{
		description: "identifier for a person on the online ''Dictionnaire des Wallons''",
		datatype: "external-id",
		id: "P6342",
		label: "Dictionnaire des Wallons ID",
		example: [
			3186284,
			16219315,
			1897963
		],
		types: [
		],
		aliases: [
			"DW ID"
		]
	},
	{
		description: "identifier in the Dictionnaire des auteurs luxembourgeois en ligne, that presents the life and work of authors who, since 1815, have participated in the literary life of Luxembourg",
		datatype: "external-id",
		id: "P4749",
		label: "Dictionnaire des auteurs luxembourgeois ID",
		example: [
			13103765,
			13103778
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an article in the Dictionnaire des Femmes de l'ancienne France",
		datatype: "external-id",
		id: "P7962",
		label: "Dictionnaire des femmes de l’ancienne France ID",
		example: [
			237726,
			93692,
			115738
		],
		types: [
		],
		aliases: [
			"SiefarWiki",
			"SiefarWikiEn"
		]
	},
	{
		description: "identifier for a Belgian painter on the Dictionnaire des peintres belges website",
		datatype: "external-id",
		id: "P4687",
		label: "Dictionnaire des peintres belges ID",
		example: [
			164712,
			5599
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the encyclopedia Dictionnaire du Jura",
		datatype: "external-id",
		id: "P1276",
		label: "Dictionnaire du Jura ID",
		example: [
			11425927
		],
		types: [
		],
		aliases: [
			"DIJU"
		]
	},
	{
		description: "identifier for an author in the fragment collection Die Fragmente der Vorsokratiker (5th edition)",
		datatype: "external-id",
		id: "P8163",
		label: "Diels-Kranz ID",
		example: [
			174353,
			10261,
			202001
		],
		types: [
		],
		aliases: [
			"DK ID",
			"DK"
		]
	},
	{
		description: "identifier of a place, in the Digital Atlas of Denmark's historical-administrative geography",
		datatype: "external-id",
		id: "P3614",
		label: "DigDag ID",
		example: [
			505000
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "Identifier of a Roman site, in the Digital Atlas of the Roman Empire",
		datatype: "external-id",
		id: "P1936",
		label: "Digital Atlas of the Roman Empire ID",
		example: [
			1361580,
			2844417,
			654470,
			2911166,
			233
		],
		types: [
		],
		aliases: [
			"DARE ID"
		]
	},
	{
		description: "property for Sanskrit lemma in IAST transliteration maintained by Digital Corpus of Sanskrit",
		datatype: "external-id",
		label: "Digital Corpus of Sanskrit ID",
		id: "P7572",
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID of corresponding entry in the DFD online dictionary of family names",
		datatype: "external-id",
		id: "P6597",
		label: "Digital Dictionary of Surnames in Germany ID",
		example: [
			8157228,
			12652033,
			420404,
			83384239
		],
		types: [
			"representing a unique identifier",
			"Wikidata name property"
		],
		aliases: [
			"DFD-ID",
			"DFD ID"
		]
	},
	{
		description: "identifier for a species on the Digital Flora of Central Africa website",
		datatype: "external-id",
		id: "P6115",
		label: "Digital Flora of Central Africa ID",
		example: [
			15453270,
			2834384,
			733398
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a Pyramid or other funeral site on Egypt’s Giza Plateau in the American Database Digital Giza",
		datatype: "external-id",
		id: "P7302",
		label: "Digital Giza ID",
		example: [
			208358
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a document in the Digital Library of the Caribbean",
		datatype: "external-id",
		id: "P8442",
		label: "Digital Library of the Caribbean ID",
		example: [
			97312077,
			97313253,
			97322755
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an ancient Roman from the Roman Republic, an online prosopographical research",
		datatype: "external-id",
		id: "P6863",
		label: "Digital Prosopography of the Roman Republic ID",
		example: [
			722098,
			353188,
			396971,
			1115859
		],
		types: [
		],
		aliases: [
			"DPRR ID"
		]
	},
	{
		description: "technologies  to control the use of digital content and devices after sale",
		datatype: "wikibase-item",
		id: "P1032",
		label: "Digital Rights Management system",
		example: [
			48854
		],
		types: [
			"for software"
		],
		aliases: [
			"DRM system",
			"copy protection system",
			"copy protection mechanism",
			"DRM mechanism"
		]
	},
	{
		description: "identifier for general information of a cyclone in South-West Pacific in Digital Typhoon",
		datatype: "external-id",
		id: "P5016",
		label: "Digital Typhoon cyclone ID",
		example: [
			29043505
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for general information of a typhoon in Digital Typhoon",
		datatype: "external-id",
		id: "P5015",
		label: "Digital Typhoon typhoon ID",
		example: [
			15136651
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person in the database of the Valencian Library, the regional library in the Land of Valencia, Spain",
		datatype: "external-id",
		id: "P3932",
		label: "Digital Valencian Library author ID",
		example: [
			219646,
			5682
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier on the Digitalnz.org website for videos, newspapers, maps, photographs, audio, artworks, and news reports that have been digitised in New Zealand",
		datatype: "external-id",
		id: "P7000",
		label: "DigitalNZ ID",
		example: [
			61646891,
			64995662,
			62942144
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author on the DBNL-website for Dutch language authors",
		datatype: "external-id",
		id: "P723",
		label: "Digitale Bibliotheek voor de Nederlandse Letteren author ID",
		example: [
			2359791,
			32957
		],
		types: [
		],
		aliases: [
			"Digitale Bibliotheek voor de Nederlandse Letteren identifier",
			"Digital Library for Dutch Literature identifier",
			"DBNL author ID"
		]
	},
	{
		description: "Identifier at DigitaltMuseum",
		datatype: "external-id",
		id: "P7847",
		label: "DigitaltMuseum ID",
		example: [
			18600103,
			94731610
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"DiMu",
			"DigitaltMuseum"
		]
	},
	{
		description: "unique identifier for a work in the Dimensions database",
		datatype: "external-id",
		id: "P6179",
		label: "Dimensions Publication ID",
		example: [
			55425812,
			58420606
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "unique identifier for a journal in the Dimensions database",
		datatype: "external-id",
		id: "P6180",
		label: "Dimensions Source ID",
		example: [
			180445,
			564954,
			7743547
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique identifier for an author in Dimensions",
		datatype: "external-id",
		id: "P6178",
		label: "Dimensions author ID",
		example: [
			19859634,
			58476906,
			43208265,
			48975668
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a scientific/research grant in Digital Science Dimensions, as reflected in SpringerNature SciGraph",
		datatype: "external-id",
		id: "P6854",
		label: "Dimensions grant ID",
		example: [
			63301829,
			55093910,
			27990087,
			55095510,
			63342051
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier on Dimensions.guide database",
		datatype: "external-id",
		id: "P6557",
		label: "Dimensions.guide ID",
		example: [
			11575,
			7368,
			244479
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of an Italian villa, palace, garden or park in the database Dimore Storiche Italiane",
		datatype: "external-id",
		id: "P6727",
		label: "Dimore Storiche Italiane ID",
		example: [
			3558890,
			4011776,
			4011896,
			126182
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a Mexican public library, in the National Network of Public Libraries website",
		datatype: "external-id",
		id: "P7342",
		label: "Dirección General de Bibliotecas ID",
		example: [
			34249694,
			34232891,
			6294156
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "airport code for Mexico",
		datatype: "external-id",
		id: "P5746",
		label: "Directorate General of Civil Aeronautics (Mexico) code",
		example: [
			860559,
			20452293,
			2593750
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "\"Directorio Legislativo\" is a well know NGO in Argentina who has been publishing for the last ten years a book (and now online) with information about every deputy in the National Congress.",
		datatype: "external-id",
		id: "P6585",
		label: "Directorio Legislativo ID",
		example: [
			2429045,
			21614815,
			185107
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a museum on the Directorio de Museos y Colecciones de España website",
		datatype: "external-id",
		id: "P5763",
		label: "Directorio de Museos y Colecciones de España ID",
		example: [
			31281030,
			12265359,
			861252
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "biographical note on Afrocuban Women",
		datatype: "external-id",
		id: "P8380",
		label: "Directory of Afrocubanas ID",
		example: [
			11172,
			4583027,
			3296479
		],
		types: [
		],
		aliases: [
			"Directorio de Afrocubanas"
		]
	},
	{
		description: "identifier of a Czech publisher, in the Czech National Library database",
		datatype: "external-id",
		id: "P4840",
		label: "Directory of Czech publishers ID",
		example: [
			10855553
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"NAK"
		]
	},
	{
		description: "Maître d'art (Master of Art) is a title awarded for life by the French Ministry of Culture",
		datatype: "external-id",
		id: "P7957",
		label: "Directory of Maîtres d'art",
		example: [
			28152550,
			2854167,
			3082287,
			3085169,
			84833062
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Maître d'art ID"
		]
	},
	{
		description: "ISSN identifier of a journal in the Directory of Open Access Journals. When statements with this property need correcting, property \"ISSN\" (P236) are likely to be wrong as well",
		datatype: "external-id",
		id: "P5115",
		label: "Directory of Open Access Journals ID",
		example: [
			3153277,
			135122,
			1321858
		],
		types: [
		],
		aliases: [
			"DOAJ ID"
		]
	},
	{
		description: "identifier for a band or person in the Discogs database",
		datatype: "external-id",
		id: "P1953",
		label: "Discogs artist ID",
		example: [
			2306,
			383541
		],
		types: [
		],
		aliases: [
			"Discogs band ID"
		]
	},
	{
		description: "identifier for a musical composition in Discogs",
		datatype: "external-id",
		id: "P6080",
		label: "Discogs composition ID",
		example: [
			1886329,
			57903097
		],
		types: [
		],
		aliases: [
			"Discogs work ID",
			"composition ID (Discogs)",
			"work ID (Discogs)",
			"Discogs song ID",
			"song ID (Discogs)"
		]
	},
	{
		description: "identifier for a record label, studio or series in the Discogs database",
		datatype: "external-id",
		id: "P1955",
		label: "Discogs label ID",
		example: [
			1324712
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a musical work in the Discogs database",
		datatype: "external-id",
		id: "P1954",
		label: "Discogs master ID",
		example: [
			150901,
			644326
		],
		types: [
		],
		aliases: [
			"Discogs release group ID",
			"master ID (Discogs)",
			"release group ID (Discogs)",
			"Discogs album ID",
			"Discogs single ID",
			"Discogs EP ID",
			"album ID (Discogs)",
			"EP ID (Discogs)",
			"single ID (Discogs)"
		]
	},
	{
		description: "identifier for a musical work (release) in the Discogs database, if there is no master ID (P1954)",
		datatype: "external-id",
		id: "P2206",
		label: "Discogs release ID",
		example: [
			202698
		],
		types: [
		],
		aliases: [
			"release ID (Discogs)"
		]
	},
	{
		description: "identifier for a music track in Discogs",
		datatype: "external-id",
		id: "P6079",
		label: "Discogs track ID",
		example: [
			56085788,
			55064464
		],
		types: [
		],
		aliases: [
			"track ID (Discogs)",
			"Discogs recording ID",
			"recording ID (Discogs)"
		]
	},
	{
		description: "identifier for a game available on the Discord Store",
		datatype: "external-id",
		id: "P6229",
		label: "Discord Store game SKU",
		example: [
			48964876,
			3647935,
			4308783
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Disease Ontology database",
		datatype: "external-id",
		id: "P699",
		label: "Disease Ontology ID",
		example: [
			938205
		],
		types: [
			"related to medicine",
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier sourced on the Diseases Database",
		datatype: "external-id",
		id: "P557",
		label: "DiseasesDB",
		example: [
			12152,
			12192
		],
		types: [
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "ID of article in online version of Disney A to Z",
		datatype: "external-id",
		id: "P6181",
		label: "Disney A to Z ID",
		example: [
			11934,
			336424,
			322328,
			24832112
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"d23"
		]
	},
	{
		description: "identifier for a film on Disney+",
		datatype: "external-id",
		id: "P7595",
		label: "Disney+ movie ID",
		example: [
			134430,
			171048,
			192724,
			17738
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Disney Plus movie ID",
			"Disney+ film ID",
			"Disney Plus film ID"
		]
	},
	{
		description: "identifier for television/web series on Disney+",
		datatype: "external-id",
		id: "P7596",
		label: "Disney+ series ID",
		example: [
			886,
			56876444,
			1070749
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Disney+ TV series ID",
			"Disney Plus TV series ID",
			"Disney Plus series ID"
		]
	},
	{
		description: "identifier for an operating system at DistroWatch.com",
		datatype: "external-id",
		id: "P3112",
		label: "DistroWatch ID",
		example: [
			7715973,
			58436,
			34215
		],
		types: [
			"for software",
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the Dizionario Biografico dei Protestanti in Italia",
		datatype: "external-id",
		id: "P8509",
		label: "Dizionario Biografico dei Protestanti in Italia ID",
		example: [
			97064100,
			72085245
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the Dizionario biografico dei Friulani",
		datatype: "external-id",
		id: "P7203",
		label: "Dizionario biografico dei Friulani ID",
		example: [
			1938259,
			3752204,
			36834676,
			3958519
		],
		types: [
		],
		aliases: [
			"DBF ID"
		]
	},
	{
		description: "identifier for an artist on Djshop music site",
		datatype: "external-id",
		id: "P6896",
		label: "Djshop artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "stable identifying number for hills in the Database of British and Irish Hills",
		datatype: "external-id",
		id: "P6515",
		label: "DoBIH Number",
		example: [
			104674,
			603956,
			3397984
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an artist in the Database of Modern Exhibitions (1905-1915)",
		datatype: "external-id",
		id: "P7944",
		label: "DoME artist ID",
		example: [
			35548,
			2381804,
			463978
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an exhibition in the Database of Modern Exhibitions (1905-1915)",
		datatype: "external-id",
		id: "P8185",
		label: "DoME exhibition ID",
		example: [
			28860131,
			688909,
			3610454
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an entry in the online dictionary of Polish language (pl Dobry słownik)",
		datatype: "external-id",
		label: "Dobry słownik ID",
		id: "P5793",
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an article in the German section of the DocCheck wiki",
		datatype: "external-id",
		id: "P3292",
		label: "DocCheck Flexikon De ID",
		example: [
			5298800,
			12152
		],
		types: [
			"related to medicine",
			"representing a unique identifier"
		],
		aliases: [
			"DocCheck De ID"
		]
	},
	{
		description: "identifier for an article in the English section of DocCheck Flexikon wiki",
		datatype: "external-id",
		id: "P3291",
		label: "DocCheck Flexikon En ID",
		example: [
			1407120,
			12206
		],
		types: [
			"related to medicine",
			"representing a unique identifier"
		],
		aliases: [
			"DocCheck En ID"
		]
	},
	{
		description: "identifier for a lawyer on Doctrine",
		datatype: "external-id",
		id: "P6350",
		label: "Doctrine ID",
		example: [
			57773166,
			329,
			33092808
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a French court decision on Doctrine",
		datatype: "external-id",
		id: "P7657",
		label: "Doctrine court decision ID",
		example: [
			60372636,
			62057801,
			76363802
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author in Documenta Catholica Omnia digital library",
		datatype: "external-id",
		id: "P7038",
		label: "Documenta Catholica Omnia author ID",
		example: [
			1121669,
			849117,
			439491
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Dodis database (Diplomatic Documents of Switzerland 1945-1969), see Q661051",
		datatype: "external-id",
		id: "P701",
		label: "Dodis ID",
		example: [
			123497,
			347
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Dodis"
		]
	},
	{
		description: "identifier of a Dominican monk on the online ''Dictionnaire biographique des frères prêcheurs''",
		datatype: "external-id",
		id: "P4943",
		label: "Dominicains ID",
		example: [
			50323784,
			3170358,
			50329766,
			50329779,
			50329789
		],
		types: [
		],
		aliases: [
			"Dictionnaire biographique des frères prêcheurs ID"
		]
	},
	{
		description: "identifier for an artwork or other object on the Dordrechts Museum website",
		datatype: "external-id",
		id: "P5265",
		label: "Dordrechts Museum artwork ID",
		example: [
			21155135,
			24279024
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an entry in the online version of the Polish Dictionary by Witold Doroszewski (Pl Słownik języka polskiego)",
		datatype: "external-id",
		label: "Doroszewski Online ID",
		id: "P5497",
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person somehow connected to Fyodor Dostoyevsky in the website in fedordostoevsky.ru",
		datatype: "external-id",
		id: "P8643",
		label: "Dostoyevsky and His Entourage ID",
		example: [
			4054209,
			21089172,
			4187858,
			1984784
		],
		types: [
		],
		aliases: [
			"fedordostoevsky.ru ID"
		]
	},
	{
		description: "identifier for a celebrity at the Douban Read website",
		datatype: "external-id",
		id: "P6447",
		label: "Douban Read author ID",
		example: [
			26470186,
			8941041
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a book at the website Douban Read",
		datatype: "external-id",
		id: "P6448",
		label: "Douban Read eBook ID",
		example: [
			61052818,
			61052848,
			61053360
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author at the Douban book website",
		datatype: "external-id",
		id: "P6441",
		label: "Douban author ID",
		example: [
			4604,
			692
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a book at the website Douban",
		datatype: "external-id",
		id: "P6442",
		label: "Douban book ID",
		example: [
			14422206,
			428213,
			61052273
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a theatrical production at the website Douban",
		datatype: "external-id",
		id: "P6443",
		label: "Douban drama ID",
		example: [
			30947657,
			310516
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film (movie) at the website Douban",
		datatype: "external-id",
		id: "P4529",
		label: "Douban film ID",
		example: [
			172241,
			18342910,
			184843
		],
		types: [
		],
		aliases: [
			"Douban Subject ID",
			"Douban ID",
			"Douban Film ID",
			"Douban Movie ID",
			"https://movie.douban.com/subject/"
		]
	},
	{
		description: "identifier for a video game at the website Douban",
		datatype: "external-id",
		id: "P6444",
		label: "Douban game ID",
		example: [
			173626,
			16529841
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a celebrity at the Douban movie website",
		datatype: "external-id",
		id: "P5284",
		label: "Douban movie celebrity ID",
		example: [
			36970,
			80966
		],
		types: [
		],
		aliases: [
			"douban.com person ID",
			"Douban person ID"
		]
	},
	{
		description: "identifier for an album at the website Douban",
		datatype: "external-id",
		id: "P6445",
		label: "Douban music ID",
		example: [
			18699333,
			30951201
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a musician at the Douban music website",
		datatype: "external-id",
		id: "P6446",
		label: "Douban musician ID",
		example: [
			1689353,
			38257
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "domain name of Douban site written in Latin alphabet",
		datatype: "external-id",
		id: "P6449",
		label: "Douban site name",
		example: [
			17163973,
			61053441,
			258693
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "domain name of Douban users' personal pages",
		datatype: "external-id",
		id: "P6450",
		label: "Douban username",
		example: [
			558744,
			9375395
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "username on Douyin",
		datatype: "external-id",
		id: "P7120",
		label: "Douyin ID",
		example: [
			18663212,
			9370539,
			2568122
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a movie, book, television show or album on Dove.org",
		datatype: "external-id",
		id: "P7236",
		label: "Dove.org work ID",
		example: [
			15240679,
			21869379,
			18517638,
			28561715,
			55439830,
			18722273,
			27188178,
			23781155,
			23781129,
			23796643
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "unambiguous systematic identifier scheme for mathematical knots",
		datatype: "math",
		id: "P8416",
		label: "Dowker-Thistlethwaite name",
		example: [
			1188344,
			168620,
			168697,
			4544970,
			94806552
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "descriptive property of mathematical knots, also known as Dowker notation",
		datatype: "math",
		id: "P8378",
		label: "Dowker-Thistlethwaite notation",
		example: [
			1188344,
			168620,
			4544970
		],
		types: [
		],
		aliases: [
			"Dowker notation"
		]
	},
	{
		description: "identifier for a webpage on the Downdetector website",
		datatype: "external-id",
		id: "P7306",
		label: "Downdetector ID",
		example: [
			5455414,
			739084,
			52
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Downdetector identifier"
		]
	},
	{
		description: "identifier for a basketball player at draftexpress.com",
		datatype: "external-id",
		id: "P3533",
		label: "DraftExpress ID",
		example: [
			3849644,
			3817011
		],
		types: [
		],
		aliases: [
			"draftexpress.com ID"
		]
	},
	{
		description: "page on the Dreadnought Project website",
		datatype: "external-id",
		id: "P4589",
		label: "Dreadnought Project page",
		example: [
			1565048
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a driver in the Driver Database",
		datatype: "external-id",
		id: "P3684",
		label: "Driver Database driver ID",
		example: [
			171294,
			445419
		],
		types: [
		],
		aliases: [
			"Driver Database ID"
		]
	},
	{
		description: "identifier in the database of small-scale public artwork in the Czech Republic",
		datatype: "external-id",
		id: "P6736",
		label: "Drobné památky ID",
		example: [
			60673806,
			38135770,
			38037068,
			29169058
		],
		types: [
			"for items about works"
		],
		aliases: [
			"Drobne pamatky ID"
		]
	},
	{
		description: "identifier for an artist on the Drouot website",
		datatype: "external-id",
		id: "P5309",
		label: "Drouot artist ID",
		example: [
			16211338,
			39931
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the bioinformatics and cheminformatics database from the University of Alberta",
		datatype: "external-id",
		id: "P715",
		label: "DrugBank ID",
		example: [
			199678,
			95793548
		],
		types: [
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a lexeme in duden.de",
		datatype: "external-id",
		label: "Duden ID",
		id: "P8376",
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an interred person in the database of the Dutch Cemetery in Chinsurah, West Bengal",
		datatype: "external-id",
		id: "P4458",
		label: "Dutch Cemetery in Chinsurah person ID",
		example: [
			29045304,
			29045566
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on Dutch Charts music site",
		datatype: "external-id",
		id: "P6911",
		label: "Dutch Charts artist ID",
		example: [
			383541,
			313453,
			200577,
			40715
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "biographical data about instrument makers that were active in the Netherlands",
		datatype: "external-id",
		id: "P6582",
		label: "Dutch Instrument Makers ID",
		example: [
			6353,
			362796,
			1995355
		],
		types: [
		],
		aliases: [
			"Scientific Instrument Makers in the Netherlands ID"
		]
	},
	{
		description: "identifier for a person on the website of the Dutch Senate",
		datatype: "external-id",
		id: "P1959",
		label: "Dutch Senate person ID",
		example: [
			20113636
		],
		types: [
		],
		aliases: [
			"DSP ID"
		]
	},
	{
		description: "identifier for former buildings in the Netherlands, connecting them to images in public collections",
		datatype: "external-id",
		id: "P4358",
		label: "Dutch lost building register ID",
		example: [
			2199094
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Dxomark article identifier for smartphones and cameras",
		datatype: "external-id",
		id: "P5906",
		label: "DxOMark ID",
		example: [
			54747245,
			56368140,
			41605741
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"dxo mark id"
		]
	},
	{
		description: "identifier for a player at the DynamoMania.com",
		datatype: "external-id",
		id: "P7395",
		label: "DynamoMania.com player ID",
		example: [
			7818424,
			370119,
			223598
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon in the Swedish Taxonomic Database",
		datatype: "external-id",
		id: "P1939",
		label: "Dyntaxa ID",
		example: [
			1952486
		],
		types: [
		],
		aliases: [
			"Swedish Taxonomic Database ID",
			"Swedish Species Information Centre"
		]
	},
	{
		description: "number for food additives that are legal in the European Union",
		datatype: "external-id",
		id: "P628",
		label: "E number",
		example: [
			312266,
			158348
		],
		types: [
			"related to chemistry",
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of an epigraphic concept in the Europeana Network of Ancient Greek and Latin Epigraphy (EAGLE) vocabulary",
		datatype: "external-id",
		id: "P1900",
		label: "EAGLE id",
		example: [
			13581079,
			335239,
			681337,
			3567529,
			484692,
			158091,
			177980
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "the Enzyme Commission (EC)-based accepted name of any enzyme classifications of the protein or RNA molecule",
		datatype: "wikibase-item",
		id: "P660",
		label: "EC enzyme classification",
		example: [
			13561329,
			1476411
		],
		types: [
			"related to chemistry"
		],
		aliases: [
			"Enzyme Commission classification name"
		]
	},
	{
		description: "classification scheme for enzymes",
		datatype: "string",
		id: "P591",
		label: "EC enzyme number",
		example: [
			7839871,
			410754,
			409458
		],
		types: [
		],
		aliases: [
			"Enzyme Commission number"
		]
	},
	{
		description: "identifier for a chemical compound per EINECS or ELINCS",
		datatype: "external-id",
		id: "P232",
		label: "EC number",
		example: [
			161210
		],
		types: [
		],
		aliases: [
			"EC No.",
			"EINECS No.",
			"EC#",
			"European Community number"
		]
	},
	{
		description: "identifier for a person, in the ECARTICO biographical database of the Dutch and Flemish Golden Ages",
		datatype: "external-id",
		id: "P2915",
		label: "ECARTICO person ID",
		example: [
			24452339,
			5598
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a chemical substance used by the European Chemicals Agency (ECHA)",
		datatype: "external-id",
		id: "P2566",
		label: "ECHA InfoCard ID",
		example: [
			418492
		],
		types: [
		],
		aliases: [
			"InfoCard ID"
		]
	},
	{
		description: "the identifier maintained by Election Commission of India for Lok Sabha constituencies",
		datatype: "external-id",
		id: "P6871",
		label: "ECI Lok Sabha constituency code",
		example: [
			3630014,
			3632585,
			3530684
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon on the United States' 'Environmental Conservation Online System' website",
		datatype: "external-id",
		id: "P6030",
		label: "ECOS ID",
		example: [
			15553734,
			1193048,
			10822296
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of the EDIT16 catalogue about authors cited in 16th-century books or editions",
		datatype: "external-id",
		id: "P5492",
		label: "EDIT16 catalogue author ID",
		example: [
			3940253,
			34417,
			1377970
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of the EDIT16 catalogue about 16th-century printers",
		datatype: "external-id",
		id: "P5493",
		label: "EDIT16 catalogue printer ID",
		example: [
			213220,
			941151,
			338489
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Ukrainian state registry legal entity identifier",
		datatype: "external-id",
		id: "P3125",
		label: "EDRPOU code",
		example: [
			728513,
			694219
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a company at the Israeli movie database EDb",
		datatype: "external-id",
		id: "P5576",
		label: "EDb company ID",
		example: [
			55705977,
			25490973,
			822314,
			186941,
			907311
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a movie at the Israeli movie database EDb",
		datatype: "external-id",
		id: "P3141",
		label: "EDb film ID",
		example: [
			2836922,
			595
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person at the Israeli movie database EDb",
		datatype: "external-id",
		id: "P3142",
		label: "EDb person ID",
		example: [
			474262
		],
		types: [
		],
		aliases: [
			"edb.co.il person ID"
		]
	},
	{
		description: "breed identification number per the EE list of the breeds of fancy pigeons (ELFP)",
		datatype: "external-id",
		id: "P303",
		label: "EE breed number",
		example: [
			5219796,
			824567
		],
		types: [
		],
		aliases: [
			"breed number"
		]
	},
	{
		description: "identifier on the ''Encyclopedia of Evolutionary Psychological Science''",
		datatype: "external-id",
		id: "P7738",
		label: "EEPS ID",
		example: [
			38161518,
			38404,
			1035
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for film or television series in the Estonian Film Database",
		datatype: "external-id",
		id: "P7892",
		label: "EFIS film ID",
		example: [
			31280685,
			20127610,
			31280577
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film festival in the Estonian Film Database",
		datatype: "external-id",
		id: "P7873",
		label: "EFIS film festival ID",
		example: [
			4974827,
			5909927,
			61392399,
			3046725
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a filmfirm on Estonian Film Database",
		datatype: "external-id",
		id: "P7891",
		label: "EFIS filmfirm ID",
		example: [
			4732231,
			509492,
			61397004
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"EFIS filmmaker ID"
		]
	},
	{
		description: "identifier for a person in the Estonian Film Database",
		datatype: "external-id",
		id: "P7874",
		label: "EFIS person ID",
		example: [
			12369913,
			16404257,
			1102288
		],
		types: [
		],
		aliases: [
			"Estonian Film Database person ID"
		]
	},
	{
		description: "identifier in Bibliotheca Alexandrina",
		datatype: "external-id",
		id: "P1309",
		label: "EGAXA ID",
		example: [
			23,
			981905,
			45936,
			7176
		],
		types: [
		],
		aliases: [
			"EGAXA identifier"
		]
	},
	{
		description: "rating given by EGF (European Go Federation) to European go players",
		datatype: "quantity",
		id: "P4105",
		label: "EGF rating",
		example: [
			3038855
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a monument in the Unified state register of objects of cultural heritage (monuments of history and culture) of the peoples of the Russian Federation",
		datatype: "external-id",
		id: "P5381",
		label: "EGROKN ID",
		example: [
			4222420,
			4204390,
			11689408
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Russian cultural heritage register ID"
		]
	},
	{
		description: "identifier for an article in the EH.Net Encyclopedia of Economic and Business History",
		datatype: "external-id",
		id: "P7996",
		label: "EH.Net Encyclopedia of Economic and Business History ID",
		example: [
			161081,
			648404,
			157188
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "Estonian Administrative and Settlement Classification",
		datatype: "external-id",
		id: "P1140",
		label: "EHAK id",
		example: [
			213740
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier with digits to describe of French commune by EHESS",
		datatype: "external-id",
		id: "P8422",
		label: "EHESS ID of a French commune",
		example: [
			1082645,
			843587
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifer of a project either funded by or planned to be funded by the European Investment Bank",
		datatype: "external-id",
		id: "P8528",
		label: "EIB project ID",
		example: [
			98090171,
			781200,
			98094431
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "Identifier for a film or television work, edit or manifestation, in the Entertainment Identifier Registry",
		datatype: "external-id",
		id: "P2704",
		label: "EIDR identifier",
		example: [
			180279,
			886
		],
		types: [
		],
		aliases: [
			"EIDR ID"
		]
	},
	{
		description: "category in the Japanese film rating system (add EIRIN number with qualifier P2676)",
		datatype: "wikibase-item",
		id: "P2756",
		label: "EIRIN film rating",
		example: [
			11361965,
			20058691
		],
		types: [
		],
		aliases: [
			"EIRIN film rating category"
		]
	},
	{
		description: "identifier for an artwork in the Entartete Kunst database of the Freie Universität Berlin",
		datatype: "external-id",
		id: "P4627",
		label: "EK number",
		example: [
			30070932
		],
		types: [
		],
		aliases: [
			"Entartete Kunst number"
		]
	},
	{
		description: "identifier for a resource pertaining to a language in the namesake endangered language digital repository",
		datatype: "external-id",
		id: "P8043",
		label: "ELAR ID",
		example: [
			56417,
			56804,
			36298
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "Identifier assigned by the ELNET consortium of Estonian libraries. Format: \"a\", 7 digits, \"x\" or another digit.",
		datatype: "external-id",
		id: "P6394",
		label: "ELNET ID",
		example: [
			24545716,
			60606534,
			60606544
		],
		types: [
		],
		aliases: [
			"ERRR ID"
		]
	},
	{
		description: "identifier for administrative regions of Greece by the Greek Statistical Authority (starting 2010)",
		datatype: "external-id",
		id: "P1116",
		label: "ELSTAT geographical code",
		example: [
			17151,
			12282294,
			187352
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a location in the Early Modern Letters Online database maintained by the University of Oxford",
		datatype: "external-id",
		id: "P4672",
		label: "EMLO location ID",
		example: [
			64,
			12191
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Early Modern Letters Online project run by the Bodleian Library",
		datatype: "external-id",
		id: "P1802",
		label: "EMLO person ID",
		example: [
			39599,
			12735
		],
		types: [
		],
		aliases: [
			"Early Modern Letters Online identifier",
			"EMLO person identifier"
		]
	},
	{
		description: "ID for argentinian athletes from the Ente Nacional de Alto Rendimiento Deportivo (High Sport Performance National Entity)",
		datatype: "external-id",
		id: "P3958",
		label: "ENARD athlete ID",
		example: [
			936924
		],
		types: [
			"related to sport"
		],
		aliases: [
			"Ente Nacional de Alto Rendimiento Deportivo athlete ID"
		]
	},
	{
		description: "European Vessel Identification Number for ships capable of navigating on inland European waters",
		datatype: "string",
		id: "P5910",
		label: "ENI number",
		example: [
			48754932,
			1851997,
			6383726
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a rugby player on the European Professional Club Rugby website",
		datatype: "external-id",
		id: "P3666",
		label: "EPCR player ID",
		example: [
			3568280,
			465470
		],
		types: [
		],
		aliases: [
			"European Professional Club Rugby ID"
		]
	},
	{
		description: "identifier of a researcher on the online prosopographical dictionary of the EPHE",
		datatype: "external-id",
		id: "P4890",
		label: "EPHE ID",
		example: [
			3124203,
			1285501,
			3164722
		],
		types: [
		],
		aliases: [
			"École pratique des hautes études ID",
			"dictionnaire prosopographique de l'EPHE ID"
		]
	},
	{
		description: "identifier for a taxon in the EPPO Global Database",
		datatype: "external-id",
		id: "P3031",
		label: "EPPO Code",
		example: [
			45262,
			11575
		],
		types: [
		],
		aliases: [
			"Bayer code"
		]
	},
	{
		description: "identifier for coordinate reference systems per European Petroleum Survey Group Geodetic Parameter Dataset",
		datatype: "external-id",
		id: "P1338",
		label: "EPSG CRS",
		example: [
			10659701
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for authors whose articles are published in Economic and Political Weekly",
		datatype: "external-id",
		id: "P7183",
		label: "EPW author ID",
		example: [
			132489,
			3347967,
			2744161
		],
		types: [
		],
		aliases: [
			"Economic and Political Weekly author ID"
		]
	},
	{
		description: "identifier for academic journals",
		datatype: "external-id",
		id: "P1058",
		label: "ERA Journal ID",
		example: [
			180445,
			26197
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a term in the Education Resources Information Center (ERIC) Thesaurus",
		datatype: "external-id",
		id: "P8539",
		label: "ERIC Thesaurus ID",
		example: [
			64219648,
			4115119,
			25304922,
			555097
		],
		types: [
		],
		aliases: [
			"Education Resources Information Center Thesaurus ID"
		]
	},
	{
		description: "ID of an article or book in ERIC",
		datatype: "external-id",
		id: "P7409",
		label: "ERIC publication ID",
		example: [
			61781625,
			69586303,
			69586902
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a journal in ERIH PLUS",
		datatype: "external-id",
		id: "P3434",
		label: "ERIH PLUS ID",
		example: [
			315571,
			6107020,
			7318986
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a sportsperson in the Estonian sportsbiographical lexicon",
		datatype: "external-id",
		id: "P4042",
		label: "ESBL athlete ID",
		example: [
			1776,
			1395659,
			20022561
		],
		types: [
			"related to sport"
		],
		aliases: [
			"Eesti Spordi Biograafiline Leksikon athlete ID"
		]
	},
	{
		description: "identifier for an occupation, in the European multilingual database ESCO v1",
		datatype: "external-id",
		id: "P4652",
		label: "ESCO Occupation ID",
		example: [
			1027186
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ESCO v1 Occupation ID"
		]
	},
	{
		description: "identifier for a Skill, in the European multilingual database ESCO v1",
		datatype: "external-id",
		id: "P4644",
		label: "ESCO skill ID",
		example: [
			1496938
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ESCO v1 skill ID"
		]
	},
	{
		description: "identifier of a member of the French Economic, Social and Environmental Council",
		datatype: "external-id",
		id: "P4126",
		label: "ESEC person ID",
		example: [
			275695
		],
		types: [
		],
		aliases: [
			"CESE ID"
		]
	},
	{
		description: "ID for a Major League Baseball player at ESPN.com",
		datatype: "external-id",
		id: "P3571",
		label: "ESPN.com MLB player ID",
		example: [
			2964906
		],
		types: [
		],
		aliases: [
			"ESPN MLB player ID"
		]
	},
	{
		description: "identifier for a National Basketball Association player at ESPN.com",
		datatype: "external-id",
		id: "P3685",
		label: "ESPN.com NBA player ID",
		example: [
			212421,
			380018
		],
		types: [
		],
		aliases: [
			"ESPN NBA player ID"
		]
	},
	{
		description: "identifier for a National Football League player at ESPN.com",
		datatype: "external-id",
		id: "P3686",
		label: "ESPN.com NFL player ID",
		example: [
			936375,
			7781485
		],
		types: [
		],
		aliases: [
			"ESPN NFL player ID"
		]
	},
	{
		description: "identifier for a National Hockey League player at ESPN.com",
		datatype: "external-id",
		id: "P3687",
		label: "ESPN.com NHL player ID",
		example: [
			16228484,
			312642
		],
		types: [
		],
		aliases: [
			"ESPN NHL player ID"
		]
	},
	{
		description: "identifier for a college football player at ESPN.com",
		datatype: "external-id",
		id: "P7262",
		label: "ESPN.com college football player ID",
		example: [
			42225228,
			47138769,
			42301562
		],
		types: [
			"representing a unique identifier",
			"related to sport"
		],
		aliases: [
			"ESPN college football player ID"
		]
	},
	{
		description: "identifier for an association football (soccer) player at ESPNFC.com",
		datatype: "external-id",
		id: "P3681",
		label: "ESPNFC.com player ID",
		example: [
			1249859,
			554800
		],
		types: [
		],
		aliases: [
			"ESPN FC player ID"
		]
	},
	{
		description: "ID of cricket ground at ESPNcricinfo",
		datatype: "external-id",
		id: "P3572",
		label: "ESPNcricinfo playing ground ID",
		example: [
			7136359
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a cricket player at ESPNcricinfo.com",
		datatype: "external-id",
		id: "P2697",
		label: "ESPNcricinfo.com player ID",
		example: [
			22958463,
			600090
		],
		types: [
		],
		aliases: [
			"Cricinfo player ID",
			"ESPNcricinfo player ID"
		]
	},
	{
		description: "identifier for an international rugby union player, from ESPN.co.uk or ESPNscrum.com",
		datatype: "external-id",
		id: "P858",
		label: "ESPNscrum player ID",
		example: [
			318920
		],
		types: [
		],
		aliases: [
			"ESPN SCRUM ID"
		]
	},
	{
		description: "unique railway station/operation point code used in USSR and later in former USSR countries",
		datatype: "external-id",
		id: "P2815",
		label: "ESR station code",
		example: [
			1989694,
			1367269
		],
		types: [
		],
		aliases: [
			"former USSR station code"
		]
	},
	{
		description: "North American video game content rating",
		datatype: "wikibase-item",
		id: "P852",
		label: "ESRB rating",
		example: [
			11168,
			83265,
			1150928,
			843131,
			18325072,
			2842078
		],
		types: [
		],
		aliases: [
			"Entertainment Software Rating Board rating",
			"ESRB"
		]
	},
	{
		description: "identifier for a video game on ESRB's official website",
		datatype: "external-id",
		id: "P8303",
		label: "ESRB video game ID",
		example: [
			3182559,
			1974968
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the English Short Title Catalogue",
		datatype: "external-id",
		id: "P3939",
		label: "ESTC citation number",
		example: [
			27308080
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "an administrative 4-digit code that Educational Testing Service uses to uniquely identify institutions programs",
		datatype: "external-id",
		id: "P6653",
		label: "ETS Designated Institution code",
		example: [
			5134090,
			2882628,
			149990,
			41506,
			15570
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"DI Code"
		]
	},
	{
		description: "identifier of a doctoral thesis, in the British Library's EThOS database",
		datatype: "external-id",
		id: "P4536",
		label: "EThOS thesis ID",
		example: [
			42307084,
			28971627
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of organization in EU's Framework Programs for Research",
		datatype: "external-id",
		id: "P5785",
		label: "EU Research participant ID",
		example: [
			7095072,
			1065414
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"EU PIC",
			"PIC"
		]
	},
	{
		description: "unique code for an EU River Basin District",
		datatype: "external-id",
		id: "P2965",
		label: "EU River Basin District code",
		example: [
			1434301,
			25344232
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"euRBDCode",
			"RBDCode"
		]
	},
	{
		description: "unique EU identifier for a surface water body",
		datatype: "external-id",
		id: "P2856",
		label: "EU Surface Water Body Code",
		example: [
			3424558,
			1723437
		],
		types: [
		],
		aliases: [
			"EU_CD",
			"SurfaceWaterBodyCode",
			"Surface Water Body Code",
			"WFD Waterbody ID",
			"Water Framework Directive Waterbody ID"
		]
	},
	{
		description: "identity code for an organisation, in the transparency register of the European Union",
		datatype: "external-id",
		id: "P2657",
		label: "EU Transparency Register ID",
		example: [
			14754981,
			4005583
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "EU VAT number",
		datatype: "external-id",
		id: "P3608",
		label: "EU VAT number",
		example: [
			1540297,
			1418,
			7095072,
			621429
		],
		types: [
		],
		aliases: [
			"VAT identification number",
			"VAT ID"
		]
	},
	{
		description: "Record Control Number for project under EU Framework Programmes for Research and Technological Development)",
		datatype: "external-id",
		id: "P5755",
		label: "EU project RCN",
		example: [
			21755493,
			25106053,
			25106053,
			25106053
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"CORDIS RCN",
			"RCN",
			"Record Control Number"
		]
	},
	{
		description: "identifier for an association football club on the EU-Football.info website",
		datatype: "external-id",
		id: "P7854",
		label: "EU-Football.info club ID",
		example: [
			18656,
			8682,
			321061,
			757110
		],
		types: [
		],
		aliases: [
			"EU-Football.info team ID"
		]
	},
	{
		description: "identifier for an association football manager on the EU-Football.info website",
		datatype: "external-id",
		id: "P7463",
		label: "EU-Football.info manager ID",
		example: [
			316026,
			324484,
			489107
		],
		types: [
		],
		aliases: [
			"EU-Football.info coach ID"
		]
	},
	{
		description: "identifier for an association football match on the EU-Football.info website",
		datatype: "external-id",
		id: "P7492",
		label: "EU-Football.info match ID",
		example: [
			48804003,
			18347005,
			1067311,
			4493733
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"EU-Football.info game ID"
		]
	},
	{
		description: "identifier for an association football player on the EU-Football.info website",
		datatype: "external-id",
		id: "P3726",
		label: "EU-Football.info player ID",
		example: [
			704783,
			1467843
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an association football referee on the EU-Football.info website",
		datatype: "external-id",
		id: "P7435",
		label: "EU-Football.info referee ID",
		example: [
			927651,
			315246,
			73062
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a association football (soccer) stadium in the EU-Football.info database",
		datatype: "external-id",
		id: "P8320",
		label: "EU-Football.info stadium ID",
		example: [
			164027,
			180479
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an Italian protected natural area in the official list of protected natural areas (EUAP - elenco ufficiale delle aree naturali protette)",
		datatype: "external-id",
		id: "P4800",
		label: "EUAP ID",
		example: [
			1891711
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a book (edition) in the Egyptian union catalog",
		datatype: "external-id",
		id: "P1084",
		label: "EUL editions",
		example: [
			17300349
		],
		types: [
		],
		aliases: [
			"EUL ID"
		]
	},
	{
		description: "identifier for a habitats on the European Nature Information System website (EUNIS)",
		datatype: "external-id",
		id: "P6681",
		label: "EUNIS ID for habitats",
		example: [
			61748654,
			61744768,
			61748391
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a species on the European Nature Information System website",
		datatype: "external-id",
		id: "P6177",
		label: "EUNIS ID for species",
		example: [
			233684,
			156918,
			36341
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the European Theatre Architecture (EUTA) database",
		datatype: "external-id",
		id: "P4534",
		label: "EUTA person ID",
		example: [
			113014
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a theatre in the European Theatre Architecture (EUTA) database",
		datatype: "external-id",
		id: "P4535",
		label: "EUTA theatre ID",
		example: [
			12039409
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a scientific journal in the Electronic Journals Library bibliographic database",
		datatype: "external-id",
		id: "P8089",
		label: "EZB ID",
		example: [
			89021577,
			15750360,
			88966995
		],
		types: [
		],
		aliases: [
			"Elektronische Zeitschriftenbibliothek ID"
		]
	},
	{
		description: "identifier for a person by Early Birds of Aviation, at www.earlyaviators.com",
		datatype: "external-id",
		id: "P4008",
		label: "Early Aviators people ID",
		example: [
			436102
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon on the Echinoid Directory website",
		datatype: "external-id",
		id: "P6042",
		label: "Echinoid Directory ID",
		example: [
			57687669,
			57687710,
			57687745
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a plant used as an agricultural crop in the Ecocrop database",
		datatype: "external-id",
		id: "P4753",
		label: "Ecocrop ID",
		example: [
			1493
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for the abstract of the diploma thesis of an archivist paleographer (graduate student) at the Ecole Nationale des Chartes",
		datatype: "external-id",
		id: "P4465",
		label: "Ecole des chartes thesis abstract ID",
		example: [
			42432754,
			42433148
		],
		types: [
		],
		aliases: [
			"archivist palaeographer thesis abstract ID"
		]
	},
	{
		description: "ID of a journal, book or article in EconBiz",
		datatype: "external-id",
		id: "P7408",
		label: "EconBiz publication ID",
		example: [
			69585207,
			69585465,
			69585527
		],
		types: [
			"related to economics"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an entry in encyclopedia of the Library of Economics and Liberty by Liberty Fund, Inc., a private, educational foundation",
		datatype: "external-id",
		id: "P8369",
		label: "Econlib ID",
		example: [
			215551,
			2111958,
			896666
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "article at the cuban encyclopedia EcuRed",
		datatype: "external-id",
		id: "P8092",
		label: "EcuRed article",
		example: [
			30,
			413
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an educational institution issued by the Bangladesh Bureau of Educational Information and Statistics",
		datatype: "external-id",
		id: "P6390",
		label: "Education Institution Identification Number",
		example: [
			57198564,
			13634028,
			1480421
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"EIIN",
			"EINN"
		]
	},
	{
		description: "identity identifier for a person in correspondance with Edvard Munch",
		datatype: "external-id",
		id: "P7466",
		label: "Edvard Munch's correspondance person ID",
		example: [
			525092,
			921405,
			312698
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of movie on Eiga.com database",
		datatype: "external-id",
		id: "P7222",
		label: "Eiga.com movie ID",
		example: [
			155653,
			189540,
			860461,
			162255
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of person on Eiga.com database",
		datatype: "external-id",
		id: "P7215",
		label: "Eiga.com person ID",
		example: [
			37175,
			55400,
			4586742
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Manchu household register for people of the Qing Dynasty",
		datatype: "wikibase-item",
		id: "P470",
		label: "Eight Banner register",
		example: [
			1194024
		],
		types: [
			"for items about people"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on El portal de Música music site",
		datatype: "external-id",
		id: "P6955",
		label: "El portal de Música artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier of dubbing in the website eldoblaje.com, a database of Spanish dubbings",
		datatype: "external-id",
		id: "P2897",
		label: "Eldoblaje Movie ID",
		example: [
			24021759
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a dubbing actor in a Spanish dubbed film",
		datatype: "external-id",
		id: "P4681",
		label: "Eldoblaje dubbing actor ID",
		example: [
			15730893,
			203138,
			39666
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an original actor in a Spanish dubbed film",
		datatype: "external-id",
		id: "P4682",
		label: "Eldoblaje original actor ID",
		example: [
			312051,
			4612,
			4616
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Electronic Enlightenment database",
		datatype: "external-id",
		id: "P3429",
		label: "Electronic Enlightenment ID",
		example: [
			46633,
			11816,
			16821968
		],
		types: [
		],
		aliases: [
			"Electronic Enlightenment person ID",
			"EE ID"
		]
	},
	{
		description: "identifier at the Electronic library Ukrainica",
		datatype: "external-id",
		id: "P7817",
		label: "Electronic library Ukrainica ID",
		example: [
			1186724,
			1358055,
			4074687,
			180086,
			1427503
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a newspaper on the Elephind.com website",
		datatype: "external-id",
		id: "P8088",
		label: "Elephind.com ID",
		example: [
			19870746,
			65049116,
			4804670
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for words in the Elhuyar Dictionary, a Basque multilingual dictionary (English, Spanish, French)",
		datatype: "external-id",
		label: "Elhuyar Dictionary ID",
		id: "P6838",
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "Elhuyar Science and Technology Dictionary has a wide range of terms in four languages (en, es, fr, eu) that can easily be linked to and from Wikidata",
		datatype: "external-id",
		id: "P4746",
		label: "Elhuyar ZTH ID",
		example: [
			523
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Zientzia eta Teknologia Hiztegi Entziklopedikoa ID",
			"ZTH ID"
		]
	},
	{
		description: "Catalog of works of Eliseu Visconti",
		datatype: "external-id",
		id: "P6506",
		label: "Eliseu Visconti Project ID",
		example: [
			19887362,
			61585183,
			19887368
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ice hockey player ID assigned by Elite Prospects",
		datatype: "external-id",
		id: "P2481",
		label: "Elite Prospects player ID",
		example: [
			311280,
			30232217
		],
		types: [
		],
		aliases: [
			"Eliteprospects.com player ID"
		]
	},
	{
		description: "identifier for an ice hockey team staff member, on Eliteprospects.com",
		datatype: "external-id",
		id: "P4319",
		label: "Elite Prospects staff ID",
		example: [
			4753917
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a player at the elitefootball.com",
		datatype: "external-id",
		id: "P7343",
		label: "Elitefootball player ID",
		example: [
			2630956,
			5989408,
			5923585
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the Elle.fr website",
		datatype: "external-id",
		id: "P3812",
		label: "Elle.fr person ID",
		example: [
			106365,
			268033
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "quantitative measure of one's game-playing ability, particularly in classical chess",
		datatype: "quantity",
		id: "P1087",
		label: "Elo rating",
		example: [
			106807
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a movie in the Elonet database",
		datatype: "external-id",
		id: "P2346",
		label: "Elonet movie ID",
		example: [
			29054009
		],
		types: [
		],
		aliases: [
			"Elonet ID",
			"Elonet film ID"
		]
	},
	{
		description: "identifier for a person, in the Elonet database",
		datatype: "external-id",
		id: "P2387",
		label: "Elonet person ID",
		example: [
			8877,
			4616,
			4612
		],
		types: [
		],
		aliases: [
			"Elonet actor ID",
			"Elonet artist ID"
		]
	},
	{
		description: "ID for a journal published by Elsevier",
		datatype: "external-id",
		id: "P5963",
		label: "Elsevier journal ID",
		example: [
			2264592,
			56760416,
			56786173
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a president of the French Republic on ''elysee.fr''",
		datatype: "external-id",
		id: "P5440",
		label: "Elysee.fr president ID",
		example: [
			3052772,
			329,
			5738
		],
		types: [
		],
		aliases: [
			"Élysée president ID"
		]
	},
	{
		description: "ID of an embassy or a consulate general in the database for diplomatic missions, EmbassyPages.com",
		datatype: "external-id",
		id: "P4127",
		label: "EmbassyPages.com ID",
		example: [
			26979895,
			63639208,
			2995340
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifer for Emmys person ID",
		datatype: "external-id",
		id: "P8381",
		label: "Emmys person ID",
		example: [
			12003,
			373895,
			6308195,
			23562833
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author on Empik site",
		datatype: "external-id",
		id: "P7154",
		label: "Empik author ID",
		example: [
			383541,
			8877,
			224113
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a building in the Emporis database (for building complexes, see P2270)",
		datatype: "external-id",
		id: "P455",
		label: "Emporis building ID",
		example: [
			243,
			5908
		],
		types: [
		],
		aliases: [
			"EBN"
		]
	},
	{
		description: "identifier for a building complex, as opposed to a single building, in the Emporis architecture database",
		datatype: "external-id",
		id: "P2270",
		label: "Emporis building complex ID",
		example: [
			3058350,
			15246
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P8563",
		label: "Emporis company ID",
		example: [
			28719264,
			459464,
			2461310
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier",
		datatype: "external-id",
		id: "P1565",
		label: "Enciclopedia de la Literatura en México ID",
		example: [
			8962435
		],
		types: [
		],
		aliases: [
			"ELEM Id"
		]
	},
	{
		description: "identifier for a subject on the ''Enciclopedia delle donne''",
		datatype: "external-id",
		id: "P6488",
		label: "Enciclopedia delle donne ID",
		example: [
			263812,
			179718,
			4018068
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier on Enciclopèdia de l'Esport Català, encyclopedia of Catalan sportspeople and sports clubs",
		datatype: "external-id",
		id: "P5513",
		label: "Enciclopèdia de l'Esport Català ID",
		example: [
			925691,
			171404,
			856024
		],
		types: [
			"related to sport"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an item in Enciclopédia Açoriana",
		datatype: "external-id",
		id: "P1385",
		label: "Enciclopédia Açoriana ID",
		example: [
			345926
		],
		types: [
		],
		aliases: [
			"EA",
			"Azores encyclopedia",
			"Encyclopedia of the Azores"
		]
	},
	{
		description: "identification in Enciclovida, an Encyclopedia of plants, fungi and animals of Mexico",
		datatype: "external-id",
		id: "P5864",
		label: "Enciclovida ID",
		example: [
			27621794
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an article in Encyclopaedia Beliana",
		datatype: "external-id",
		id: "P8669",
		label: "Encyclopaedia Beliana ID",
		example: [
			1017,
			35518
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P5441",
		label: "Encyclopaedia Herder author ID",
		example: [
			43939,
			60025
		],
		types: [
		],
		aliases: [
			"Herder Encyclopedia author ID"
		]
	},
	{
		description: "Identifier for a person in the Encyclopaedia Metallum database",
		datatype: "external-id",
		id: "P1989",
		label: "Encyclopaedia Metallum artist ID",
		example: [
			133151,
			187165
		],
		types: [
		],
		aliases: [
			"Metal Archives artist ID",
			"Encyclopedia Metallum artist ID"
		]
	},
	{
		description: "identifier for a band in the Encyclopaedia Metallum database",
		datatype: "external-id",
		id: "P1952",
		label: "Encyclopaedia Metallum band ID",
		example: [
			47670
		],
		types: [
		],
		aliases: [
			"Metal Archives band ID",
			"Encyclopedia Metallum band ID"
		]
	},
	{
		description: "identifier for a label in the Encyclopaedia Metallum database",
		datatype: "external-id",
		id: "P8166",
		label: "Encyclopaedia Metallum label ID",
		example: [
			90153501,
			158886,
			2004146
		],
		types: [
		],
		aliases: [
			"Metal Archives label ID"
		]
	},
	{
		description: "identifier for a release in the Encyclopaedia Metallum database",
		datatype: "external-id",
		id: "P2721",
		label: "Encyclopaedia Metallum release ID",
		example: [
			1889150
		],
		types: [
		],
		aliases: [
			"Encyclopedia Metallum release ID",
			"Metal Archives release ID"
		]
	},
	{
		description: "identifier for an architect who has worked in Vienna in the Architektenlexikon of the Architekturzentrum Wien",
		datatype: "external-id",
		id: "P8575",
		label: "Encyclopaedia of Architects, Vienna 1770–1945 ID",
		example: [
			78638,
			78858,
			98562901
		],
		types: [
		],
		aliases: [
			"Architekturzentrum Wien ID",
			"Architektenlexikon ID"
		]
	},
	{
		description: "Russian version of online encyclopedia created by Institute of Tatar encyclopedia of Tatarstan Academy of Sciences",
		datatype: "external-id",
		id: "P8377",
		label: "Encyclopedia Tatarica (ru) Online ID",
		example: [
			4231550,
			2509263
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Tatar version of online encyclopedia created by Institute of Tatar encyclopedia of Tatarstan Academy of Sciences",
		datatype: "external-id",
		id: "P8373",
		label: "Encyclopedia Tatarica (tt) Online ID",
		example: [
			4231550,
			2509263
		],
		types: [
		],
		aliases: [
			"Tatarica (tt) Online ID",
			"Tatarica (tt) (encyclopedia)"
		]
	},
	{
		description: "identifier of a topic in the online Encyclopedia Virginia",
		datatype: "external-id",
		id: "P5981",
		label: "Encyclopedia Virginia ID",
		example: [
			57048756,
			7727343,
			647979
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"EV ID"
		]
	},
	{
		description: "identifier for a subject on the Encyclopedia of Alabama website",
		datatype: "external-id",
		id: "P6010",
		label: "Encyclopedia of Alabama ID",
		example: [
			1702161,
			7756877,
			661092,
			501157
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a subject on the Encyclopedia of Appalachia website",
		datatype: "external-id",
		id: "P6013",
		label: "Encyclopedia of Appalachia ID",
		example: [
			370915,
			241263,
			7313417
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person or organisation in the Encyclopedia of Australian Science, an online compilation of biographical data about Australian scientists and their organisations",
		datatype: "external-id",
		id: "P4228",
		label: "Encyclopedia of Australian Science ID",
		example: [
			38734568,
			7660067
		],
		types: [
		],
		aliases: [
			"EOAS ID"
		]
	},
	{
		description: "identifier for people related to the city of Brno and its history",
		datatype: "external-id",
		id: "P8116",
		label: "Encyclopedia of Brno Person ID",
		example: [
			12026739,
			1355527,
			12017355
		],
		types: [
		],
		aliases: [
			"Brno Encyclopedia ID"
		]
	},
	{
		description: "identifier for an article in the Encyclopedia of Chicago",
		datatype: "external-id",
		id: "P7901",
		label: "Encyclopedia of Chicago ID",
		example: [
			239303,
			80048,
			361
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an entry on the Encyclopedia of Cleveland History website",
		datatype: "external-id",
		id: "P7644",
		label: "Encyclopedia of Cleveland History ID",
		example: [
			5055263,
			257756,
			17080666
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ECH ID"
		]
	},
	{
		description: "eol.org item reference number",
		datatype: "external-id",
		id: "P830",
		label: "Encyclopedia of Life ID",
		example: [
			7030592
		],
		types: [
		],
		aliases: [
			"eol",
			"EoL ID"
		]
	},
	{
		description: "identifier for an article on the Encyclopedia of Mathematics wiki",
		datatype: "external-id",
		id: "P7554",
		label: "Encyclopedia of Mathematics wiki ID",
		example: [
			190546,
			11518,
			395
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an entry on the official website of the Encyclopedia of Modern Ukraine",
		datatype: "external-id",
		id: "P4613",
		label: "Encyclopedia of Modern Ukraine ID",
		example: [
			157835
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID for a person, a surfing spot, a subject in the Encyclopedia of Surfing",
		datatype: "external-id",
		id: "P3338",
		label: "Encyclopedia of Surfing ID",
		example: [
			5135365,
			2153351,
			3190749
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for triangle centers used in the Encyclopedia of Triangle Centers, founded by Clark Kimberling",
		datatype: "external-id",
		id: "P2931",
		label: "Encyclopedia of Triangle Centers identifier",
		example: [
			1807042
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ETC ID",
			"Kimberling number"
		]
	},
	{
		description: "identifier for an entry on the Encyclopedia of the Great Plains website",
		datatype: "external-id",
		id: "P7686",
		label: "Encyclopedia of the Great Plains ID",
		example: [
			236795,
			2408536,
			2164344
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for article related to the city of České Budějovice",
		datatype: "external-id",
		id: "P8135",
		label: "Encyclopedia of České Budějovice ID",
		example: [
			8552687,
			12028157,
			894336
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Encyklopedie Českých Budějovic ID"
		]
	},
	{
		description: "identifier for an article in English in the Encyclopedia on Early Childhood Development",
		datatype: "external-id",
		id: "P8015",
		label: "Encyclopedia on Early Childhood Development ID (English)",
		example: [
			38404,
			3241451,
			1150958
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "article of the French encyclopedia about the Berbers",
		datatype: "external-id",
		id: "P8472",
		label: "Encyclopedie berbere ID",
		example: [
			1071259,
			311889
		],
		types: [
		],
		aliases: [
			"Encyclopédie berbère ID"
		]
	},
	{
		description: "identifer for an article in the online version of Encyclopædia Britannica",
		datatype: "external-id",
		id: "P1417",
		label: "Encyclopædia Britannica Online ID",
		example: [
			7374,
			47180,
			712504
		],
		types: [
		],
		aliases: [
			"Britannica online ID",
			"Britannica ID",
			"Encyclopaedia Britannica Online ID",
			"Encyclopedia Britannica Online ID",
			"EB ID",
			"EBID"
		]
	},
	{
		description: "identifier for a contributor to the 'Encyclopædia Britannica'",
		datatype: "external-id",
		id: "P2450",
		label: "Encyclopædia Britannica contributor ID",
		example: [
			6448209,
			15967902,
			16208061
		],
		types: [
		],
		aliases: [
			"Encyclopedia Britannica contributor identifier",
			"EB contributor",
			"Encyclopædia Britannica contributor identifier",
			"Britannica contributor identifier",
			"Britannica contributor ID",
			"Britannica ID"
		]
	},
	{
		description: "identifer for an article in the online version of Encyclopædia Universalis",
		datatype: "external-id",
		id: "P3219",
		label: "Encyclopædia Universalis ID",
		example: [
			7374,
			111
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Universalis online ID",
			"Universalis ID",
			"Encyclopaedia Universalis Online ID"
		]
	},
	{
		description: "identifier of an author on the online version of Encyclopædia Universalis",
		datatype: "external-id",
		id: "P5369",
		label: "Encyclopædia Universalis author ID",
		example: [
			860387,
			93136,
			3291296,
			3166810,
			54958437,
			455250
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Universalis author ID"
		]
	},
	{
		description: "identifier for an article in French in the Encyclopedia on Early Childhood Development",
		datatype: "external-id",
		id: "P8016",
		label: "Encyclopédie sur le développement des jeunes enfants ID",
		example: [
			38404,
			3241451,
			1150958
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an article in the Encyklopedia Solidarności",
		datatype: "external-id",
		id: "P8095",
		label: "Encyklopedia Solidarności ID",
		example: [
			11753446,
			19758419,
			6269847
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "code used in Europe to uniquely identify entities and objects related to the electricity and gas sector",
		datatype: "external-id",
		id: "P8645",
		label: "Energy Identification Code",
		example: [
			2178795,
			2885331
		],
		types: [
		],
		aliases: [
			"EIC",
			"EIC code"
		]
	},
	{
		description: "identifier for football manager on England Football Online site",
		datatype: "external-id",
		id: "P6330",
		label: "England Football Online manager profile",
		example: [
			708818,
			316681,
			218369
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for football player on England Football Online site",
		datatype: "external-id",
		id: "P6331",
		label: "England Football Online player profile",
		example: [
			2476354,
			316681,
			3531460
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a male player on the Englandstats.com website",
		datatype: "external-id",
		id: "P7608",
		label: "Englandstats.com Soccer ID",
		example: [
			969725,
			22951255,
			10520
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of the article in English Vikidia",
		datatype: "external-id",
		id: "P7829",
		label: "English Vikidia ID",
		example: [
			68,
			1321,
			96
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"envd",
			"Vikidia article in English",
			"article in English Vikidia"
		]
	},
	{
		description: "identifier for a gene as per the Ensembl (European Bioinformatics Institute and the Wellcome Trust Sanger Institute) database",
		datatype: "external-id",
		id: "P594",
		label: "Ensembl gene ID",
		example: [
			14819296,
			14819298,
			14819473,
			14819475,
			24394377
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a protein issued by Ensembl database",
		datatype: "external-id",
		id: "P705",
		label: "Ensembl protein ID",
		example: [
			13561329
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "transcript ID issued by Ensembl database",
		datatype: "external-id",
		id: "P704",
		label: "Ensembl transcript ID",
		example: [
			414043
		],
		types: [
			"representing a unique identifier",
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a magazine on Ent'revues, directory service of French cultural magazines",
		datatype: "external-id",
		id: "P4706",
		label: "Ent'revues ID",
		example: [
			46995876,
			46996611
		],
		types: [
		],
		aliases: [
			"Entrevues ID"
		]
	},
	{
		description: "Identifier from Crossroads Bank for Belgian Enterprises",
		datatype: "external-id",
		id: "P3376",
		label: "Enterprise number (Belgium)",
		example: [
			18398868,
			2780100
		],
		types: [
		],
		aliases: [
			"CBE number",
			"Enterprise number",
			"Belgian enterprise number"
		]
	},
	{
		description: "identifier for an entry in the Biographies of the Entomologists of the World online database",
		datatype: "external-id",
		id: "P5370",
		label: "Entomologists of the World ID",
		example: [
			5046638,
			5360
		],
		types: [
		],
		aliases: [
			"Biographies of the Entomologists of the World ID"
		]
	},
	{
		description: "identifier for a gene per the NCBI Entrez database",
		datatype: "external-id",
		id: "P351",
		label: "Entrez Gene ID",
		example: [
			14911732
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P6117",
		label: "Envanter.gov.tr Monument ID",
		example: [
			848397,
			12506,
			91274
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID from OBO Environment Ontology (without prefix)",
		datatype: "external-id",
		id: "P3859",
		label: "Environment Ontology ID",
		example: [
			119253
		],
		types: [
		],
		aliases: [
			"OBO Environment Ontology ID"
		]
	},
	{
		description: "identifier for an entry in the Estonian Environmental Register",
		datatype: "external-id",
		id: "P4689",
		label: "Environmental Register code (Estonia)",
		example: [
			215378,
			14956408
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a television programme or series, at epguides.com",
		datatype: "external-id",
		id: "P3121",
		label: "Epguides ID",
		example: [
			494244
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a video game available on the Epic Games Store",
		datatype: "external-id",
		id: "P6278",
		label: "Epic Games Store ID",
		example: [
			21170283,
			29704664,
			59756366
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Epistemonikos database of systematic reviews",
		datatype: "external-id",
		id: "P8187",
		label: "Epistemonikos ID",
		example: [
			61795460,
			42778500,
			86729469
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an inscribed tablet about a dead person in a Swedish church from the website epitafier.se",
		datatype: "external-id",
		id: "P6996",
		label: "Epitafier.se ID",
		example: [
			5620546,
			26239971,
			647928,
			9267192,
			6175557
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on Equipboard music site",
		datatype: "external-id",
		id: "P6912",
		label: "Equipboard artist ID",
		example: [
			383541,
			313453,
			19198
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "the \"collaborative distance\" between mathematician Paul Erdős and another person. Use point in time (P585) as qualifier and should be used with a source.",
		datatype: "quantity",
		id: "P2021",
		label: "Erdős number",
		example: [
			173746,
			3454165,
			309820
		],
		types: [
			"for items about people"
		],
		aliases: [
			"Erdos number"
		]
	},
	{
		description: "number in the address book of early Esperanto speakers by Zamenhof",
		datatype: "external-id",
		id: "P1601",
		label: "Esperantist ID",
		example: [
			18413,
			12608
		],
		types: [
		],
		aliases: [
			"Esperantist number",
			"address book of Esperantists"
		]
	},
	{
		description: "identifier for a species on the Espèces Envahissantes Outre-mer website",
		datatype: "external-id",
		id: "P6043",
		label: "Espèces Envahissantes Outre-mer ID",
		example: [
			1543914,
			2930211,
			1188841
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an item in the E-Katalog ester.ee",
		datatype: "external-id",
		id: "P5149",
		label: "Ester ID",
		example: [
			53612080,
			53960884
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID of a player by the Estonian Football Association",
		datatype: "external-id",
		id: "P3659",
		label: "Estonian Football Association player ID",
		example: [
			3067614,
			710707
		],
		types: [
		],
		aliases: [
			"EFA ID"
		]
	},
	{
		description: "identifier for a team on the Estonian Football Association website",
		datatype: "external-id",
		id: "P4639",
		label: "Estonian Football Association team ID",
		example: [
			222861,
			1483314
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person, in the Estonian Research Portal",
		datatype: "external-id",
		id: "P2953",
		label: "Estonian Research Portal person ID",
		example: [
			693121
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of someone in Estonian biographical database (Eesti biograafiline andmebaas ISIK)",
		datatype: "external-id",
		id: "P7509",
		label: "Estonian biographical database ID",
		example: [
			12358328,
			12365553,
			16403081
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Estonian national registry of cultural monuments",
		datatype: "external-id",
		id: "P2948",
		label: "Estonian cultural monument ID",
		example: [
			16412716
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a school in Wales, in the Welsh Assembly's Estyn database",
		datatype: "external-id",
		id: "P2655",
		label: "Estyn ID",
		example: [
			7281815
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "language status identifier by Ethnologue.com using EGIDS scale",
		datatype: "wikibase-item",
		id: "P3823",
		label: "Ethnologue language status",
		example: [
			9240,
			33549,
			3027953,
			36931
		],
		types: [
			"for items about languages"
		],
		aliases: [
			"language status",
			"EGIDS"
		]
	},
	{
		description: "identifier for a language in ethnologue.com",
		datatype: "external-id",
		id: "P1627",
		label: "Ethnologue.com language code",
		example: [
			809,
			652
		],
		types: [
			"representing a unique identifier",
			"for items about languages"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author on the Eulalie website",
		datatype: "external-id",
		id: "P5539",
		label: "Eulalie ID",
		example: [
			55710509,
			16532165,
			30728925
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "topological invariant of a space; the alternating sum of the dimensions of the (co)homology of a space",
		datatype: "quantity",
		id: "P6438",
		label: "Euler characteristic",
		example: [
			12507,
			1234054,
			12510,
			633815
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a species or subspecies, in the Euring database",
		datatype: "external-id",
		id: "P3459",
		label: "Euring number",
		example: [
			26680,
			25334
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a participants of UEFA Euro 2004 at Euro04.Ru site",
		datatype: "external-id",
		id: "P7113",
		label: "Euro04.Ru person ID",
		example: [
			310103,
			389113,
			437545
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an area of government activity, in the European Union's EuroVoc thesaurus",
		datatype: "external-id",
		id: "P5437",
		label: "EuroVoc ID",
		example: [
			43229,
			159810,
			2249676,
			7163
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID for a basketball player at eurobasket.com",
		datatype: "external-id",
		id: "P3527",
		label: "Eurobasket.com player ID",
		example: [
			3849644,
			4721816
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the Eurogamer database",
		datatype: "external-id",
		id: "P7875",
		label: "Eurogamer ID",
		example: [
			4655600,
			840409,
			24806656,
			317620,
			1757876,
			28841925
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an ice hockey team in the database of Eurohockey.com",
		datatype: "external-id",
		id: "P5183",
		label: "Eurohockey.com club ID",
		example: [
			387013,
			4078505
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an ice hockey player in the database of Eurohockey.com",
		datatype: "external-id",
		id: "P2601",
		label: "Eurohockey.com player ID",
		example: [
			253073,
			44130
		],
		types: [
		],
		aliases: [
			"Eurohockey player ID"
		]
	},
	{
		description: "identifier for a game available on the PlayStation Store (EU region)",
		datatype: "external-id",
		id: "P5971",
		label: "Europe PlayStation Store ID",
		example: [
			17452,
			17452,
			10493813,
			23013817
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"PlayStation Store (Europe) ID",
			"EU PlayStation Store ID",
			"PlayStation Store (EU) ID",
			"PS Store EU ID"
		]
	},
	{
		description: "identifier for an athlete on the European Athletic Association website",
		datatype: "external-id",
		id: "P3766",
		label: "European Athletics ID",
		example: [
			457628,
			3195752
		],
		types: [
		],
		aliases: [
			"EAA ID",
			"European Athletic Association ID"
		]
	},
	{
		description: "identifier for case law in Europe",
		datatype: "external-id",
		id: "P3570",
		label: "European Case Law ID",
		example: [
			5515115,
			25052959,
			2062418
		],
		types: [
		],
		aliases: [
			"ECLI",
			"European Case Law Identifier"
		]
	},
	{
		description: "identifier on the European Fencing Confederation website",
		datatype: "external-id",
		id: "P4475",
		label: "European Fencing Confederation fencer ID",
		example: [
			261939,
			3852352
		],
		types: [
		],
		aliases: [
			"Eurofencing fencer ID",
			"EFC fencer ID"
		]
	},
	{
		description: "id for players at eurohandball.com, the website of the European Handball Federation (EHF)",
		datatype: "external-id",
		id: "P3573",
		label: "European Handball Federation player ID",
		example: [
			243019,
			655211
		],
		types: [
		],
		aliases: [
			"Eurohandball player ID",
			"EHF player ID"
		]
	},
	{
		description: "identifier issued by the European Medicines Agency for treatments approved in the European Union",
		datatype: "external-id",
		id: "P3637",
		label: "European Medicines Agency product number",
		example: [
			29004375,
			29006003
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"EMEA ID",
			"EMA ID",
			"EMA product number"
		]
	},
	{
		description: "identifier for a golf player, in the European Tour database",
		datatype: "external-id",
		id: "P3521",
		label: "European Tour golf player ID",
		example: [
			440171,
			272190
		],
		types: [
		],
		aliases: [
			"EuroTour ID",
			"EuroTour golf player ID"
		]
	},
	{
		description: "identifier for clothing and fashion terms",
		datatype: "external-id",
		id: "P3832",
		label: "Europeana Fashion Vocabulary ID",
		example: [
			1153401,
			1146387,
			2144456
		],
		types: [
		],
		aliases: [
			"Europeana Fashion Thesaurus ID",
			"EFT ID",
			"EFV ID"
		]
	},
	{
		description: "identifier for a creator on Europeana Fashion",
		datatype: "external-id",
		id: "P3482",
		label: "Europeana Fashion creator ID",
		example: [
			2940704,
			2822225
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for persons, places and topics at Europeana",
		datatype: "external-id",
		id: "P7704",
		label: "Europeana entity",
		example: [
			206820,
			730008,
			50030,
			174705
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a song in the Eurovision Song Contest",
		datatype: "external-id",
		id: "P3736",
		label: "Eurovision Song Contest song ID",
		example: [
			156562
		],
		types: [
		],
		aliases: [
			"ESC song ID"
		]
	},
	{
		description: "identifier for a person on the Evene website",
		datatype: "external-id",
		id: "P5617",
		label: "Evene ID",
		example: [
			2190,
			2871947,
			167821
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique ID for the event on the website Eventa Servo",
		datatype: "external-id",
		id: "P6457",
		label: "Eventa Servo ID",
		example: [
			60244683,
			47461290
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a Commonwealth military person, who died in World War One, on the Everyone Remembered database",
		datatype: "external-id",
		id: "P4551",
		label: "Everyone Remembered ID",
		example: [
			212719,
			27830999
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Evidence & Conclusion Ontology for capturing evidence in biological research",
		datatype: "external-id",
		label: "Evidence & Conclusion Ontology ID",
		id: "P3811",
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"E&CO ID"
		]
	},
	{
		description: "airport code similar to IATA codes but only for Russian and CEI airports",
		datatype: "external-id",
		id: "P5851",
		label: "Ex-USSR internal airport code",
		example: [
			690122,
			186614,
			1334495
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "unique identifier of the \"Patrimoine immobilier exceptionnel de la Région wallonne\"",
		datatype: "external-id",
		id: "P1551",
		label: "Exceptional heritage of Wallonia ID",
		example: [
			2477151
		],
		types: [
		],
		aliases: [
			"Exceptional heritage of Wallonia identifier"
		]
	},
	{
		description: "identifier for a person or group of individuals, in the ExecutedToday database",
		datatype: "external-id",
		id: "P4361",
		label: "ExecutedToday ID",
		example: [
			69432,
			1737567
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an executive order of the US",
		datatype: "external-id",
		id: "P1555",
		label: "Executive Order number",
		example: [
			2656758
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "string of the manufacturer as it appears in the EXIF generated by a specific digital camera model",
		datatype: "string",
		id: "P2010",
		label: "Exif make",
		example: [
			1041905,
			7089219,
			20859081,
			19297634,
			22893875
		],
		types: [
			"multi-source external identifier"
		],
		aliases: [
			"EXIF make",
			"make"
		]
	},
	{
		description: "string as it appears in the EXIF generated by a camera",
		datatype: "string",
		id: "P2009",
		label: "Exif model",
		example: [
			1041905,
			64100,
			20859075
		],
		types: [
			"multi-source external identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an exoplanet on the Exoplanet Data Explorer website",
		datatype: "external-id",
		id: "P5650",
		label: "Exoplanet Data Explorer exoplanet ID",
		example: [
			15694531,
			2815237,
			242309
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the ExoticA wiki",
		datatype: "external-id",
		id: "P7981",
		label: "ExoticA ID",
		example: [
			618610,
			55236842,
			64712
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an hotel on the Expedia website",
		datatype: "external-id",
		id: "P5651",
		label: "Expedia hotel ID",
		example: [
			3145417,
			47524953,
			1538837
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a trail on the Explore Pennsylvania Trails website",
		datatype: "external-id",
		id: "P7319",
		label: "ExplorePaTrails ID",
		example: [
			67167093,
			7649357,
			20715138
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an exoplanet on the Extrasolar Planets Encyclopaedia website",
		datatype: "external-id",
		id: "P5653",
		label: "Extrasolar Planets Encyclopaedia exoplanet ID",
		example: [
			1041614,
			204500,
			20726281
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a player at the Extratime.ie",
		datatype: "external-id",
		id: "P8173",
		label: "Extratime.ie player ID",
		example: [
			7175815,
			85797565,
			2635491
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Android package in the F-Droid official repository",
		datatype: "external-id",
		id: "P3597",
		label: "F-Droid package",
		example: [
			52,
			3087512
		],
		types: [
			"for software"
		],
		aliases: [
			"FDroid package",
			"Android app ID",
			"package, F-Droid",
			"package, FDroid"
		]
	},
	{
		description: "three-letter or four-letter alphanumeric code identifying United States airports",
		datatype: "string",
		id: "P240",
		label: "FAA airport code",
		example: [
			2750047
		],
		types: [
		],
		aliases: [
			"FAA LID"
		]
	},
	{
		description: "identifier for an association football player at nv.fotbal.cz, website of the Football Association of the Czech Republic (FAČR: Fotbalová asociace České republiky), formerly the Bohemian-Moravian Football Union (ČMFS: Českomoravský fotbalový svaz)",
		datatype: "external-id",
		id: "P3050",
		label: "FACR player ID",
		example: [
			483137
		],
		types: [
		],
		aliases: [
			"Czech  footballer ID",
			"CMFS player ID"
		]
	},
	{
		description: "identifier for an athlete on the Fédération Aéronautique Internationale website",
		datatype: "external-id",
		id: "P4556",
		label: "FAI ID",
		example: [
			43157759,
			43158022
		],
		types: [
		],
		aliases: [
			"Fédération Aéronautique Internationale ID"
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P7366",
		label: "FAIMER school ID",
		example: [
			49121,
			6410897,
			1950740
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for written work in medieval Latin",
		datatype: "external-id",
		id: "P3462",
		label: "FAMA work ID",
		example: [
			28126465
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "unique code to identify French thoroughfares and places",
		datatype: "external-id",
		id: "P3182",
		label: "FANTOIR code",
		example: [
			23013581,
			14629229
		],
		types: [
		],
		aliases: [
			"RIVOLI ID",
			"RIVOLI code"
		]
	},
	{
		description: "(constructed) ID of a domestic animal species or breed in the FAO Animal Genetic resources report 2007 breed",
		datatype: "external-id",
		id: "P3380",
		label: "FAO 2007 genetic resource ID",
		example: [
			9394,
			372084
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "UN Food and Agriculture Organization designation of status for a domesticated breed",
		datatype: "wikibase-item",
		id: "P2371",
		label: "FAO risk status",
		example: [
			322890,
			33380,
			3087896,
			5045529,
			1953596,
			2030755
		],
		types: [
		],
		aliases: [
			"FAO status"
		]
	},
	{
		description: "identifier for institutions funded by the Brazilian research education and innovation foundation, FAPESP",
		datatype: "external-id",
		id: "P4597",
		label: "FAPESP institution ID",
		example: [
			10279490
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for researchers funded by the Brazilian research education and innovation foundation, FAPESP",
		datatype: "external-id",
		id: "P4598",
		label: "FAPESP researcher ID",
		example: [
			3891586,
			2920198
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "authority control identifier in WorldCat's “FAST Linked Data” authority file",
		datatype: "external-id",
		id: "P2163",
		label: "FAST ID",
		example: [
			13424289,
			64,
			180,
			466,
			309048,
			4681267
		],
		types: [
		],
		aliases: [
			"Faceted Application of Subject Terminology ID",
			"FAST subject heading",
			"fst"
		]
	},
	{
		description: "identifier for a player on the FBref website",
		datatype: "external-id",
		id: "P5750",
		label: "FBref.com player ID",
		example: [
			43729,
			19599124,
			992248
		],
		types: [
		],
		aliases: [
			"FBref player ID"
		]
	},
	{
		description: "identifier for an association football team on FBref.com",
		datatype: "external-id",
		id: "P8642",
		label: "FBref.com squad ID",
		example: [
			15789,
			1130849,
			1446672
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "U.S. ID number for broadcast stations",
		datatype: "external-id",
		id: "P1400",
		label: "FCC Facility ID",
		example: [
			7950766
		],
		types: [
		],
		aliases: [
			"Facility ID Number",
			"FIN",
			"facility_id",
			"facid"
		]
	},
	{
		description: "unique identifier of a grantee assigned by the Federal Communications Commission of the United States",
		datatype: "external-id",
		id: "P7264",
		label: "FCC Grantee Code",
		example: [
			312,
			160120,
			5455414
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a product assigned by the grantee in an application to the Federal Communications Commission of the United States",
		datatype: "string",
		id: "P7290",
		label: "FCC Product Code",
		example: [
			66816999,
			66817000,
			66816996
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a rider on the Italian Cycling Federation website",
		datatype: "external-id",
		id: "P4278",
		label: "FCI rider ID",
		example: [
			20742847,
			40346943
		],
		types: [
		],
		aliases: [
			"Federazione Ciclistica Italiana rider ID"
		]
	},
	{
		description: "ID for a campaign committee in the United States",
		datatype: "external-id",
		id: "P7057",
		label: "FEC Campaign Committee ID",
		example: [
			20121517,
			19881575,
			19872173,
			22687752
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Federal Election Commission Campaign Committee ID",
			"Campaign Committee ID"
		]
	},
	{
		description: "identifier of athlete at the FEI website",
		datatype: "external-id",
		id: "P3111",
		label: "FEI person ID",
		example: [
			26262340,
			364494
		],
		types: [
		],
		aliases: [
			"Fédération Équestre Internationale",
			"FEI ID"
		]
	},
	{
		description: "identifier for a taxon on the Fire Effects Information System website",
		datatype: "external-id",
		id: "P6044",
		label: "FEIS ID",
		example: [
			2532820,
			3492753,
			8332
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for flavor ingredients",
		datatype: "external-id",
		id: "P8266",
		label: "FEMA number",
		example: [
			407153,
			412429
		],
		types: [
			"representing a unique identifier",
			"related to chemistry"
		],
		aliases: [
			"Flavor and Extract Manufacturers Association ID"
		]
	},
	{
		description: "identifier for an author on the Franco Fossati Foundation website",
		datatype: "external-id",
		id: "P5619",
		label: "FFF author ID",
		example: [
			440139,
			192214,
			1794041
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a character on the Franco Fossati Foundation website",
		datatype: "external-id",
		id: "P5620",
		label: "FFF character ID",
		example: [
			1208013,
			1413936,
			3554205
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a female player on the French Football Federation website",
		datatype: "external-id",
		id: "P4886",
		label: "FFF female player ID",
		example: [
			775458,
			465343
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a male player on the French Football Federation website",
		datatype: "external-id",
		id: "P4883",
		label: "FFF male player ID",
		example: [
			376247,
			313405
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique federal identifier (IUF) of a French swimmer in extraNat.fr, database of the French Swimming Federation (FFN)",
		datatype: "external-id",
		id: "P4074",
		label: "FFN swimmer ID",
		example: [
			129192,
			115794
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a rugby sevens player on the French Rugby Federation website",
		datatype: "external-id",
		id: "P4880",
		label: "FFR Sevens player ID",
		example: [
			3560816,
			1638027
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a rugby union player on the French Rugby Federation website",
		datatype: "external-id",
		id: "P3644",
		label: "FFR player ID",
		example: [
			923207,
			1396331
		],
		types: [
		],
		aliases: [
			"Fédération française de rugby ID"
		]
	},
	{
		description: "identifier for athletes at the Fédération française de ski site",
		datatype: "external-id",
		id: "P6612",
		label: "FFS athlete ID",
		example: [
			4080542,
			381454,
			238206
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "licence number of a sailor for the French Sailing Federation, corresponding identifier on its website",
		datatype: "external-id",
		id: "P4261",
		label: "FFVoile sailor ID",
		example: [
			40938515,
			1442434
		],
		types: [
		],
		aliases: [
			"Fédération française de voile sailor ID"
		]
	},
	{
		description: "identifier for an ancient Greek historian in Die Fragmente der griechischen Historiker by Felix Jacoby",
		datatype: "external-id",
		id: "P7168",
		label: "FGrHist ID",
		example: [
			242270,
			504744,
			1033012,
			301785
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Die Fragmente der griechischen Historiker identifier"
		]
	},
	{
		description: "identifier for a French medical facility on the Fédération hospitalière de France website",
		datatype: "external-id",
		id: "P8077",
		label: "FHF establishment ID",
		example: [
			2945665,
			67772411,
			30279975
		],
		types: [
		],
		aliases: [
			"Fédération hospitalière de France establishment ID",
			"Hopital.fr establishment ID"
		]
	},
	{
		description: "identifier for a French hospital group on the Fédération hospitalière de France website",
		datatype: "external-id",
		id: "P8078",
		label: "FHF hospital group ID",
		example: [
			2945721,
			50036672,
			2945765
		],
		types: [
		],
		aliases: [
			"Fédération hospitalière de France hospital group ID",
			"Hopital.fr hospital group ID"
		]
	},
	{
		description: "identifier in the WarSampo Finnish WW2 portal",
		datatype: "external-id",
		label: "FI WarSampo army unit ID",
		id: "P3819",
		types: [
		],
		aliases: [
		]
	},
	{
		description: "іdentifier in the WarSampo Finnish WW2 portal",
		datatype: "external-id",
		id: "P3817",
		label: "FI WarSampo person ID",
		example: [
			2383184,
			11853484
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a basketball player at fiba.com",
		datatype: "external-id",
		id: "P3542",
		label: "FIBA player ID",
		example: [
			3849644,
			3052471
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for athletes in the Italian Athletics Federation (FIDAL) database and website",
		datatype: "external-id",
		id: "P3446",
		label: "FIDAL athlete ID",
		example: [
			433425
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athletic team in Italy by the Italian athletics federation (FIDAL)",
		datatype: "external-id",
		id: "P7364",
		label: "FIDAL team ID",
		example: [
			3628266,
			20994305,
			23502969
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier on the FIDE database for chess players",
		datatype: "external-id",
		id: "P1440",
		label: "FIDE player ID",
		example: [
			106807,
			470788
		],
		types: [
		],
		aliases: [
			"FIDE ID"
		]
	},
	{
		description: "three-letter country code assigned by FIFA",
		datatype: "string",
		id: "P3441",
		label: "FIFA country code",
		example: [
			473248,
			188791
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a association football player per FIFA",
		datatype: "external-id",
		id: "P1469",
		label: "FIFA player ID",
		example: [
			648347,
			142794
		],
		types: [
		],
		aliases: [
			"FIFA ID"
		]
	},
	{
		description: "gymnast's identifier (no licence) at the database of International Federation of Gymnastics",
		datatype: "external-id",
		id: "P7440",
		label: "FIG gymnast (no licence) identifier",
		example: [
			10376234,
			12641304
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "gymnast's identifier at the database of the International Federation of Gymnastics",
		datatype: "external-id",
		id: "P2696",
		label: "FIG gymnast licence number",
		example: [
			238663,
			98055
		],
		types: [
		],
		aliases: [
			"FIG gymnast ID"
		]
	},
	{
		description: "identifier for a field hockey player on the International Hockey Federation website",
		datatype: "external-id",
		id: "P3742",
		label: "FIH player ID",
		example: [
			271360,
			1845787
		],
		types: [
			"related to sport"
		],
		aliases: [
		]
	},
	{
		description: "identifier for sportsperson in the International Luge Federation (FIL) database",
		datatype: "external-id",
		id: "P2990",
		label: "FIL athlete ID",
		example: [
			60711,
			275519
		],
		types: [
		],
		aliases: [
			"Luge Federation ID",
			"ILF ID",
			"FIL ID",
			"International Luge Federation ID"
		]
	},
	{
		description: "identifier for an athlete on the International Swimming Federation website",
		datatype: "external-id",
		id: "P3408",
		label: "FINA athlete ID",
		example: [
			39562
		],
		types: [
		],
		aliases: [
			"International Swimming Federation athlete ID"
		]
	},
	{
		description: "identifier of a medical facility in France in the FINESS directory",
		datatype: "external-id",
		id: "P4058",
		label: "FINESS medical facility ID",
		example: [
			2867205,
			3117856
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a critic or filmmaker on the International Federation of Film Critics website",
		datatype: "external-id",
		id: "P8585",
		label: "FIPRESCI person ID",
		example: [
			31739654,
			613719,
			18935991
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier for countries and regions per former Federal Information Processing Standard FIPS 10-4",
		datatype: "external-id",
		id: "P901",
		label: "FIPS 10-4 (countries and regions)",
		example: [
			889,
			43210
		],
		types: [
		],
		aliases: [
			"fips country codes"
		]
	},
	{
		description: "Two-letter identifier for US states and other associated areas per former Federal Information Processing Standard FIPS 5-2 standard",
		datatype: "external-id",
		id: "P5086",
		label: "FIPS 5-2 alpha code (US states)",
		example: [
			1166,
			16645
		],
		types: [
		],
		aliases: [
			"FIPS 5-2 code",
			"FIPS string code for US states"
		]
	},
	{
		description: "Two-digit identifier for US states and other associated areas per former Federal Information Processing Standard FIPS 5-2 standard",
		datatype: "external-id",
		id: "P5087",
		label: "FIPS 5-2 numeric code (US states)",
		example: [
			1166,
			16645,
			695,
			25359
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"FIPS 5-2 code",
			"FIPS numeric code for US states"
		]
	},
	{
		description: "identifier for places in the United States per former Federal Information Processing Standard FIPS 55-3",
		datatype: "external-id",
		id: "P774",
		label: "FIPS 55-3 (locations in the US)",
		example: [
			2384658
		],
		types: [
		],
		aliases: [
			"Federal Information Processing Standard 55-3",
			"FIPS 55-3",
			"fips code for US locations"
		]
	},
	{
		description: "Identifier for US counties per former Federal Information Processing Standard FIPS 6-4. Is a five-digit code in which the first 2 digits are the state code and the remaining 3 digits are the county code.",
		datatype: "external-id",
		id: "P882",
		label: "FIPS 6-4 (US counties)",
		example: [
			488701,
			156168,
			500317,
			500317,
			13188841,
			506907,
			91481796,
			502230,
			20851010,
			506230
		],
		types: [
		],
		aliases: [
			"FIPS 6-4",
			"FIPS US counties",
			"INCITS 31-2009"
		]
	},
	{
		description: "identifier for a Nordic combined skier, in the International Ski Federation database",
		datatype: "external-id",
		id: "P2776",
		label: "FIS Nordic combined skier ID",
		example: [
			380143,
			20993687
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an alpine skier, in the International Ski Federation database",
		datatype: "external-id",
		id: "P2772",
		label: "FIS alpine skier ID",
		example: [
			30293,
			11485
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a cross-country skier, in the International Ski Federation database",
		datatype: "external-id",
		id: "P2773",
		label: "FIS cross-country skier ID",
		example: [
			231327,
			217505
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a freestyle skier, in the International Ski Federation database",
		datatype: "external-id",
		id: "P2774",
		label: "FIS freestyle skier ID",
		example: [
			264830,
			509781
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a ski jumper, in the International Ski Federation database",
		datatype: "external-id",
		id: "P2775",
		label: "FIS ski jumper ID",
		example: [
			15742,
			18620954
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a snowboarder, in the International Ski Federation database",
		datatype: "external-id",
		id: "P2777",
		label: "FIS snowboarder ID",
		example: [
			288656,
			264191
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a speed skier, in the International Ski Federation database",
		datatype: "external-id",
		id: "P5103",
		label: "FIS speed skier ID",
		example: [
			2887715
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a telemark skier in the International Ski Federation database",
		datatype: "external-id",
		id: "P6669",
		label: "FIS telemark skier ID",
		example: [
			1454913,
			60182077,
			19310083
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a beach volleyball player, in the FIVB database",
		datatype: "external-id",
		id: "P2801",
		label: "FIVB beach volleyball player ID",
		example: [
			537300,
			182106
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a species on the Fulgoromorpha Lists On the Web website",
		datatype: "external-id",
		id: "P6096",
		label: "FLOW ID",
		example: [
			10398269,
			58011880,
			10716570
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "external link to a brand's profile at the FMD (Fashion Model Directory) website",
		datatype: "external-id",
		id: "P2486",
		label: "FMD brand ID",
		example: [
			635484,
			28056374
		],
		types: [
		],
		aliases: [
			"Fashion Model Directory brand ID"
		]
	},
	{
		description: "external link to a designer's profile at the FMD (Fashion Model Directory) website",
		datatype: "external-id",
		id: "P2412",
		label: "FMD designer ID",
		example: [
			157054,
			868560,
			208415
		],
		types: [
		],
		aliases: [
			"Fashion Model Directory designer ID"
		]
	},
	{
		description: "external link to a magazine profile at the FMD (Fashion Model Directory) website",
		datatype: "external-id",
		id: "P2413",
		label: "FMD magazine ID",
		example: [
			158283,
			333644
		],
		types: [
		],
		aliases: [
			"Fashion Model Directory magazine ID"
		]
	},
	{
		description: "external link to a model's profile at the FMD (Fashion Model Directory) website",
		datatype: "external-id",
		id: "P2266",
		label: "FMD model ID",
		example: [
			5372335,
			77443
		],
		types: [
		],
		aliases: [
			"Fashion Model Directory model ID"
		]
	},
	{
		description: "external link to a photographer's profile at the FMD (Fashion Model Directory) website",
		datatype: "external-id",
		id: "P2485",
		label: "FMD photographer ID",
		example: [
			920752,
			14851360
		],
		types: [
		],
		aliases: [
			"Fashion Model Directory photographer ID"
		]
	},
	{
		description: "identifier of a video game in the FMV World database",
		datatype: "external-id",
		id: "P7665",
		label: "FMV World ID",
		example: [
			628953,
			1255182,
			219795,
			1636069
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a player at the 1fnl.ru",
		datatype: "external-id",
		id: "P7265",
		label: "FNL player ID",
		example: [
			4371614,
			16236256,
			2316037
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a decree type in the thesaurus of the Flemish organization for Immovable Heritage",
		datatype: "external-id",
		id: "P4310",
		label: "FOIH decree types ID",
		example: [
			2864346
		],
		types: [
		],
		aliases: [
			"Flemish organization for Immovable Heritage decree types ID",
			"Onroerend Erfgoed decree types ID"
		]
	},
	{
		description: "identifier for an event type in the thesaurus of the Flemish organization for Immovable Heritage",
		datatype: "external-id",
		id: "P4309",
		label: "FOIH event types ID",
		example: [
			191839,
			217102
		],
		types: [
		],
		aliases: [
			"Flemish organization for Immovable Heritage event types ID",
			"Onroerend Erfgoed event types ID"
		]
	},
	{
		description: "identifier for a heritage type in the thesaurus of the Flemish organization for Immovable Heritage",
		datatype: "external-id",
		id: "P4307",
		label: "FOIH heritage types ID",
		example: [
			160742,
			10145
		],
		types: [
		],
		aliases: [
			"Flemish organization for Immovable Heritage heritage types ID",
			"Onroerend Erfgoed heritage types ID"
		]
	},
	{
		description: "identifier for a type of material in the thesaurus of the Flemish organization for Immovable Heritage",
		datatype: "external-id",
		id: "P4304",
		label: "FOIH materials ID",
		example: [
			929186,
			1377111
		],
		types: [
		],
		aliases: [
			"Flemish organization for Immovable Heritage materials ID",
			"Onroerend Erfgoed materials ID"
		]
	},
	{
		description: "identifier for a period in the thesaurus of the Flemish organization for Immovable Heritage",
		datatype: "external-id",
		id: "P4306",
		label: "FOIH periods ID",
		example: [
			154611
		],
		types: [
		],
		aliases: [
			"Flemish organization for Immovable Heritage periods ID",
			"Onroerend Erfgoed periods ID"
		]
	},
	{
		description: "identifier for a person or an organization in the database of the Flemish organization for Immovable Heritage",
		datatype: "external-id",
		id: "P4206",
		label: "FOIH person ID",
		example: [
			154083,
			2246222
		],
		types: [
		],
		aliases: [
			"Flemish organization for Immovable Heritage person ID",
			"Onroerend Erfgoed person ID"
		]
	},
	{
		description: "identifier for a style or culture in the thesaurus of the Flemish organization for Immovable Heritage",
		datatype: "external-id",
		id: "P4305",
		label: "FOIH styles and cultures ID",
		example: [
			994776
		],
		types: [
		],
		aliases: [
			"Flemish organization for Immovable Heritage styles and cultures ID",
			"Onroerend Erfgoed styles and cultures ID"
		]
	},
	{
		description: "identifier for a taxon in the thesaurus of the Flemish organization for Immovable Heritage",
		datatype: "external-id",
		id: "P4311",
		label: "FOIH taxon ID",
		example: [
			936498,
			164898
		],
		types: [
		],
		aliases: [
			"Flemish organization for Immovable Heritage taxon ID",
			"Onroerend Erfgoed taxon ID",
			"FOIH species ID"
		]
	},
	{
		description: "identifier for a value type in the thesaurus of the Flemish organization for Immovable Heritage",
		datatype: "external-id",
		id: "P4308",
		label: "FOIH value types ID",
		example: [
			4801282
		],
		types: [
		],
		aliases: [
			"Flemish organization for Immovable Heritage value types ID",
			"Onroerend Erfgoed value types ID"
		]
	},
	{
		description: "rating of a film or video game in the South African media content rating system",
		datatype: "wikibase-item",
		id: "P4437",
		label: "FPB rating",
		example: [
			28056410
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person at the Russian Professional Boxing Federation",
		datatype: "external-id",
		id: "P6940",
		label: "FPBR person ID",
		example: [
			23656546,
			17129988,
			955619
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an economic data set provided by St. Louis Fed's Federal Reserve Economic Data (FRED)",
		datatype: "external-id",
		id: "P4113",
		label: "FRED time-series ID",
		example: [
			2304346,
			1516844
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "CPU front-side bus speed",
		datatype: "quantity",
		id: "P2150",
		label: "FSB speed",
		example: [
			15217736
		],
		types: [
			"for physical quantities"
		],
		aliases: [
			"front-side bus speed",
			"bus speed"
		]
	},
	{
		description: "permitted audience of a film, according to the German film-rating system (add Prüfnummer with qualifier \"P2676\")",
		datatype: "wikibase-item",
		id: "P1981",
		label: "FSK film rating",
		example: [
			72962
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a skater at FSkate.ru",
		datatype: "external-id",
		id: "P6624",
		label: "FSkate.ru skater ID",
		example: [
			41686780,
			240756,
			992223
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a video game on Facebook Gaming",
		datatype: "external-id",
		id: "P6913",
		label: "Facebook Gaming game ID",
		example: [
			29045915,
			17183996,
			50376633,
			17182512
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an official Facebook person, product or organization page (everything that follows URL part 'https://www.facebook.com/')",
		datatype: "external-id",
		id: "P2013",
		label: "Facebook ID",
		example: [
			4911143,
			8639,
			383541,
			9543
		],
		types: [
			"for items about people",
			"for items about organizations"
		],
		aliases: [
			"Facebook.com profile",
			"FB.com profile",
			"Facebook profile ID"
		]
	},
	{
		description: "official Facebook page of this entity (only for use with URLs containing \"/pages/\")",
		datatype: "external-id",
		id: "P4003",
		label: "Facebook ID name/number",
		example: [
			19879481,
			28006122
		],
		types: [
		],
		aliases: [
			"Facebook page ID",
			"Facebook ID from URL containing /pages/"
		]
	},
	{
		description: "identifier for a place in Facebook",
		datatype: "external-id",
		id: "P1997",
		label: "Facebook Places ID",
		example: [
			15923993,
			38555
		],
		types: [
		],
		aliases: [
			"FB Places ID"
		]
	},
	{
		description: "describes the special ablilites of an operatic singers voice",
		datatype: "wikibase-item",
		id: "P1731",
		label: "Fach",
		example: [
			57809
		],
		types: [
			"for items about people"
		],
		aliases: [
			"vocal specialization"
		]
	},
	{
		description: "identifier for an item in FactGrid",
		datatype: "external-id",
		id: "P8168",
		label: "FactGrid item ID",
		example: [
			1692667,
			5,
			187685
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an employee of the 'Faculté des sciences de Nancy' (1854-1950)",
		datatype: "external-id",
		label: "Faculté des sciences de Nancy ID",
		id: "P7974",
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID of a person in familysearch.org",
		datatype: "external-id",
		id: "P2889",
		label: "FamilySearch person ID",
		example: [
			764557,
			20667111,
			3044
		],
		types: [
		],
		aliases: [
			"Family Search person ID"
		]
	},
	{
		description: "identifier for a person on Familypedia, the genealogical database by Wikia",
		datatype: "external-id",
		id: "P4193",
		label: "Familypedia person ID",
		example: [
			5335826,
			3044,
			41142
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID for a baseball player in FanGraphs.com",
		datatype: "external-id",
		id: "P3574",
		label: "FanGraphs player ID",
		example: [
			8836120,
			3082652
		],
		types: [
		],
		aliases: [
			"Fangraphs ID"
		]
	},
	{
		description: "identifier for a film on Fandango.com",
		datatype: "external-id",
		id: "P5693",
		label: "Fandango film ID",
		example: [
			25188,
			595,
			167726
		],
		types: [
		],
		aliases: [
			"Fandango movie ID"
		]
	},
	{
		description: "identifier for a person in the Fandango film database",
		datatype: "external-id",
		id: "P8125",
		label: "Fandango performer ID",
		example: [
			6279,
			92764,
			335080
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "movie theater identifier at Fandango.com",
		datatype: "external-id",
		id: "P6644",
		label: "Fandango theater ID",
		example: [
			42421236,
			15032136,
			1122565,
			42538294
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film or other similar visual work on the FandangoNow website",
		datatype: "external-id",
		id: "P7970",
		label: "FandangoNow ID",
		example: [
			309153,
			377165,
			1670715
		],
		types: [
		],
		aliases: [
			"Fandango Now ID"
		]
	},
	{
		description: "identifier of an article on Fandom (Wikia). Format: subdomain:Page_title",
		datatype: "external-id",
		id: "P6262",
		label: "Fandom article ID",
		example: [
			1107971,
			52675597,
			283111
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Wikia article ID",
			"Fandom Wikia article ID"
		]
	},
	{
		description: "identifier of a topic's wiki, in Fandom.com",
		datatype: "external-id",
		id: "P4073",
		label: "Fandom wiki ID",
		example: [
			3577037,
			844,
			2306,
			79784
		],
		types: [
		],
		aliases: [
			"Wikia Wiki ID"
		]
	},
	{
		description: "identifier for the author in FantLab",
		datatype: "external-id",
		id: "P7433",
		label: "FantLab author ID",
		example: [
			297538,
			42,
			295406,
			497925
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for the award in FantLab",
		datatype: "external-id",
		id: "P7437",
		label: "FantLab award ID",
		example: [
			188914,
			194285,
			594886
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for the publisher in FantLab",
		datatype: "external-id",
		id: "P7438",
		label: "FantLab publisher ID",
		example: [
			2647037,
			536795,
			799732
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for the literary work in FantLab",
		datatype: "external-id",
		id: "P7439",
		label: "FantLab work ID",
		example: [
			1798059,
			3107329,
			2492950
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author on the Fantastic Fiction website",
		datatype: "external-id",
		id: "P5408",
		label: "Fantastic Fiction author ID",
		example: [
			318487,
			966228,
			583783
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a coach at FaroeSoccer.com",
		datatype: "external-id",
		id: "P6628",
		label: "FaroeSoccer coach ID",
		example: [
			4714903,
			11957238,
			6320294
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a player at FaroeSoccer.com",
		datatype: "external-id",
		id: "P6627",
		label: "FaroeSoccer player ID",
		example: [
			1548420,
			16202262,
			983085
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier on fatcat.wiki, a repository of scholarly articles maintained by the Internet Archive",
		datatype: "external-id",
		id: "P8608",
		label: "Fatcat ID",
		example: [
			37320797,
			85569563,
			96717780
		],
		types: [
			"for items about works",
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon in Fauna Europaea",
		datatype: "external-id",
		id: "P1895",
		label: "Fauna Europaea ID",
		example: [
			729,
			14582735
		],
		types: [
		],
		aliases: [
			"EU Nomen ID",
			"EU-nomen ID"
		]
	},
	{
		description: "identifier for a taxon at the Fauna Europaea portal launched end of 2016",
		datatype: "external-id",
		id: "P4807",
		label: "Fauna Europaea New ID",
		example: [
			28319
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a women's tennis player, in the Fed Cup database. Format: 9 digits",
		datatype: "external-id",
		id: "P2642",
		label: "Fed Cup player ID",
		example: [
			11677,
			197291
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a building designated by the   Federal Heritage Buildings Review Office of Canada",
		datatype: "external-id",
		id: "P3197",
		label: "Federal Heritage Buildings ID (Canada)",
		example: [
			5062237
		],
		types: [
		],
		aliases: [
			"Federal Heritage Buildings ID"
		]
	},
	{
		description: "Authority file ID in the United States Federal Register",
		datatype: "external-id",
		id: "P1544",
		label: "Federal Register Document Number",
		example: [
			5419885
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for libraries in the United States, assigned by the Institute of Museum and Library Services",
		datatype: "external-id",
		id: "P6618",
		label: "Federal-State Cooperative System ID",
		example: [
			20711698,
			4892087,
			27964109
		],
		types: [
		],
		aliases: [
			"FSCS ID"
		]
	},
	{
		description: "name of the official Fedora package",
		datatype: "external-id",
		id: "P3463",
		label: "Fedora package",
		example: [
			8038,
			698,
			971909
		],
		types: [
			"representing a unique identifier",
			"for software"
		],
		aliases: [
			"package, Fedora"
		]
	},
	{
		description: "Fellow ID of the Royal Society",
		datatype: "external-id",
		id: "P2070",
		label: "Fellow of the Royal Society ID",
		example: [
			106494,
			80,
			36812,
			23979128,
			1523750
		],
		types: [
		],
		aliases: [
			"FRS ID",
			"Royal Society person ID",
			"Royal Society ID"
		]
	},
	{
		description: "identifier for a woman, in the FemBio database",
		datatype: "external-id",
		id: "P6722",
		label: "FemBio ID",
		example: [
			180989,
			36740,
			215139
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author on Figshare",
		datatype: "external-id",
		id: "P4232",
		label: "Figshare author ID",
		example: [
			60319741,
			38382414
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier on the \"Just Solve the File Format Problem\"/File Format(s) wiki",
		datatype: "external-id",
		id: "P3381",
		label: "File Format Wiki page ID",
		example: [
			295711,
			856
		],
		types: [
		],
		aliases: [
			"FFW ID"
		]
	},
	{
		description: "Indonesian Movie database ID",
		datatype: "external-id",
		id: "P5820",
		label: "Film Indonesia ID",
		example: [
			4038964,
			5651324,
			7074606
		],
		types: [
		],
		aliases: [
			"Film Indonesia film ID"
		]
	},
	{
		description: "ID number on the Film Indonesia for the person and film studio",
		datatype: "external-id",
		id: "P5941",
		label: "Film Indonesia person ID",
		example: [
			7478484,
			5262511,
			56085408
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "FilmAffinity identification number of a creative work",
		datatype: "external-id",
		id: "P480",
		label: "FilmAffinity ID",
		example: [
			161678,
			55262219,
			27957869
		],
		types: [
		],
		aliases: [
			"Filmaffinity",
			"filmaffinity",
			"FilmAffinity identifier"
		]
	},
	{
		description: "identifier for film festivals in the FilmFreeway.com database",
		datatype: "external-id",
		id: "P6762",
		label: "FilmFreeway ID",
		example: [
			15139035,
			7054491,
			28405121,
			5095662,
			5025786,
			2985163
		],
		types: [
		],
		aliases: [
			"Film Freeway ID"
		]
	},
	{
		description: "identifier for person, film (movie), or TV series, in the filmpolski.pl database",
		datatype: "external-id",
		id: "P3495",
		label: "FilmPolski.pl ID",
		example: [
			28152715,
			106685
		],
		types: [
		],
		aliases: [
			"filmpolski ID"
		]
	},
	{
		description: "identifier for a TV serie at FilmTv.it",
		datatype: "external-id",
		id: "P5255",
		label: "FilmTv.it TV series ID",
		example: [
			438406
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a movie at FilmTv.it",
		datatype: "external-id",
		id: "P5253",
		label: "FilmTv.it movie ID",
		example: [
			2257063,
			129437
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person at FilmTv.it",
		datatype: "external-id",
		id: "P5254",
		label: "FilmTv.it person ID",
		example: [
			4616,
			217033,
			42745
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifiers for films in the Filmfront, a Norwegian movie database",
		datatype: "external-id",
		id: "P7975",
		label: "Filmfront film ID",
		example: [
			11996817,
			19376541,
			11957654,
			42051,
			1755719,
			1198825
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "person identifier in Filmfront, a Norwegian movie database",
		datatype: "external-id",
		id: "P8037",
		label: "Filmfront person ID",
		example: [
			113444,
			4580312,
			1697788,
			12007722
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "rating of a film in the former (2004–2011) Hungarian film rating system",
		datatype: "wikibase-item",
		id: "P2747",
		label: "Filmiroda rating",
		example: [
			681962
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film in the Filmový přehled database",
		datatype: "external-id",
		id: "P7519",
		label: "Filmový přehled film ID",
		example: [
			3227301,
			72913538,
			910705
		],
		types: [
		],
		aliases: [
			"filmovyprehled film ID"
		]
	},
	{
		description: "identifier for a person or organisation in the Filmový přehled database",
		datatype: "external-id",
		id: "P7520",
		label: "Filmový přehled person ID",
		example: [
			235032,
			273185,
			1472757
		],
		types: [
		],
		aliases: [
			"filmovyprehled person ID"
		]
	},
	{
		description: "identifier at the Filmow database of films and TV shows",
		datatype: "external-id",
		id: "P5233",
		label: "Filmow ID",
		example: [
			53679951,
			217033,
			751130
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of the German Filmportal.de",
		datatype: "external-id",
		id: "P2639",
		label: "Filmportal ID",
		example: [
			22338427,
			44426,
			1651169
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a movie on www.filmstarts.de",
		datatype: "external-id",
		id: "P8531",
		label: "Filmstarts title ID",
		example: [
			21095960,
			67400758,
			169103,
			939325,
			367163,
			190908
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for person, film (movie), TV series or videogame, in the filmweb.pl database",
		datatype: "external-id",
		id: "P3995",
		label: "Filmweb.pl ID",
		example: [
			129813,
			179460,
			2263
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a movie or series at filmweb.pl",
		datatype: "external-id",
		id: "P5032",
		label: "Filmweb.pl film ID",
		example: [
			23572,
			21935651
		],
		types: [
		],
		aliases: [
			"Filmweb.pl series ID"
		]
	},
	{
		description: "identifier for a person at filmweb.pl",
		datatype: "external-id",
		id: "P5033",
		label: "Filmweb.pl person ID",
		example: [
			310556,
			253183,
			19677216
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a rugby player on finalesrugby.fr website",
		datatype: "external-id",
		id: "P8382",
		label: "Finales Rugby ID",
		example: [
			3383662,
			19900769,
			19951953
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Find & Connect website by the Australian Government about orphanages, children's Homes, and other institutions",
		datatype: "external-id",
		id: "P6946",
		label: "Find & Connect ID",
		example: [
			56759506,
			64734995,
			7374599,
			5168096
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier assigned to a cemetery at Find A Grave",
		datatype: "external-id",
		id: "P2025",
		label: "Find A Grave cemetery ID",
		example: [
			2972519,
			311
		],
		types: [
		],
		aliases: [
			"FindAGrave cemetery ID"
		]
	},
	{
		description: "identifier of an individual's burial place in the Find a Grave database",
		datatype: "external-id",
		id: "P535",
		label: "Find A Grave memorial ID",
		example: [
			352999,
			3044,
			505270
		],
		types: [
		],
		aliases: [
			"FaG ID",
			"FaGID",
			"GRid",
			"Findagrave ID",
			"Find A Grave grave ID",
			"Find A Grave person ID"
		]
	},
	{
		description: "identifier for artists listed in Find New Zealand Artists online database",
		datatype: "external-id",
		id: "P6792",
		label: "Find NZ Artists ID",
		example: [
			5145349,
			7336470,
			4911067
		],
		types: [
			"representing a unique identifier",
			"for items about people"
		],
		aliases: [
			"FNZA ID",
			"Find NZ Artists ID",
			"Find New Zealand Artists ID"
		]
	},
	{
		description: "identifier for Danish companies serving food",
		datatype: "external-id",
		id: "P3152",
		label: "Findsmiley ID",
		example: [
			48592
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for species found in Finland maintained by the Finnish Biodiversity Information Facility",
		datatype: "external-id",
		id: "P7552",
		label: "Finnish Biodiversity Information Facility's Species List ID",
		example: [
			824885,
			1671461,
			10586824
		],
		types: [
		],
		aliases: [
			"Suomen Lajitietokeskus ID"
		]
	},
	{
		description: "ID for a lake in the Järviwiki database of Finnish lakes over 1 ha in extent.",
		datatype: "external-id",
		id: "P3394",
		label: "Finnish Lake ID",
		example: [
			11886840
		],
		types: [
		],
		aliases: [
			"Järviwiki",
			"Järviwiki ID",
			"Lake ID (Finland)"
		]
	},
	{
		description: "identifier of a lighthouse or beacon in the Finnish List of Lights, issued by the Finnish Transport Agency",
		datatype: "external-id",
		id: "P4143",
		label: "Finnish List of Lights ID",
		example: [
			18682659,
			31087596
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "code of the entry on the Finnish parliament database",
		datatype: "external-id",
		id: "P2181",
		label: "Finnish MP ID",
		example: [
			256001
		],
		types: [
		],
		aliases: [
			"Eduskunta ID"
		]
	},
	{
		description: "code of the entry on the Finnish ministers database",
		datatype: "external-id",
		id: "P2182",
		label: "Finnish Ministers database ID",
		example: [
			317485
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for people in the Finnish National Gallery",
		datatype: "external-id",
		id: "P4177",
		label: "Finnish National Gallery artist ID",
		example: [
			236985,
			47812
		],
		types: [
		],
		aliases: [
			"Finnish National Gallery person ID",
			"Finnish National Gallery actor ID",
			"FNG ID"
		]
	},
	{
		description: "identifier for Finnish companies up to 31 March 2001, predecessor to the Business Identity Code",
		datatype: "external-id",
		id: "P6775",
		label: "Finnish Trade Register ID",
		example: [
			61052782,
			2563295,
			11858037,
			20251782
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for the Archaeological heritage register for items in mainland Finland",
		datatype: "external-id",
		id: "P4106",
		label: "Finnish archaeological heritage ID",
		example: [
			3773755
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "The web publication of the Finnish Literature Society presents almost 500 Finnish generals and admirals in the service of the Inperial Russian Army.",
		datatype: "external-id",
		id: "P7615",
		label: "Finnish generals and admirals in the Imperial Russian Army 1809–1917 ID",
		example: [
			11850794,
			152306,
			11862391
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a municipality in Finland",
		datatype: "external-id",
		id: "P1203",
		label: "Finnish municipality number",
		example: [
			125080
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Finnish national bibliography corporate names database covers the recommended forms of corporate and creator names that the National Library of Finland has produced in the process of tagging the national bibliography.",
		datatype: "external-id",
		id: "P5266",
		label: "Finnish national bibliography corporate name ID",
		example: [
			1146592,
			643412,
			43510
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "unique identifier for a Firefox add-on",
		datatype: "external-id",
		id: "P8579",
		label: "Firefox add-on ID",
		example: [
			17940363,
			1566093,
			17559386
		],
		types: [
			"for software"
		],
		aliases: [
		]
	},
	{
		description: "Austrian company register ID",
		datatype: "external-id",
		id: "P5285",
		label: "Firmenbuchnummer",
		example: [
			688816
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"FN"
		]
	},
	{
		description: "identifier for a species in FishBase",
		datatype: "external-id",
		id: "P938",
		label: "FishBase species ID",
		example: [
			401586
		],
		types: [
		],
		aliases: [
			"fishbase",
			"FishBase species identifier",
			"FishBase ID"
		]
	},
	{
		description: "identifier for a flag in the Flags of the World database",
		datatype: "external-id",
		id: "P3089",
		label: "Flags of the World ID",
		example: [
			122482
		],
		types: [
		],
		aliases: [
			"FOTW ID"
		]
	},
	{
		description: "identifier of an organisation in the Flanders Arts Institute database for performing arts",
		datatype: "external-id",
		id: "P5164",
		label: "Flanders Arts Institute organisation ID",
		example: [
			4832513
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person in the Flanders Arts Institute database for performing arts",
		datatype: "external-id",
		id: "P5068",
		label: "Flanders Arts Institute person ID",
		example: [
			2424727
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Kunstenpunt person ID",
			"data.kunsten.be person ID"
		]
	},
	{
		description: "identifier of an production in the Flanders Arts Institute database for performing arts",
		datatype: "external-id",
		id: "P5935",
		label: "Flanders Arts Institute production ID",
		example: [
			56556409,
			29583396,
			50060762
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a venue in the Flanders Arts Institute database for performing arts",
		datatype: "external-id",
		id: "P3820",
		label: "Flanders Arts Institute venue ID",
		example: [
			1950513
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the Flanders Music Centre website",
		datatype: "external-id",
		id: "P5410",
		label: "Flanders Music Centre person ID",
		example: [
			52835387,
			52556419,
			313453
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a match (association football, basketball, rugby, ice hockey, etc.) in the FlashScore.com database",
		datatype: "external-id",
		id: "P7460",
		label: "FlashScore.com match ID",
		example: [
			30010494,
			55388936,
			48841609
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a player at the FlashScore.com",
		datatype: "external-id",
		id: "P8259",
		label: "FlashScore.com player ID",
		example: [
			1354960,
			2529972,
			139075
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a sports team in the FlashScore.com database",
		datatype: "external-id",
		id: "P7876",
		label: "FlashScore.com team ID",
		example: [
			104770,
			1130849,
			472805,
			172969,
			19683099,
			853056
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID of an application on Flathub, the Flatpak repository.",
		datatype: "external-id",
		id: "P4655",
		label: "Flathub ID",
		example: [
			20739542,
			1936840
		],
		types: [
			"representing a unique identifier",
			"for software"
		],
		aliases: [
			"Flathub package",
			"package, Flathub"
		]
	},
	{
		description: "identifier for a \"relict\" in the database of the Flemish organization for Immovable Heritage",
		datatype: "external-id",
		id: "P1764",
		label: "Flemish Heritage Object ID",
		example: [
			1170767,
			724805
		],
		types: [
		],
		aliases: [
			"Onroerend Erfgoed-id",
			"Flemish organization for Immovable Heritage relict ID",
			"Onroerend Erfgoed relict ID",
			"Erfgoedobject",
			"FOIH relict ID"
		]
	},
	{
		description: "identifier for a person on the website of the Flemish Parliament",
		datatype: "external-id",
		id: "P3297",
		label: "Flemish Parliament person ID",
		example: [
			21623623
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "authority control identifier of the Flemish Public Libraries",
		datatype: "external-id",
		id: "P7024",
		label: "Flemish Public Libraries ID",
		example: [
			19185,
			1299,
			811389
		],
		types: [
		],
		aliases: [
			"VLACC ID"
		]
	},
	{
		description: "identifier for a person or organisation, with an account at Flickr",
		datatype: "external-id",
		id: "P3267",
		label: "Flickr user ID",
		example: [
			5981474,
			193701
		],
		types: [
			"for items about people"
		],
		aliases: [
			"Flickr ID",
			"Flickr",
			"Flickr username",
			"Flickr account"
		]
	},
	{
		description: "identifier for a plant taxon, in an Australian Commonwealth database",
		datatype: "external-id",
		id: "P6756",
		label: "Flora of Australia ID (new)",
		example: [
			284504,
			1394414,
			15289734,
			101680
		],
		types: [
		],
		aliases: [
			"ABRS ID",
			"Flora of Australia ID"
		]
	},
	{
		description: "identifier for a plant taxon, in the Flora of Australia Online",
		datatype: "external-id",
		id: "P3100",
		label: "Flora of Australia ID (old)",
		example: [
			4670994
		],
		types: [
		],
		aliases: [
			"Flora of Australia ID"
		]
	},
	{
		description: "identifier for a taxon in Flora of the People's Republic of China",
		datatype: "external-id",
		id: "P1747",
		label: "Flora of China ID",
		example: [
			25308
		],
		types: [
		],
		aliases: [
			"eFloras ID"
		]
	},
	{
		description: "identifier for a plant taxon or cultivar in the Flora of Israel Online database",
		datatype: "external-id",
		id: "P3795",
		label: "Flora of Israel Online plant ID",
		example: [
			156117,
			511179,
			844270
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon in the Flora of North America database",
		datatype: "external-id",
		id: "P1727",
		label: "Flora of North America taxon ID",
		example: [
			25308,
			27749
		],
		types: [
		],
		aliases: [
			"FNA"
		]
	},
	{
		description: "identifier for a taxon on the Flora of Wisconsin website",
		datatype: "external-id",
		id: "P6227",
		label: "Flora of Wisconsin ID",
		example: [
			161364,
			15238331,
			39063901
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a plant taxon, in the Government of Western Australia's FloraBase database",
		datatype: "external-id",
		id: "P3101",
		label: "FloraBase ID",
		example: [
			140902
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a plant taxon in the FloraCatalana database",
		datatype: "external-id",
		id: "P5179",
		label: "FloraCatalana ID",
		example: [
			150411,
			500
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a species on the FloraWeb website",
		datatype: "external-id",
		id: "P6094",
		label: "FloraWeb ID",
		example: [
			160502,
			159845,
			158590
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an artwork in the inventory of the Palatine Gallery, Palazzo Pitti of Florentine museums",
		datatype: "external-id",
		id: "P3504",
		label: "Florentine Inventario Palatina art ID",
		example: [
			532486,
			3937768
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "national florentine musea inventory from 1890 identifier",
		datatype: "external-id",
		id: "P1726",
		label: "Florentine musea Inventario 1890 ID",
		example: [
			15974334
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for artworks from the catalogue of the national Florentine musea",
		datatype: "external-id",
		id: "P2242",
		label: "Florentine musea catalogue ID",
		example: [
			3937502,
			3982381
		],
		types: [
			"multi-source external identifier",
			"for items about works"
		],
		aliases: [
		]
	},
	{
		description: "identifier for Florida historical markers at Florida Division of Historical Resources website",
		datatype: "external-id",
		id: "P6567",
		label: "Florida Historical Marker List ID",
		example: [
			18011406,
			4952578,
			220480
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete on the Florida Sports Hall of Fame website",
		datatype: "external-id",
		id: "P4347",
		label: "Florida Sports Hall of Fame athlete ID",
		example: [
			3663603,
			2271392
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifer for plant taxons",
		datatype: "external-id",
		id: "P7546",
		label: "Flowers of India ID",
		example: [
			4790962,
			10801011,
			157663
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier for a gene in the FlyBase database of Drosophila genes and genomes",
		datatype: "external-id",
		id: "P3852",
		label: "FlyBase Gene ID",
		example: [
			976767
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a football (soccer) player's page at Fogis.se, a Swedish Football Association database",
		datatype: "external-id",
		id: "P5038",
		label: "Fogis.se player ID",
		example: [
			46896,
			23014090
		],
		types: [
		],
		aliases: [
			"Fotbollens Gemensamma Informationssystem ID",
			"Swedish Football Association player ID"
		]
	},
	{
		description: "identifier for an artist on the website of the Fondation Maeght, a French museum",
		datatype: "external-id",
		id: "P6525",
		label: "Fondation Maeght artist ID",
		example: [
			26408,
			544899,
			435149
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of chemical compound in FooDB",
		datatype: "external-id",
		id: "P8117",
		label: "FooDB compound ID",
		example: [
			60235,
			5002498,
			4634071
		],
		types: [
			"related to chemistry",
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier within the FoodEx2 (version 2 of the EFSA Food classification and description system for exposure assessment) food taxonomy",
		datatype: "external-id",
		id: "P4637",
		label: "FoodEx2 code",
		example: [
			687579
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for FoodOn, an ontology focused on categorization and processing of food for humans",
		datatype: "external-id",
		id: "P6767",
		label: "FoodOn ID",
		example: [
			89,
			184357,
			13191
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID of a player by Football Federation of Ukraine",
		datatype: "external-id",
		id: "P3662",
		label: "Football Federation of Ukraine player ID",
		example: [
			2711514,
			2491826
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "rank in the Deloitte Football Money League",
		datatype: "quantity",
		id: "P6697",
		label: "Football Money League rank",
		example: [
			1386924,
			1543,
			3347591,
			18741
		],
		types: [
		],
		aliases: [
			"Deloitte Football Rank"
		]
	},
	{
		description: "identifier for person on site football.odessa.ua",
		datatype: "external-id",
		id: "P6415",
		label: "Football.Odessa.ua person ID",
		example: [
			9371470,
			18015410,
			16723384
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a female association football (soccer) player on the femminile.football.it website",
		datatype: "external-id",
		id: "P5628",
		label: "Football.it female player ID",
		example: [
			17386073,
			524644,
			1314172
		],
		types: [
		],
		aliases: [
			"femminile.football.it player ID"
		]
	},
	{
		description: "identifier for a association football player at FootballDatabase.eu",
		datatype: "external-id",
		id: "P3537",
		label: "FootballDatabase.eu player ID",
		example: [
			10781,
			166238,
			201367,
			50709615
		],
		types: [
		],
		aliases: [
			"FootballDatabase.eu ID"
		]
	},
	{
		description: "identifier for a association football (soccer) team in the FootballDatabase.eu database",
		datatype: "external-id",
		id: "P7351",
		label: "FootballDatabase.eu team ID",
		example: [
			1339086,
			81888,
			8682
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID for a football player at FootballFacts.ru",
		datatype: "external-id",
		id: "P3660",
		label: "FootballFacts.ru player ID",
		example: [
			26776746
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a association football (soccer) team in the FootballFacts.ru database",
		datatype: "external-id",
		id: "P7358",
		label: "FootballFacts.ru team ID",
		example: [
			211477,
			172969,
			29112
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a female association football player on the Footoféminin.fr website",
		datatype: "external-id",
		id: "P4262",
		label: "Footoféminin.fr player ID",
		example: [
			16648117,
			514919
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ForaDeJogo.net identifier for an association football (soccer) manager",
		datatype: "external-id",
		id: "P3661",
		label: "ForaDeJogo manager ID",
		example: [
			465049
		],
		types: [
		],
		aliases: [
			"Fora De Jogo manager ID"
		]
	},
	{
		description: "ForaDeJogo.net identifier for an association football (soccer) player",
		datatype: "external-id",
		id: "P3046",
		label: "ForaDeJogo player ID",
		example: [
			186071,
			105887
		],
		types: [
		],
		aliases: [
			"Fora De Jogo player ID"
		]
	},
	{
		description: "identifier for a association football (soccer) team in the ForaDeJogo.net database",
		datatype: "external-id",
		id: "P7412",
		label: "ForaDeJogo.net team ID",
		example: [
			1387105,
			75729,
			635326
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for foreign war churchyards in Norway",
		datatype: "external-id",
		id: "P8387",
		label: "Foreign war churchyards in Norway ID",
		example: [
			14247277,
			4288273,
			5982166,
			19378115
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique identifier of a certificate issued by the Forest Stewardship Council",
		datatype: "external-id",
		id: "P8118",
		label: "Forest Stewardship Council Certificate Code",
		example: [
			1741634,
			7936675,
			1473137
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique identifier of a license issued by the Forest Stewardship Council",
		datatype: "external-id",
		id: "P8128",
		label: "Forest Stewardship Council License Code",
		example: [
			1741634,
			7936675,
			1473137
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "string that identifies uniquely an item using a Formal Public Identifier according to the ISO/IEC 9070:1991 standard",
		datatype: "string",
		id: "P4506",
		label: "Formal Public Identifier",
		example: [
			3782232,
			624610
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for football player on site Slovak Fortuna liga",
		datatype: "external-id",
		id: "P7530",
		label: "Fortuna liga player ID",
		example: [
			6792146,
			8920531,
			32147620,
			4797435
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for fossils at fossiilid.info",
		datatype: "external-id",
		id: "P7346",
		label: "Fossiilid.info ID",
		example: [
			6596143,
			874843,
			174301
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P7720",
		label: "Fossilworks ID for journal article",
		example: [
			77747550,
			56555668,
			21089640
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an animal, plant, or microorganism in the Fossilworks database",
		datatype: "external-id",
		id: "P842",
		label: "Fossilworks taxon ID",
		example: [
			1093139
		],
		types: [
		],
		aliases: [
			"paleodb",
			"fossilworks",
			"paleobiodb"
		]
	},
	{
		description: "ID for a football player at Fotbal DNES",
		datatype: "external-id",
		id: "P3663",
		label: "Fotbal DNES player ID",
		example: [
			180581
		],
		types: [
		],
		aliases: [
			"iDNES.cz"
		]
	},
	{
		description: "identifier for a photographer, in the Dutch fotografen.nl database",
		datatype: "external-id",
		id: "P3269",
		label: "Fotografen.nl ID",
		example: [
			19509427
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person in Fototeka (Polish National Film Archive)",
		datatype: "external-id",
		id: "P8511",
		label: "Fototeka person ID",
		example: [
			460247,
			272433
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for human anatomical terminology",
		datatype: "string",
		id: "P1402",
		label: "Foundational Model of Anatomy ID",
		example: [
			178366,
			1640882
		],
		types: [
		],
		aliases: [
			"FMA",
			"Foundational Model of  Anatomy"
		]
	},
	{
		description: "ID of a place in Foursquare",
		datatype: "external-id",
		id: "P1968",
		label: "Foursquare venue ID",
		example: [
			15923993,
			19877
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for public bodies from FragDenStaat.de",
		datatype: "external-id",
		id: "P6744",
		label: "FragDenStaat public body ID",
		example: [
			502698,
			699656,
			492234
		],
		types: [
		],
		aliases: [
			"FragDenStaat agency ID"
		]
	},
	{
		description: "unique identifier in the Framalibre free software directory",
		datatype: "external-id",
		id: "P4107",
		label: "Framalibre ID",
		example: [
			1139644
		],
		types: [
			"for software"
		],
		aliases: [
			"Framalibre software ID"
		]
	},
	{
		description: "identifier for a person on the France Culture website",
		datatype: "external-id",
		id: "P5301",
		label: "France Culture person ID",
		example: [
			64219617,
			443884,
			40676142
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the France Musique website",
		datatype: "external-id",
		id: "P5654",
		label: "France Musique person ID",
		example: [
			536009,
			241005,
			109053,
			3100666
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an article in the Frankfurter Personenlexikon",
		datatype: "external-id",
		id: "P8044",
		label: "Frankfurter Personenlexikon ID",
		example: [
			1825271,
			152388,
			154014
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a French resistance fighter on Français libres",
		datatype: "external-id",
		id: "P7696",
		label: "Français libres ID",
		example: [
			76982533,
			2042,
			632
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for entries in the ARIADNE “Frauen in Bewegung 1848–1938” database, published by the Austrian National Library",
		datatype: "external-id",
		id: "P8544",
		label: "Frauen in Bewegung 1848–1938 ID",
		example: [
			28025342,
			78858,
			73138706
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Link to the FSD page on a given software or license",
		datatype: "external-id",
		id: "P2537",
		label: "Free Software Directory entry",
		example: [
			673698,
			1252773
		],
		types: [
			"for software"
		],
		aliases: [
			"FSF",
			"FSF directory",
			"directory.fsf.org",
			"FSD entry"
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P7427",
		label: "FreeBSD port",
		example: [
			8038,
			698,
			264678
		],
		types: [
			"representing a unique identifier",
			"for software"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a page in the Freebase database. Format: \"/m/0\" followed by 2 to 7 characters. For those starting with \"/g/\", use Google Knowledge Graph identifier (P2671)",
		datatype: "external-id",
		id: "P646",
		label: "Freebase ID",
		example: [
			2013,
			1860,
			42,
			712504
		],
		types: [
		],
		aliases: [
			"Freebase identifier",
			"MID"
		]
	},
	{
		description: "identifier for a resident on the French Academy in Rome website",
		datatype: "external-id",
		id: "P5466",
		label: "French Academy in Rome resident ID",
		example: [
			2308644,
			10556500,
			54932661
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a member of the French Academy of Sciences on its website",
		datatype: "external-id",
		id: "P6282",
		label: "French Academy of Sciences member ID",
		example: [
			1302803,
			21481858,
			473926
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete on the French Athletics Federation website",
		datatype: "external-id",
		id: "P3767",
		label: "French Athletics Federation athlete ID",
		example: [
			5651521,
			28872558
		],
		types: [
		],
		aliases: [
			"Fédération française d'athlétisme athlete ID",
			"FFA athlete ID"
		]
	},
	{
		description: "identifier of a structure in the guide of the French Catholic Church, edited by the Bishops' Conference of France",
		datatype: "external-id",
		id: "P3396",
		label: "French Catholic Church structure ID",
		example: [
			1242250,
			2823659
		],
		types: [
		],
		aliases: [
			"Guide of the French Church structure ID"
		]
	},
	{
		description: "identifier for a member of the French National Assembly on the official website (do not confuse with Sycomore ID)",
		datatype: "external-id",
		id: "P4123",
		label: "French National Assembly ID",
		example: [
			2920825
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an individual lobbyist or lobbying organisation, at the French National Assembly",
		datatype: "external-id",
		id: "P3281",
		label: "French National Assembly Lobbyist ID",
		example: [
			13646,
			16325240
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a French athlete on the French Olympic Committee's EspritBleu website",
		datatype: "external-id",
		id: "P4050",
		label: "French Olympic Committee athlete ID",
		example: [
			242959,
			930934
		],
		types: [
		],
		aliases: [
			"EspritBleu ID",
			"IEBleu",
			"EspritBleu athlete ID"
		]
	},
	{
		description: "identifier in the French Sculpture Census",
		datatype: "external-id",
		id: "P2380",
		label: "French Sculpture Census artist ID",
		example: [
			2403645
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a sculpture in the French Sculpture Census",
		datatype: "external-id",
		id: "P3386",
		label: "French Sculpture Census work ID",
		example: [
			22023008
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of the article in French Vikidia",
		datatype: "external-id",
		id: "P7818",
		label: "French Vikidia ID",
		example: [
			68,
			1321,
			96
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"frvd",
			"Vikidia article in French",
			"article in French Vikidia"
		]
	},
	{
		description: "identifier for a person in the French diocesan architects index",
		datatype: "external-id",
		id: "P2385",
		label: "French diocesan architects ID",
		example: [
			272912
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the French national research structure repertory",
		datatype: "external-id",
		id: "P3016",
		label: "French national research structure identifier",
		example: [
			3214404
		],
		types: [
		],
		aliases: [
			"national research structure identifier (France)",
			"RNSR ID"
		]
	},
	{
		description: "identifier for French public services",
		datatype: "external-id",
		id: "P6671",
		label: "French public service directory ID",
		example: [
			16635111,
			3315433,
			56827589,
			21205903,
			13636,
			40104
		],
		types: [
		],
		aliases: [
			"service-public.fr ID",
			"French public service directory service-public.fr ID",
			"ServicePublic",
			"SP.fr"
		]
	},
	{
		description: "standard for sizes of canvases for use by artists",
		datatype: "wikibase-item",
		id: "P5070",
		label: "French standard size for oil paintings",
		example: [
			634122
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier from the Frick Art Reference Library Artist File",
		datatype: "external-id",
		id: "P7848",
		label: "Frick Art Reference Library Artist File ID",
		example: [
			4664366,
			63933539,
			450110,
			161336
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"FARL Artist File ID"
		]
	},
	{
		description: "identifier of a species in FrogMAP - The Atlas of African Frogs encyclopedia",
		datatype: "external-id",
		id: "P6704",
		label: "FrogMAP ID",
		example: [
			4671689,
			787959,
			2209450,
			639022
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"The Atlas of African Frogs ID"
		]
	},
	{
		description: "identifier for an artwork by Francisco Goya on the Fundación Goya en Aragón website",
		datatype: "external-id",
		id: "P7229",
		label: "Fundación Goya en Aragón ID",
		example: [
			66604875,
			2735507,
			952796
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an independent Baptist church at Fundamental.org",
		datatype: "external-id",
		id: "P6892",
		label: "Fundamental.org Baptist Church ID",
		example: [
			64746812,
			5061976,
			64667189
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier at Fussballdaten.de, a German language website which predominantly collects comprehensive statistics on the top five tiers of German football",
		datatype: "external-id",
		id: "P3538",
		label: "Fussballdaten.de player ID",
		example: [
			1081201,
			4457,
			615134,
			312895,
			203258
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a association football (soccer) team in the Fussballdaten.de database",
		datatype: "external-id",
		id: "P7495",
		label: "Fussballdaten.de team ID",
		example: [
			104761,
			4512,
			819400,
			1422
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a player at Futbolme website",
		datatype: "external-id",
		id: "P7399",
		label: "Futbolme player ID",
		example: [
			5938192,
			4282518,
			20641393
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "AMFR identifier for a futsal player",
		datatype: "external-id",
		id: "P6320",
		label: "Futsal Association of Russia player ID",
		example: [
			4056630,
			3808558,
			4484189
		],
		types: [
		],
		aliases: [
			"AMFR player ID"
		]
	},
	{
		description: "ID for a football player at Futsal Planet",
		datatype: "external-id",
		id: "P3664",
		label: "Futsal Planet player ID",
		example: [
			4519939
		],
		types: [
		],
		aliases: [
			"Fut5al Planet"
		]
	},
	{
		description: "identifier for a building in Fuzhou Architecture Heritage",
		datatype: "external-id",
		id: "P6469",
		label: "Fuzhou Architecture Heritage ID",
		example: [
			61054639,
			10865004,
			11076656
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a concept in the Global Agricultural Concept Scheme",
		datatype: "external-id",
		id: "P4427",
		label: "GACS ID",
		example: [
			5465509,
			45761,
			161426
		],
		types: [
		],
		aliases: [
			"Global Agricultural Concept Scheme ID"
		]
	},
	{
		description: "identifier of a media format in the thesaurus of the Game Metadata and Citation Project",
		datatype: "external-id",
		id: "P5371",
		label: "GAMECIP media format ID",
		example: [
			37753524,
			47770,
			17048824
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a computer game platform in the thesaurus of the Game Metadata and Citation Project",
		datatype: "external-id",
		id: "P5379",
		label: "GAMECIP platform ID",
		example: [
			184198,
			1406,
			11248
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a rare disease in the United States National Institutes of Health's Genetic and Rare Diseases (GARD) Information Center database",
		datatype: "external-id",
		id: "P4317",
		label: "GARD rare disease ID",
		example: [
			1022635
		],
		types: [
			"representing a unique identifier",
			"related to medicine"
		],
		aliases: [
			"Genetic and Rare Diseases Information Center ID",
			"GARD ID"
		]
	},
	{
		description: "identifier of a video game in the GBAtemp database",
		datatype: "external-id",
		id: "P7915",
		label: "GBAtemp game ID",
		example: [
			795365,
			219795,
			618610,
			317620,
			2591858,
			1757876,
			24806656,
			840409,
			15199106
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a comic book series in the Grand Comics Database (GCD)",
		datatype: "external-id",
		id: "P3589",
		label: "GCD series ID",
		example: [
			7075926,
			128444,
			4868871
		],
		types: [
		],
		aliases: [
			"Grand Comics Database series ID",
			"GCD series",
			"comics.org series ID"
		]
	},
	{
		description: "unique identifier of a product which has been certified by the Global Certification Forum",
		datatype: "external-id",
		id: "P7336",
		label: "GCF Reference",
		example: [
			57393177,
			67174340,
			66023618
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID of a church on GCatholic.org",
		datatype: "external-id",
		id: "P2971",
		label: "GCatholic church ID",
		example: [
			2981,
			21093541
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a diocese on GCatholic.org",
		datatype: "external-id",
		id: "P8389",
		label: "GCatholic diocese ID",
		example: [
			1364015,
			876875,
			44300386
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of a person on GCatholic.org",
		datatype: "external-id",
		id: "P8366",
		label: "GCatholic person ID",
		example: [
			181715,
			9357310,
			44490,
			51880
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "gross domestic product (GDP) at purchasing power parity (current international $)",
		datatype: "quantity",
		id: "P4010",
		label: "GDP (PPP)",
		example: [
			30
		],
		types: [
			"related to economics",
			"for places"
		],
		aliases: [
			"GDP PPP",
			"PPP GDP",
			"gross domestic product (PPP)"
		]
	},
	{
		description: "identifier of a film company in the German Early Cinema Database",
		datatype: "external-id",
		id: "P3375",
		label: "GECD Firmen-ID",
		example: [
			26904750
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a film (movie) in the German Early Cinema Database",
		datatype: "external-id",
		id: "P3367",
		label: "GECD film ID",
		example: [
			27646544
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person in the German Early Cinema Database",
		datatype: "external-id",
		id: "P3366",
		label: "GECD person ID",
		example: [
			45302,
			12720080
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "WHO Global Environment Monitoring System/ Food Contamination Monitoring and Assessment Programme (GEMS/Food) code for a food-type",
		datatype: "external-id",
		id: "P4695",
		label: "GEMS Code",
		example: [
			4536337
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a UK or Irish place on the GENUKI.org.uk website",
		datatype: "external-id",
		id: "P7352",
		label: "GENUKI ID",
		example: [
			22,
			19186,
			5568223,
			17802721,
			27
		],
		types: [
			"for places",
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID of an earthquake in GEOFON earthquake ID",
		datatype: "external-id",
		id: "P6419",
		label: "GEOFON earthquake ID",
		example: [
			48936616,
			43777,
			19830062
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "Identifier of an organization in GEPRIS database of funded research projects",
		datatype: "external-id",
		id: "P4871",
		label: "GEPRIS organization ID",
		example: [
			152087,
			564783
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier of a person in GEPRIS database of funded research projects",
		datatype: "external-id",
		id: "P4872",
		label: "GEPRIS person ID",
		example: [
			42314064,
			91410
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier of a project in GEPRIS database of funded research projects",
		datatype: "external-id",
		id: "P4870",
		label: "GEPRIS project ID",
		example: [
			48693816,
			48801752,
			695286
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "qualifier for P4952 for GHS hazard pictograms",
		datatype: "wikibase-item",
		id: "P5040",
		label: "GHS hazard pictogram",
		example: [
			419401
		],
		types: [
			"related to chemistry",
			"Wikidata qualifier"
		],
		aliases: [
		]
	},
	{
		description: "qualifier for P4952 for GHS H-statements (also EUH-statements, AUH-statements)",
		datatype: "wikibase-item",
		id: "P5041",
		label: "GHS hazard statement",
		example: [
			419401
		],
		types: [
			"related to chemistry",
			"Wikidata qualifier"
		],
		aliases: [
			"H statement",
			"H phrase",
			"EUH phrase",
			"AUH phrase"
		]
	},
	{
		description: "qualifier for P4952 for GHS P-statements",
		datatype: "wikibase-item",
		id: "P5042",
		label: "GHS precautionary statement",
		example: [
			419401
		],
		types: [
			"related to chemistry",
			"Wikidata qualifier"
		],
		aliases: [
			"P statement",
			"P phrase"
		]
	},
	{
		description: "please use with items \"warning\" (Q15350847) and \"danger\" (Q15221217)",
		datatype: "wikibase-item",
		id: "P1033",
		label: "GHS signal word",
		example: [
			419401
		],
		types: [
			"related to chemistry",
			"Wikidata qualifier"
		],
		aliases: [
		]
	},
	{
		description: "unique identifier for heritage institutions as they have been used in the context of the OpenGLAM Benchmark Survey",
		datatype: "external-id",
		id: "P3066",
		label: "GLAM Identifier",
		example: [
			201787
		],
		types: [
		],
		aliases: [
			"GLAM ID"
		]
	},
	{
		description: "identifier for a Swiss glacier on the GLAMOS website",
		datatype: "external-id",
		id: "P6148",
		label: "GLAMOS glacier ID",
		example: [
			204658,
			4950520,
			7800984
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier assigned to glaciers by the Global Land Ice Measurements from Space service at NSIDC",
		datatype: "external-id",
		id: "P6799",
		label: "GLIMS ID",
		example: [
			49841150,
			4784181,
			4680353,
			4759077
		],
		types: [
		],
		aliases: [
			"Global Land Ice Measurements from Space ID"
		]
	},
	{
		description: "identifier for a physician, in the United Kingdom General Medical Council's official register",
		datatype: "external-id",
		id: "P8273",
		label: "GMC registration number",
		example: [
			89407538,
			93664357
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"GMC membership number",
			"GMC number",
			"GMC no."
		]
	},
	{
		description: "identifier from an international authority file of names, subjects, and organizations (please don't use type n = name, disambiguation) - Deutsche Nationalbibliothek",
		datatype: "external-id",
		id: "P227",
		label: "GND ID",
		example: [
			1,
			212190,
			15978181,
			1504481,
			484538
		],
		types: [
		],
		aliases: [
			"GND",
			"GND identifier",
			"Universal Authority File",
			"Integrated Authority File",
			"dbpedia:IndividualisedGnd",
			"DNB authorities",
			"GND-IDN",
			"GND ID",
			"Deutschen Nationalbibliothek ID",
			"German National Library ID"
		]
	},
	{
		description: "identifier for geographic objects in Antarctica, used in the US Geological Survey's Geographic Names Information System. For U.S. IDs, use Property:P590",
		datatype: "external-id",
		id: "P804",
		label: "GNIS Antarctica ID",
		example: [
			1139110
		],
		types: [
		],
		aliases: [
			"USGS GNIS Antarctica ID"
		]
	},
	{
		description: "identifier for geographic objects in the US issued by the USGS. For Antarctica, use Property:P804",
		datatype: "external-id",
		id: "P590",
		label: "GNIS ID",
		example: [
			993523
		],
		types: [
		],
		aliases: [
			"Geographic Names Information System ID",
			"USGS GNIS ID"
		]
	},
	{
		description: "identifier for geographic entities according to the National Geospatial-Intelligence Agency's GEOnet Names Server",
		datatype: "external-id",
		id: "P2326",
		label: "GNS Unique Feature ID",
		example: [
			90
		],
		types: [
		],
		aliases: [
			"GNS UFI",
			"Unique Feature Identifier",
			"GEOnet Names Server Unique Feature",
			"GNS Unique Feature Identifier"
		]
	},
	{
		description: "identifier for a software package in the GNU ELPA archive",
		datatype: "external-id",
		id: "P6823",
		label: "GNU ELPA package ID",
		example: [
			307228,
			1227545,
			1404540
		],
		types: [
			"for software",
			"representing a unique identifier"
		],
		aliases: [
			"ELPA",
			"elpa"
		]
	},
	{
		description: "identifier for an application (or film) available from the distribution platform GOG.com",
		datatype: "external-id",
		id: "P2725",
		label: "GOG application ID",
		example: [
			16267625,
			22000077
		],
		types: [
		],
		aliases: [
			"GOG.com application ID"
		]
	},
	{
		description: "identifier for a taxonomic author, in the GONIAT database",
		datatype: "external-id",
		id: "P5211",
		label: "GONIAT author ID",
		example: [
			21391366,
			274483
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxonomic paper about Paleozoic ammonoids, in the GONIAT database",
		datatype: "external-id",
		id: "P5214",
		label: "GONIAT paper ID",
		example: [
			53870013
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a place, in the GONIAT database",
		datatype: "external-id",
		id: "P5215",
		label: "GONIAT place ID",
		example: [
			23105,
			1609815
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon, in the GONIAT database",
		datatype: "external-id",
		id: "P5216",
		label: "GONIAT taxon ID",
		example: [
			23867864
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "country codes in Cyrillic from the GOST standards committee",
		datatype: "external-id",
		id: "P2988",
		label: "GOST 7.67 cyrillic",
		example: [
			40,
			219
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a language according to GOST 7.75–97",
		datatype: "external-id",
		id: "P278",
		label: "GOST 7.75–97 code",
		example: [
			1412,
			150
		],
		types: [
			"representing a unique identifier",
			"for items about languages"
		],
		aliases: [
		]
	},
	{
		description: "graphics processing unit within a system",
		datatype: "wikibase-item",
		id: "P2560",
		label: "GPU",
		example: [
			48263
		],
		types: [
		],
		aliases: [
			"graphics processing unit"
		]
	},
	{
		description: "ID of a topic, in the British medical database GPnotebook",
		datatype: "external-id",
		id: "P3720",
		label: "GPnotebook ID",
		example: [
			188008
		],
		types: [
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "index of Russian (and Soviet) weapons and rockets",
		datatype: "external-id",
		id: "P917",
		label: "GRAU index",
		example: [
			3303767
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "institutional identifier from the GRID.ac global research identifier database",
		datatype: "external-id",
		id: "P2427",
		label: "GRID ID",
		example: [
			1517021
		],
		types: [
		],
		aliases: [
			"grid global id",
			"grid research id",
			"grid global research id",
			"Global Research Identifier Database identifier"
		]
	},
	{
		description: "URL for a taxon in the GRIN website",
		datatype: "url",
		id: "P1421",
		label: "GRIN URL",
		example: [
			11575,
			43238,
			189393
		],
		types: [
		],
		aliases: [
			"GRIN Taxonomy ID",
			"GRIN ID"
		]
	},
	{
		description: "The brick code is used to classify products in the GS1 Global Product Classification",
		datatype: "external-id",
		id: "P5420",
		label: "GS1 Global Product Classification brick code",
		example: [
			722338,
			44,
			41354,
			89
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "codes for a company or organisation, used in GS1 barcodes (note UPC prefixes are GS1 prefixes that start with \"0\", without the leading \"0\")",
		datatype: "external-id",
		id: "P3193",
		label: "GS1 Manufacturer code",
		example: [
			95
		],
		types: [
		],
		aliases: [
			"GS1 Company Prefix"
		]
	},
	{
		description: "GS1 Prefix, the first three digits, usually identifying the national GS1 Member Organization to which the manufacturer is registered (not necessarily where the product is actually made)",
		datatype: "string",
		id: "P3067",
		label: "GS1 country code",
		example: [
			224
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a telephone model on GSMArena",
		datatype: "external-id",
		id: "P4723",
		label: "GSMArena phone ID",
		example: [
			219691,
			57780158
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "Taiwanese video game content rating system",
		datatype: "wikibase-item",
		id: "P916",
		label: "GSRR rating",
		example: [
			131007,
			13455638
		],
		types: [
		],
		aliases: [
			"CSRR rating",
			"GSRMR rating"
		]
	},
	{
		description: "nine-character UK Government Statistical Service code, introduced in 2011 to replace older ONS codes",
		datatype: "external-id",
		id: "P836",
		label: "GSS code (2011)",
		example: [
			1364541
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ONS GSS code (2011)"
		]
	},
	{
		description: "identifier for a species on the Groupe de travail Invasions biologiques en milieux aquatiques website",
		datatype: "external-id",
		id: "P6054",
		label: "GT IBMA ID",
		example: [
			27075729,
			924985,
			1194614
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for GTAA, a thesaurus used in audiovisual archives (NISV, EYE)",
		datatype: "external-id",
		id: "P1741",
		label: "GTAA ID",
		example: [
			523644,
			301
		],
		types: [
		],
		aliases: [
			"GTAA"
		]
	},
	{
		description: "a number of a company in Taiwan given by Ministry of Economic Affairs, Taiwan",
		datatype: "external-id",
		id: "P7729",
		label: "GUI number",
		example: [
			713418,
			7884615,
			9364866
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Government Uniform Invoice number"
		]
	},
	{
		description: "framework or toolkit a program uses to display the graphical user interface",
		datatype: "wikibase-item",
		id: "P1414",
		label: "GUI toolkit or framework",
		example: [
			8038,
			4049816
		],
		types: [
			"for software"
		],
		aliases: [
			"default user interface",
			"user interface",
			"GUI toolkit",
			"GUI framework",
			"widget framework",
			"widget toolkit",
			"UI toolkit",
			"UI framework"
		]
	},
	{
		description: "identifier for an album or single on Gaana.com",
		datatype: "external-id",
		id: "P7175",
		label: "Gaana.com album ID",
		example: [
			65058645,
			65071573,
			7126098
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on Gaana.com music site",
		datatype: "external-id",
		id: "P6914",
		label: "Gaana.com artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an author in Galiciana",
		datatype: "external-id",
		id: "P3307",
		label: "Galiciana author ID",
		example: [
			464264,
			20533673
		],
		types: [
		],
		aliases: [
			"Galiciana ID author"
		]
	},
	{
		description: "identifier of a work in Galiciana",
		datatype: "external-id",
		id: "P3004",
		label: "Galiciana work ID",
		example: [
			3311825
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Gallica ID of a creative work (eg book scan)",
		datatype: "external-id",
		id: "P4258",
		label: "Gallica ID",
		example: [
			40244651
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a language or place in the Gambay First Languages of Australia map",
		datatype: "external-id",
		id: "P6915",
		label: "Gambay ID",
		example: [
			7049771,
			12645549,
			3111818
		],
		types: [
			"representing a unique identifier",
			"for items about languages"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a video game on GameBanana",
		datatype: "external-id",
		id: "P8420",
		label: "GameBanana video game ID",
		example: [
			473673,
			163628
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a company in the GameFAQs database",
		datatype: "external-id",
		id: "P6182",
		label: "GameFAQs company ID",
		example: [
			45700,
			11709677,
			32021960
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a game credit in the GameFAQs database",
		datatype: "external-id",
		id: "P7661",
		label: "GameFAQs credit ID",
		example: [
			315577,
			355062,
			2844562
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a franchise in GameFAQs",
		datatype: "external-id",
		id: "P6472",
		label: "GameFAQs franchise ID",
		example: [
			216655,
			12393,
			188196,
			587964,
			2020,
			1750894
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a game on GameRankings and GameFAQs",
		datatype: "external-id",
		id: "P4769",
		label: "GameFAQs game ID",
		example: [
			28234671,
			94797,
			94797,
			6552947
		],
		types: [
		],
		aliases: [
			"GameRankings game ID"
		]
	},
	{
		description: "identifier of a gaming platform in GameFAQs database",
		datatype: "external-id",
		id: "P6078",
		label: "GameFAQs platform ID",
		example: [
			184198,
			627302,
			94
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a video game on the GameReactor video game news website",
		datatype: "external-id",
		id: "P8090",
		label: "GameReactor game ID",
		example: [
			54906424,
			392707
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the GameRevolution database",
		datatype: "external-id",
		id: "P8028",
		label: "GameRevolution game ID",
		example: [
			24666782,
			218568,
			214232,
			20155152,
			3416463
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier at the GameSpot database of video games",
		datatype: "external-id",
		id: "P5494",
		label: "GameSpot ID",
		example: [
			216995,
			276217,
			526700,
			60669584
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the GameStar database",
		datatype: "external-id",
		id: "P7877",
		label: "GameStar ID",
		example: [
			56275401,
			24666782,
			840409,
			853074,
			1070478,
			214232,
			20155152
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the GameTDB database",
		datatype: "external-id",
		id: "P8087",
		label: "GameTDB game ID",
		example: [
			17185964,
			54093632,
			1986744,
			642526,
			858564,
			310003
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Gamebase64 database of Commodore 64 videogames",
		datatype: "external-id",
		id: "P4917",
		label: "Gamebase64 identifier",
		example: [
			757862
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"GB64 id"
		]
	},
	{
		description: "identifier of a company in the Gamekult database",
		datatype: "external-id",
		id: "P7911",
		label: "Gamekult company ID",
		example: [
			173941,
			45700,
			723515,
			193559,
			64215026
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game franchise in the Gamekult database",
		datatype: "external-id",
		id: "P7912",
		label: "Gamekult franchise ID",
		example: [
			11351901,
			4803535,
			188196,
			752241,
			2833291,
			58894758,
			662004,
			16201230,
			18448608
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the Gamekult database",
		datatype: "external-id",
		id: "P7913",
		label: "Gamekult game ID",
		example: [
			2788891,
			7497192,
			317620,
			2591858,
			1757876,
			840409,
			24806656,
			1880634
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game platform in the Gamekult database",
		datatype: "external-id",
		id: "P7914",
		label: "Gamekult platform ID",
		example: [
			753600,
			184198,
			253044,
			60309635,
			1898891
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an article on Gamepedia",
		datatype: "external-id",
		id: "P6623",
		label: "Gamepedia article ID",
		example: [
			819585,
			9351,
			49740,
			12580819
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Gamepedia ID"
		]
	},
	{
		description: "wiki name for this topic on Gamepedia",
		datatype: "external-id",
		id: "P6867",
		label: "Gamepedia wiki ID",
		example: [
			131007,
			207302,
			24050047,
			18215873
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game developer in the Games Database",
		datatype: "external-id",
		id: "P7794",
		label: "Games Database developer ID",
		example: [
			45700,
			25377676,
			1041320
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the Games Database",
		datatype: "external-id",
		id: "P7881",
		label: "Games Database game ID",
		example: [
			980535,
			56042289,
			3416463,
			2480047,
			2745604,
			3416463,
			3416463,
			3416463
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game publisher in the Games Database",
		datatype: "external-id",
		id: "P7805",
		label: "Games Database publisher ID",
		example: [
			122741,
			45700,
			3518266,
			1184680,
			193559
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game system in the Games Database",
		datatype: "external-id",
		id: "P7806",
		label: "Games Database system ID",
		example: [
			41357,
			249075,
			426119,
			184839,
			1067380
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for the Gaming-History videogame database",
		datatype: "external-id",
		id: "P4806",
		label: "Gaming-History ID",
		example: [
			1192794,
			3201630
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Arcade-History identifier",
			"Gaming-History identifier"
		]
	},
	{
		description: "identifier of a company in the Gaming-History database",
		datatype: "external-id",
		id: "P7521",
		label: "Gaming-History company ID",
		example: [
			3259558,
			20651008,
			193559
		],
		types: [
			"representing a unique identifier",
			"for items about organizations"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a building in the Gaoloumi database",
		datatype: "external-id",
		id: "P1837",
		label: "Gaoloumi ID",
		example: [
			3306015
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the garaph.info database",
		datatype: "external-id",
		id: "P7739",
		label: "Garaph game ID",
		example: [
			1042365,
			2707847,
			1141963,
			11222485
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"garaph.info game ID"
		]
	},
	{
		description: "identifier of a video game group in the garaph.info database",
		datatype: "external-id",
		id: "P7740",
		label: "Garaph group ID",
		example: [
			1139803,
			3444160,
			11351901,
			5235185
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"garaph.info group ID"
		]
	},
	{
		description: "ID for a railway station on the official website for French railway stations",
		datatype: "external-id",
		id: "P3104",
		label: "Gares & Connexions ID",
		example: [
			2288767
		],
		types: [
		],
		aliases: [
			"Gare et Connexions ID",
			"Gares en mouvement",
			"Gares et Connexions ID",
			"Gare & Connexions ID"
		]
	},
	{
		description: "ID for lexemes",
		datatype: "external-id",
		label: "Garzanti Linguistica ID",
		id: "P6266",
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for the castle sites in the Gatehouse Gazetteer website",
		datatype: "external-id",
		id: "P4141",
		label: "Gatehouse Gazetteer place ID",
		example: [
			32164004
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a research project receiving public funding in the UK",
		datatype: "external-id",
		id: "P6536",
		label: "Gateway to Research Project ID",
		example: [
			60668957,
			60669183,
			61744481
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"GtR Project ID"
		]
	},
	{
		description: "identifier for an organisation in the UK Research and Innovation (UKRI)'s Gateway to Research (GtR) database of research funding",
		datatype: "external-id",
		id: "P8501",
		label: "Gateway to Research organisation ID",
		example: [
			5179058,
			1138080,
			716737
		],
		types: [
		],
		aliases: [
			"UK Research and Innovation organisation ID",
			"UKRI ID",
			"GtR ID"
		]
	},
	{
		description: "identifier for a person in the UK Research and Innovation (UKRI)'s Gateway to Research (GtR) database of research funding",
		datatype: "external-id",
		id: "P8446",
		label: "Gateway to Research person ID",
		example: [
			58334721,
			80,
			11470
		],
		types: [
		],
		aliases: [
			"UKRI ID",
			"UK Researcher ID",
			"GtR ID",
			"UK Research and Innovation person ID"
		]
	},
	{
		description: "identifier for a restaurant in the Gault et Millau Restaurants website",
		datatype: "external-id",
		id: "P6402",
		label: "Gault et Millau ID",
		example: [
			60615583,
			60515781,
			60179008
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a participants of UEFA Euro 2012 at Gazeta.Ru Euro 2012 site",
		datatype: "external-id",
		id: "P7114",
		label: "Gazeta.Ru Euro 2012 person ID",
		example: [
			294893,
			70550,
			489107
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "notification number and date, published in the Gazette of India",
		datatype: "string",
		id: "P8206",
		label: "Gazette of India notification",
		example: [
			75430672,
			78448696
		],
		types: [
			"with datatype string that is not an external identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a Scottish personality on www.scottish-places.info",
		datatype: "external-id",
		id: "P7349",
		label: "Gazetteer for Scotland person ID",
		example: [
			312635,
			81960,
			2004866
		],
		types: [
		],
		aliases: [
			"GfS person"
		]
	},
	{
		description: "identifier for a geographical item on the Gazetteer for Scotland website",
		datatype: "external-id",
		id: "P7350",
		label: "Gazetteer for Scotland place ID",
		example: [
			652035,
			126514,
			67479916,
			2557007,
			17570326,
			5568223,
			6899864
		],
		types: [
			"for places",
			"representing a unique identifier"
		],
		aliases: [
			"GfS place"
		]
	},
	{
		description: "identifier of a feature on an astronomical body in the Gazetteer of Planetary Nomenclature",
		datatype: "external-id",
		id: "P2824",
		label: "Gazetteer of Planetary Nomenclature ID",
		example: [
			19972237
		],
		types: [
		],
		aliases: [
			"GPN ID"
		]
	},
	{
		description: "identifier for a person in the genealogical database of the Verein für Computergenealogie e.V. on gedbas.genealogy.net",
		datatype: "external-id",
		id: "P4108",
		label: "Gedbas genealogy person ID",
		example: [
			937,
			3044
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the database of Geheugen van de VU (Vrije Universiteit Amsterdam)",
		datatype: "external-id",
		id: "P5908",
		label: "Geheugen van de VU person ID",
		example: [
			2195210,
			20734916,
			21598070
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Genome assembly accession identifier for the identification of strains with a corresponding assembly",
		datatype: "external-id",
		id: "P4333",
		label: "GenBank Assembly accession",
		example: [
			21102953
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "image showing the GeneAtlas expression pattern",
		datatype: "commonsMedia",
		id: "P692",
		label: "Gene Atlas Image",
		example: [
			414043
		],
		types: [
			"for Commons"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Gene Ontology",
		datatype: "external-id",
		id: "P686",
		label: "Gene Ontology ID",
		example: [
			13667380
		],
		types: [
		],
		aliases: [
			"GO term"
		]
	},
	{
		description: "gene identifier in GeneDB",
		datatype: "external-id",
		id: "P3382",
		label: "GeneDB ID",
		example: [
			19043588
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "collection of peer-reviewed articles that describe specific gene-releated diseases",
		datatype: "external-id",
		id: "P668",
		label: "GeneReviews ID",
		example: [
			8277
		],
		types: [
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person in the GeneaStar genealogical database",
		datatype: "external-id",
		id: "P8094",
		label: "GeneaStar person ID",
		example: [
			36268,
			106508,
			76
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Canadian archival term indicating the broad class of material to which the item belongs",
		datatype: "wikibase-item",
		label: "General Material Designation",
		id: "P6608",
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Generation MSX database of MSX videogames",
		datatype: "external-id",
		id: "P4960",
		label: "Generation MSX identifier",
		example: [
			91282,
			1995422,
			3317606
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for disease in the United States National Institutes of Health's Genetics Home Reference",
		datatype: "external-id",
		id: "P7464",
		label: "Genetics Home Reference Conditions ID",
		example: [
			560337,
			319812,
			21154055
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "profile on the Geni.com genealogy website",
		datatype: "external-id",
		id: "P2600",
		label: "Geni.com profile ID",
		example: [
			9682,
			3044,
			23696694,
			7344895
		],
		types: [
		],
		aliases: [
			"Geni person ID"
		]
	},
	{
		description: "identifier for an album, single, other music release or other publication on Genius",
		datatype: "external-id",
		id: "P6217",
		label: "Genius album ID",
		example: [
			44320,
			208902,
			55399579,
			762203
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "numeric ID for an album, single, other music release or other publication on Genius",
		datatype: "external-id",
		id: "P6360",
		label: "Genius album numeric ID",
		example: [
			165617,
			755085,
			14467113
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist or label on Genius",
		datatype: "external-id",
		id: "P2373",
		label: "Genius artist ID",
		example: [
			5921,
			34086,
			19004,
			9543,
			389284,
			383541
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "numeric identifier for an artist on Genius",
		datatype: "external-id",
		id: "P6351",
		label: "Genius artist numeric ID",
		example: [
			34389,
			34086,
			383541
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a song, musical composition or written work on Genius",
		datatype: "external-id",
		id: "P6218",
		label: "Genius song ID",
		example: [
			1886329,
			56085788,
			57782115,
			2527863
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "numeric ID for a song, musical composition or written work on Genius",
		datatype: "external-id",
		id: "P6361",
		label: "Genius song numeric ID",
		example: [
			383842,
			931296,
			15108756
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "name of the official Gentoo package of this application",
		datatype: "external-id",
		id: "P3499",
		label: "Gentoo package",
		example: [
			8038,
			698,
			971909
		],
		types: [
			"for software"
		],
		aliases: [
			"package, Gentoo"
		]
	},
	{
		description: "Japan identifier for a place",
		datatype: "external-id",
		id: "P5400",
		label: "GeoNLP ID",
		example: [
			1249041,
			39231,
			148,
			29520
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the GeoNames geographical database",
		datatype: "external-id",
		id: "P1566",
		label: "GeoNames ID",
		example: [
			1049644,
			870031,
			712504
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for feature classes in GeoNames",
		datatype: "external-id",
		id: "P2452",
		label: "GeoNames feature code",
		example: [
			23397,
			3253281
		],
		types: [
		],
		aliases: [
			"feature code (GeoNames)"
		]
	},
	{
		description: "Identifier on the Geographical Names Board of New South Wales website. Do not use the reference number",
		datatype: "external-id",
		id: "P3517",
		label: "Geographical Names Board of NSW ID",
		example: [
			7500539,
			1737704
		],
		types: [
		],
		aliases: [
			"GNB ID",
			"GNB NSW ID",
			"GNR of NSW",
			"NSW GNR",
			"Geographical Name Register",
			"Geographical Name Register of New South Wales",
			"Geographical Names Board of New South Wales ID"
		]
	},
	{
		description: "identifier for historical administrative division of Sweden (1862-1951)",
		datatype: "external-id",
		id: "P1172",
		label: "Geokod",
		example: [
			10436028
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID for every stratigraphic unit in the United States of America (USA) given by the United States Geological Survey",
		datatype: "external-id",
		id: "P6202",
		label: "Geolex ID",
		example: [
			59158463,
			4832955,
			57314070
		],
		types: [
			"representing a unique identifier",
			"multi-source external identifier"
		],
		aliases: [
			"GEOLEX ID"
		]
	},
	{
		description: "identifier for an athlete on the Georgia Sports Hall of Fame website",
		datatype: "external-id",
		id: "P4364",
		label: "Georgia Sports Hall of Fame ID",
		example: [
			7381489,
			7650994
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film in the Georgian National Filmography database",
		datatype: "external-id",
		id: "P6420",
		label: "Georgian National Filmography ID",
		example: [
			4084204
		],
		types: [
		],
		aliases: [
			"Geocinema film ID",
			"GCDB film ID",
			"Georgian Cinema Database ID for films"
		]
	},
	{
		description: "identifier for a person, in the Georgian National Filmography database",
		datatype: "external-id",
		id: "P6501",
		label: "Georgian National Filmography person ID",
		example: [
			3879958
		],
		types: [
		],
		aliases: [
			"Geocinema",
			"GCDB",
			"Georgian Cinema Database ID"
		]
	},
	{
		description: "identifier for a monument in the National Register of Monuments of Georgia",
		datatype: "external-id",
		id: "P4166",
		label: "Georgian National Register of Monuments ID",
		example: [
			12871391
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "string",
		id: "P2126",
		label: "Georgian national system of romanization",
		example: [
			8108
		],
		types: [
			"Wikidata qualifier",
			"with datatype string that is not an external identifier",
			"for romanization system"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete on the German Athletics Association website",
		datatype: "external-id",
		id: "P3843",
		label: "German Athletics Association athlete ID",
		example: [
			61483,
			9358527
		],
		types: [
		],
		aliases: [
			"Deutscher Leichtathletik-Verband athlete ID",
			"DLV athlete ID"
		]
	},
	{
		description: "identifier for players, manager and referees in the datacenter of the German Football Association (''Deutscher Fußball-Bund'', DFB)",
		datatype: "external-id",
		id: "P4023",
		label: "German Football Association person ID",
		example: [
			44298,
			450592,
			123844,
			566127,
			60321
		],
		types: [
		],
		aliases: [
			"DFB datacenter player ID",
			"DFB datacenter coach ID",
			"DFB datacenter referee ID"
		]
	},
	{
		description: "identifier for a German athlete on the website of the German Olympic Sports Confederation (DOSB: Deutscher Olympischer Sportbund)",
		datatype: "external-id",
		id: "P4053",
		label: "German Olympic Sports Confederation athlete ID",
		example: [
			15651287,
			15982317,
			57559
		],
		types: [
		],
		aliases: [
			"Deutscher Olympischer Sportbund athlete ID",
			"DOSB athlete ID",
			"German Olympic Team athlete ID",
			"Deutsche Olympiamannschaft athlete ID",
			"Team Deutschland athlete ID"
		]
	},
	{
		description: "ID of the article in German Vikidia",
		datatype: "external-id",
		id: "P7843",
		label: "German Vikidia ID",
		example: [
			822,
			1208,
			237189
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"article in German Vikidia",
			"Vikidia article in German"
		]
	},
	{
		description: "identifier of a cattle breed in German national law",
		datatype: "external-id",
		id: "P2024",
		label: "German cattle breed ID",
		example: [
			2798638
		],
		types: [
		],
		aliases: [
			"Rasseschlüssel"
		]
	},
	{
		description: "identifier for districts (Landkreise) and independent towns in Germany",
		datatype: "external-id",
		id: "P440",
		label: "German district key",
		example: [
			8608
		],
		types: [
		],
		aliases: [
			"district key (Germany)"
		]
	},
	{
		description: "identifier for municipalities and independent towns in Germany",
		datatype: "external-id",
		id: "P439",
		label: "German municipality key",
		example: [
			9300
		],
		types: [
		],
		aliases: [
			"municipality key (Germany)",
			"Gemeindeschlüssel"
		]
	},
	{
		description: "identifier for municipalities and other areas in Germany",
		datatype: "external-id",
		id: "P1388",
		label: "German regional key",
		example: [
			510035,
			980
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "numerical identifier for a local German tax office; forms part of the Steuernummer, assigned to individual taxpayers by that authority",
		datatype: "external-id",
		id: "P2628",
		label: "German tax authority ID",
		example: [
			1416270
		],
		types: [
		],
		aliases: [
			"German tax authority number"
		]
	},
	{
		description: "identifier for a participants of 2006 FIFA World Cup at Germany06.Ru site",
		datatype: "external-id",
		id: "P7652",
		label: "Germany06.Ru person ID",
		example: [
			314352,
			483629,
			41244
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a cultural property per the Glad database of French cultural heritage",
		datatype: "external-id",
		id: "P1529",
		label: "Gertrude identifier",
		example: [
			1601882,
			16684501
		],
		types: [
		],
		aliases: [
			"Glad identifier"
		]
	},
	{
		description: "identifier for medieval German writers",
		datatype: "external-id",
		id: "P8051",
		label: "Geschichtsquellen des deutschen Mittelalters author ID",
		example: [
			569598,
			804768,
			826323
		],
		types: [
		],
		aliases: [
			"GdM author ID"
		]
	},
	{
		description: "identifier for medieval German literary works",
		datatype: "external-id",
		id: "P8074",
		label: "Geschichtsquellen des deutschen Mittelalters work ID",
		example: [
			4883999,
			542963,
			1182119
		],
		types: [
		],
		aliases: [
			"GdM work ID"
		]
	},
	{
		description: "identifier from the Getty Iconography Authority",
		datatype: "external-id",
		id: "P5986",
		label: "Getty Iconography Authority ID",
		example: [
			11378,
			2546006
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"IA ID",
			"Iconography Authority ID",
			"CONA Iconography Authority ID",
			"CONA Iconography Record ID",
			"GIA ID"
		]
	},
	{
		description: "identifier in the Getty Thesaurus of Geographic Names",
		datatype: "external-id",
		id: "P1667",
		label: "Getty Thesaurus of Geographic Names ID",
		example: [
			2751,
			1065
		],
		types: [
		],
		aliases: [
			"Thesaurus of Geographic Names",
			"TGN identifier",
			"TGN ID"
		]
	},
	{
		description: "a number to hydrographically order rivers and streams, use more specific properties where possible",
		datatype: "string",
		id: "P1183",
		label: "Gewässerkennzahl",
		example: [
			640734
		],
		types: [
			"representing a unique identifier",
			"multi-source external identifier"
		],
		aliases: [
			"GKZ",
			"Gewaesserkennzahl"
		]
	},
	{
		description: "user name for an entity on Gfycat.com",
		datatype: "external-id",
		id: "P5434",
		label: "Gfycat user ID",
		example: [
			207708,
			169325
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier at the Giant Bomb database of video games, fictional characters and voice actors",
		datatype: "external-id",
		id: "P5247",
		label: "Giant Bomb ID",
		example: [
			252804,
			907,
			184198,
			4207522,
			5216537,
			1156500
		],
		types: [
		],
		aliases: [
			"GiantBomb ID"
		]
	},
	{
		description: "measure of statistical dispersion intended to represent the income distribution of a nation's residents",
		datatype: "quantity",
		id: "P1125",
		label: "Gini coefficient",
		example: [
			30,
			183
		],
		types: [
			"related to economics"
		],
		aliases: [
		]
	},
	{
		description: "this item's username on Giphy",
		datatype: "external-id",
		id: "P4013",
		label: "Giphy username",
		example: [
			23548
		],
		types: [
			"for items about people",
			"for items about organizations"
		],
		aliases: [
		]
	},
	{
		description: "username of this project, person or organization on GitHub",
		datatype: "external-id",
		id: "P2037",
		label: "GitHub username",
		example: [
			20757848,
			95
		],
		types: [
			"for items about people"
		],
		aliases: [
			"GitHub"
		]
	},
	{
		description: "identifier of Rabindra Sangeets on Gitabitan.net website",
		datatype: "external-id",
		id: "P8212",
		label: "Gitabitan.net ID",
		example: [
			92790472,
			92789967,
			92791051
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a company on the Glassdoor employee review website",
		datatype: "external-id",
		id: "P8060",
		label: "Glassdoor company ID",
		example: [
			38076,
			173941,
			731482
		],
		types: [
		],
		aliases: [
			"Glassdoor employer ID"
		]
	},
	{
		description: "identifier for Global Anabaptist Mennonite Encyclopedia Online",
		datatype: "external-id",
		id: "P1842",
		label: "Global Anabaptist Mennonite Encyclopedia Online ID",
		example: [
			4484167,
			9344109,
			511164
		],
		types: [
		],
		aliases: [
			"GAMEO identifier",
			"Global Anabaptist Mennonite Encyclopedia Online identifier"
		]
	},
	{
		description: "identifier in GBIF",
		datatype: "external-id",
		id: "P846",
		label: "Global Biodiversity Information Facility ID",
		example: [
			139386
		],
		types: [
		],
		aliases: [
			"GBIF ID"
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P2467",
		label: "Global Geoparks Network ID",
		example: [
			2138343
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon in the IUCN's Global Invasive Species Database",
		datatype: "external-id",
		id: "P5626",
		label: "Global Invasive Species Database ID",
		example: [
			158397,
			836721,
			1790867,
			25348
		],
		types: [
		],
		aliases: [
			"GISD ID"
		]
	},
	{
		description: "identifier for a musical work in Global Music Rights' repertory",
		datatype: "external-id",
		id: "P7955",
		label: "Global Music Rights work ID",
		example: [
			208837,
			1971,
			1645464,
			11510350
		],
		types: [
			"for items about works",
			"representing a unique identifier"
		],
		aliases: [
			"GMR work ID"
		]
	},
	{
		description: "ID for a poker player in Global Poker Index",
		datatype: "external-id",
		id: "P3564",
		label: "Global Poker Index ID",
		example: [
			12771170
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon on the Global Raptor Information Network website",
		datatype: "external-id",
		id: "P6045",
		label: "Global Raptor Information Network ID",
		example: [
			128037,
			1264118,
			594915
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon in Global Species database",
		datatype: "external-id",
		id: "P6433",
		label: "Global Species ID",
		example: [
			26972265,
			131268,
			160821,
			25419
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Global Terrorism Database by the National Consortium for the Study of Terrorism and Responses to Terrorism (START)",
		datatype: "external-id",
		id: "P4089",
		label: "Global Terrorism Database ID",
		example: [
			28953322
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "GTIN (or EAN, UCC) is used to identify products via their barcodes",
		datatype: "external-id",
		id: "P3962",
		label: "Global Trade Item Number",
		example: [
			29972750,
			2813
		],
		types: [
		],
		aliases: [
			"GTIN",
			"European Article Number",
			"EAN",
			"UCC"
		]
	},
	{
		description: "identifier for a languoid in the Glottolog database",
		datatype: "external-id",
		id: "P1394",
		label: "Glottolog code",
		example: [
			294,
			245899
		],
		types: [
			"for items about languages"
		],
		aliases: [
			"Glottocode"
		]
	},
	{
		description: "identifier of GlyphWiki, in which glyphs of Han characters are managed",
		datatype: "external-id",
		id: "P5467",
		label: "GlyphWiki ID",
		example: [
			4025820,
			54872914,
			54872914,
			54879255,
			54879255,
			55759507,
			55754160
		],
		types: [
			"representing a unique identifier",
			"for items about languages"
		],
		aliases: [
		]
	},
	{
		description: "identifier for inorganic chemical compounds, in the Gmelin database",
		datatype: "external-id",
		id: "P1578",
		label: "Gmelin number",
		example: [
			49546
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "external identifiers for Goibibo hotels",
		datatype: "external-id",
		id: "P7136",
		label: "Goibibo Hotel ID",
		example: [
			15217311,
			65658567,
			7074789
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "page ID for the Golden knowledge base",
		datatype: "external-id",
		id: "P7502",
		label: "Golden ID",
		example: [
			478214,
			131723,
			138845
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of an author on the Goodreads website",
		datatype: "external-id",
		id: "P2963",
		label: "Goodreads author ID",
		example: [
			80,
			6396015
		],
		types: [
		],
		aliases: [
			"Good Reads author ID"
		]
	},
	{
		description: "identifier of a book, in the GoodReads.com website",
		datatype: "external-id",
		id: "P2969",
		label: "Goodreads book ID",
		example: [
			3988193
		],
		types: [
		],
		aliases: [
			"Good Reads book ID"
		]
	},
	{
		description: "identifier for a fictional character on Goodreads",
		datatype: "external-id",
		id: "P6327",
		label: "Goodreads character ID",
		example: [
			669992,
			60039369,
			2320164
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a book series in the Goodreads website",
		datatype: "external-id",
		id: "P6947",
		label: "Goodreads series ID",
		example: [
			8337,
			44523,
			11679
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "unique identifier for written works (Q47461344) on Goodreads. This property should not be confused with Goodreads book ID, which is a unique identifier for versions, editions, or translations (Q3331189). For any one written work like War and Peace there should be only one Goodreads work ID but there may be multiple Goodreads book IDs. You can get this value from the \"all editions\" link on a Goodreads book page.",
		datatype: "external-id",
		id: "P8383",
		label: "Goodreads work ID",
		example: [
			3985697,
			161531
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork or other object on the Google Arts & Culture website",
		datatype: "external-id",
		id: "P4701",
		label: "Google Arts & Culture asset ID",
		example: [
			775407,
			20443421
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a museum or other partner on the Google Arts & Culture website",
		datatype: "external-id",
		id: "P4702",
		label: "Google Arts & Culture partner ID",
		example: [
			2112323,
			857674
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a book edition in Google Books",
		datatype: "external-id",
		id: "P675",
		label: "Google Books ID",
		example: [
			19849013
		],
		types: [
		],
		aliases: [
			"Google Books identifier",
			"Google Books",
			"gbooks"
		]
	},
	{
		description: "Google Doodle celebrating this entity or event",
		datatype: "external-id",
		id: "P4431",
		label: "Google Doodle",
		example: [
			134847,
			233207
		],
		types: [
		],
		aliases: [
			"Doodle"
		]
	},
	{
		description: "identifier for Google Knowledge Graph API (starting with \"/g/\") IDs starting with \"/m/\" are Freebase IDs (P646)",
		datatype: "external-id",
		id: "P2671",
		label: "Google Knowledge Graph ID",
		example: [
			20800404,
			88832
		],
		types: [
		],
		aliases: [
			"KG MID",
			"AG",
			"kgmid",
			"GKG ID",
			"KG ID"
		]
	},
	{
		description: "in Google Maps, Customer identifier for a place",
		datatype: "external-id",
		id: "P3749",
		label: "Google Maps Customer ID",
		example: [
			9188,
			220289
		],
		types: [
		],
		aliases: [
			"Google Maps Place CID",
			"Google CID (maps)",
			"CID (Google Maps)",
			"GMCID",
			"GM CID",
			"Google Maps CID"
		]
	},
	{
		description: "identifier for a news source in the news on Google News",
		datatype: "external-id",
		id: "P6157",
		label: "Google News publication ID",
		example: [
			9684,
			12217473,
			130879,
			13423853
		],
		types: [
		],
		aliases: [
			"Google News ID"
		]
	},
	{
		description: "identifier for a subject in the news on Google News",
		datatype: "external-id",
		id: "P5337",
		label: "Google News topics ID",
		example: [
			33602,
			46347,
			414
		],
		types: [
		],
		aliases: [
			"News (Google) ID",
			"GNews ID",
			"Google Actualités",
			"Google News ID",
			"Google Actualites"
		]
	},
	{
		description: "identifier of films and television series on Google Play",
		datatype: "external-id",
		id: "P6562",
		label: "Google Play Movies & TV ID",
		example: [
			61718139,
			40415503
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an album, single, other music release or other publication on the Google Play Music website",
		datatype: "external-id",
		id: "P4199",
		label: "Google Play Music album ID",
		example: [
			27687809,
			19757797,
			44320
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an artist on the Google Play Music website",
		datatype: "external-id",
		id: "P4198",
		label: "Google Play Music artist ID",
		example: [
			4276848,
			19004,
			2831
		],
		types: [
		],
		aliases: [
			"Play Music artist ID"
		]
	},
	{
		description: "package name of an app registered on Google Play",
		datatype: "external-id",
		id: "P3418",
		label: "Google Play Store app ID",
		example: [
			171477,
			27229846,
			15616276
		],
		types: [
			"for software"
		],
		aliases: [
			"Google Play",
			"PlayStore",
			"Play Store",
			"Play Store ID",
			"Google Play Store identifier",
			"Play Store identifier",
			"Google Play identifier",
			"Google Play Store",
			"Google Play ID",
			"Android app ID",
			"Google Play Store ID",
			"Google Play Store package",
			"package, Google Play Store",
			"play.google.com",
			"GooglePlay"
		]
	},
	{
		description: "identifier for an Android app developer on the Google Play Store",
		datatype: "external-id",
		id: "P4486",
		label: "Google Play developer ID",
		example: [
			188273,
			2283
		],
		types: [
		],
		aliases: [
			"Android developer ID"
		]
	},
	{
		description: "identifier of a person, in the Google Scholar academic search service",
		datatype: "external-id",
		id: "P1960",
		label: "Google Scholar author ID",
		example: [
			20111623,
			694219
		],
		types: [
		],
		aliases: [
			"Scholar ID in Google Scholar",
			"Google Scholar ID",
			"Google Scholar person ID"
		]
	},
	{
		description: "ID for legal cases cataloged by Google Scholar",
		datatype: "external-id",
		id: "P8008",
		label: "Google Scholar case ID",
		example: [
			1229683,
			300950,
			4948726
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a paper in Google Scholar",
		datatype: "external-id",
		id: "P4028",
		label: "Google Scholar paper ID",
		example: [
			29164671,
			3554851
		],
		types: [
		],
		aliases: [
			"Google Scholar ID"
		]
	},
	{
		description: "Google Plus, account identifier of this person or organization: either starting with a \"+\" or consisting of 21 digits",
		datatype: "external-id",
		id: "P2847",
		label: "Google+ ID",
		example: [
			381,
			2013,
			34424
		],
		types: [
			"for items about people"
		],
		aliases: [
			"Google Plus",
			"Google +",
			"Google+",
			"+",
			"Google+ username",
			"Google Plus ID",
			"Google Plus username",
			"G+",
			"Google+ identifier",
			"Google Plus identifier",
			"plus.google.com"
		]
	},
	{
		description: "goratings.org player identifier",
		datatype: "external-id",
		id: "P2805",
		label: "Goratings ID",
		example: [
			16262307
		],
		types: [
		],
		aliases: [
			"Go Ratings ID"
		]
	},
	{
		description: "ID for persons or places connected to objects at Gotlands museums web a local museum in Sweden",
		datatype: "external-id",
		id: "P7068",
		label: "Gotlands museum",
		example: [
			6017386,
			52925,
			2203468,
			1004693
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person or oganisation, on http://www.gracesguide.co.uk/",
		datatype: "external-id",
		id: "P3074",
		label: "Grace's Guide ID",
		example: [
			207380,
			617252
		],
		types: [
		],
		aliases: [
			"Grace's ID",
			"Graces Guide ID",
			"Grace ID",
			"Graces ID"
		]
	},
	{
		description: "Gram stain type of a bacterial strain",
		datatype: "wikibase-item",
		id: "P2597",
		label: "Gram staining",
		example: [
			21079489
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a game on Gram.pl site",
		datatype: "external-id",
		id: "P8020",
		label: "Gram.pl game ID",
		example: [
			63113436,
			18345763,
			17452
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on the Grammy Awards website",
		datatype: "external-id",
		id: "P7303",
		label: "Grammy Awards artist ID",
		example: [
			128085,
			193645,
			1161836
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a composer, in the database of Gramophone UK magazine",
		datatype: "external-id",
		id: "P8386",
		label: "Gramophone composer ID",
		example: [
			255,
			184933,
			96113882,
			7314
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an item in the Gran Enciclopèdia Catalana",
		datatype: "external-id",
		id: "P1296",
		label: "Gran Enciclopèdia Catalana ID",
		example: [
			52,
			3734567,
			712504
		],
		types: [
		],
		aliases: [
			"GEC ID",
			"Enciclopèdia Catalana ID",
			"Catalan encyclopedia ID",
			"GrEC ID"
		]
	},
	{
		description: "identifier for an item in the Gran Enciclopèdia de la Música",
		datatype: "external-id",
		id: "P6412",
		label: "Gran Enciclopèdia de la Música ID",
		example: [
			1299,
			303
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a place on the Grand Canyon Trust website",
		datatype: "external-id",
		id: "P7102",
		label: "Grand Canyon Trust ID",
		example: [
			64998358,
			63565907,
			66091922
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in GrassBase - The Online World Grass Flora",
		datatype: "external-id",
		id: "P1832",
		label: "GrassBase ID",
		example: [
			11575
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Spanish language, Aragon-themed, Great Aragonese Encyclopedia (GEA)",
		datatype: "external-id",
		id: "P1807",
		label: "Great Aragonese Encyclopedia ID",
		example: [
			4040,
			1389060
		],
		types: [
		],
		aliases: [
			"GEA ID",
			"Aragon encyclopedia ID",
			"GAE ID"
		]
	},
	{
		description: "identifier of an item in the Great Encyclopaedia of Navarre",
		datatype: "external-id",
		id: "P7388",
		label: "Great Encyclopedia of Navarre ID",
		example: [
			4018,
			1773006,
			917891,
			318272
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an entry on the official website of the Great Russian Encyclopedia",
		datatype: "external-id",
		id: "P2924",
		label: "Great Russian Encyclopedia Online ID",
		example: [
			1203,
			940337
		],
		types: [
		],
		aliases: [
			"GREO ID",
			"GREOID"
		]
	},
	{
		description: "identifier for an American school on the GreatSchools.org website",
		datatype: "external-id",
		id: "P7948",
		label: "GreatSchools ID",
		example: [
			85106062,
			85106423,
			85106609
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on GreatSong site",
		datatype: "external-id",
		id: "P7210",
		label: "GreatSong artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a basketball player on the Greek Basket League website",
		datatype: "external-id",
		id: "P5722",
		label: "Greek Basket League ID",
		example: [
			353845,
			316252,
			335767
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "date the Gregorian calendar was first used",
		datatype: "time",
		id: "P7295",
		label: "Gregorian calendar start date",
		example: [
			35,
			34,
			170174
		],
		types: [
		],
		aliases: [
			"adoption of the Gregorian calendar",
			"Gregorian calendar first used",
			"first date (N.S.)"
		]
	},
	{
		description: "identifier for Greek manuscripts of the New Testament",
		datatype: "external-id",
		id: "P1577",
		label: "Gregory-Aland-Number",
		example: [
			1165472,
			252809,
			6870760,
			6512331
		],
		types: [
		],
		aliases: [
			"GA-Number"
		]
	},
	{
		description: "identifier for a glacier on the Glacier Risks Data Base website",
		datatype: "external-id",
		id: "P3707",
		label: "Gridabase glacier ID",
		example: [
			2419346,
			11213496
		],
		types: [
		],
		aliases: [
			"Glacier Risks Data Base"
		]
	},
	{
		description: "persistent identifier for an artwork from the collection of the Groeningemuseum in Bruges, Belgium",
		datatype: "external-id",
		id: "P2282",
		label: "Groeningemuseum work PID",
		example: [
			20020184
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an article on the Group Properties wiki",
		datatype: "external-id",
		id: "P8417",
		label: "Group Properties wiki ID",
		example: [
			849512,
			245462,
			7667912,
			550593
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a topic in Grove Art Online",
		datatype: "external-id",
		id: "P8406",
		label: "Grove Art Online ID",
		example: [
			5687551,
			83047250
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a topic in Grove Music Online",
		datatype: "external-id",
		id: "P8591",
		label: "Grove Music Online ID",
		example: [
			3129343,
			341482,
			1017
		],
		types: [
		],
		aliases: [
			"GMO ID"
		]
	},
	{
		description: "identifier of cultural relevant places in the Brazilian city Guarulhos",
		datatype: "external-id",
		id: "P6691",
		label: "GruCultura ID",
		example: [
			25420202,
			10345170,
			10378895
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a company in the Gry-Online database",
		datatype: "external-id",
		id: "P7997",
		label: "Gry Online company ID",
		example: [
			178824,
			651140,
			1172164,
			11709677,
			720871
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a topic at the Guardian newspaper website",
		datatype: "external-id",
		id: "P3106",
		label: "Guardian topic ID",
		example: [
			638,
			125121
		],
		types: [
		],
		aliases: [
			"Guardian",
			"The Guardian topic"
		]
	},
	{
		description: "identifier in the SEGA videogame database Guardiana",
		datatype: "external-id",
		id: "P4710",
		label: "Guardiana ID",
		example: [
			37123
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person awarded a Guggenheim fellowship in the arts",
		datatype: "external-id",
		id: "P6594",
		label: "Guggenheim fellows ID",
		example: [
			29975543,
			2344210,
			42816179
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a comic book artist",
		datatype: "external-id",
		id: "P7257",
		label: "Guia dos Quadrinhos artist ID",
		example: [
			353573,
			207676,
			205739
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a comic book character",
		datatype: "external-id",
		id: "P7268",
		label: "Guia dos Quadrinhos character ID",
		example: [
			6899893,
			2695156,
			7620503
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a non-Brazilian comic book or graphic novel that was published in Brazil",
		datatype: "external-id",
		id: "P7269",
		label: "Guia dos Quadrinhos comic ID",
		example: [
			343615,
			15051307,
			744536
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a Brazilian comic book or graphic novel",
		datatype: "external-id",
		id: "P7266",
		label: "Guia dos Quadrinhos comic ID (Brazilian)",
		example: [
			6900099,
			61000823,
			9672597
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a non-Brazilian comic book publishing house that has its comics published in Brazil",
		datatype: "external-id",
		id: "P7270",
		label: "Guia dos Quadrinhos publishing house ID",
		example: [
			2924461,
			173496,
			12103
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a Brazilian comic book publishing house",
		datatype: "external-id",
		id: "P7267",
		label: "Guia dos Quadrinhos publishing house ID (Brazilian)",
		example: [
			2556363,
			2990311,
			2005836
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the Guida al Fumetto Italiano website",
		datatype: "external-id",
		id: "P6206",
		label: "Guida al Fumetto Italiano ID",
		example: [
			15146824,
			1025857,
			1323273
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P4907",
		label: "Guide Nicaise ID",
		example: [
			50037135,
			50038067,
			50015929,
			50063481
		],
		types: [
		],
		aliases: [
			"Nicaise ID"
		]
	},
	{
		description: "identifier of a person in the guide of the French Catholic Church, edited by the Bishops' Conference of France",
		datatype: "external-id",
		id: "P3397",
		label: "Guide of the French Church person ID",
		example: [
			44886
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a bird taxon in the Guide to North American Birds on the National Audubon Society website",
		datatype: "external-id",
		id: "P4715",
		label: "Guide to North American Birds ID",
		example: [
			647512,
			594810
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ligand identifier of the Guide to Pharmacology database",
		datatype: "external-id",
		id: "P595",
		label: "Guide to Pharmacology Ligand ID",
		example: [
			41576,
			81225,
			167934
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"IUPHAR ligand",
			"IUPHAR ID"
		]
	},
	{
		description: "target identifier of the Guide to Pharmacology database",
		datatype: "external-id",
		id: "P5458",
		label: "Guide to Pharmacology Target ID",
		example: [
			2035393,
			14902310,
			21115043
		],
		types: [
			"representing a unique identifier",
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "ID in the Israeli non-profit organizations database GuideStar",
		datatype: "external-id",
		id: "P3914",
		label: "GuideStar Israel organization ID",
		example: [
			6952627
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a package record in the GNU Guix system",
		datatype: "external-id",
		id: "P6765",
		label: "Guix Variable Name",
		example: [
			161234,
			178940,
			852000,
			864915
		],
		types: [
			"for software",
			"representing a unique identifier"
		],
		aliases: [
			"GNU Guix Variable Name",
			"Guix package ID",
			"GNU Guix package ID"
		]
	},
	{
		description: "identifier for a book, in the GujLit database of literature of Gujarati language of India",
		datatype: "external-id",
		id: "P4181",
		label: "GujLit Book ID",
		example: [
			18003015
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person, in the GujLit database of literature of the Gujarati language of India",
		datatype: "external-id",
		id: "P4180",
		label: "GujLit Person ID",
		example: [
			2724598,
			2767811
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Guthrie code of a Bantu language",
		datatype: "external-id",
		id: "P2161",
		label: "Guthrie code",
		example: [
			33583,
			7022547
		],
		types: [
			"representing a unique identifier",
			"for items about languages"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete on the Gymn Forum website",
		datatype: "external-id",
		id: "P4546",
		label: "Gymn Forum athlete ID",
		example: [
			116954,
			6763005
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a place (city, region or country) on the Gynopedia wiki about sexual and reproductive health care",
		datatype: "external-id",
		id: "P5843",
		label: "Gynopedia ID",
		example: [
			398,
			2256,
			38834
		],
		types: [
			"representing a unique identifier",
			"related to medicine"
		],
		aliases: [
			"Gynopedia place ID"
		]
	},
	{
		description: "identifier of a family name in the Géopatronyme database",
		datatype: "external-id",
		id: "P3370",
		label: "Géopatronyme ID",
		example: [
			1904192,
			21493051,
			21501989
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier assigned by the Historic American Engineering Record",
		datatype: "external-id",
		id: "P6428",
		label: "HAER ID",
		example: [
			172822,
			125821,
			44440
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P7864",
		label: "HAL article ID",
		example: [
			60571254,
			34528728,
			30605976
		],
		types: [
		],
		aliases: [
			"identifier HAL for article"
		]
	},
	{
		description: "identifier of a researcher on HAL, an open archive allowing to deposit scholarly documents freely searchable",
		datatype: "external-id",
		id: "P4450",
		label: "HAL author ID",
		example: [
			42308182,
			42307537,
			28018776,
			3288337
		],
		types: [
		],
		aliases: [
			"HAL ID",
			"idHAL"
		]
	},
	{
		description: "numerical code for a research institution as stored in HAL author affiliations",
		datatype: "external-id",
		id: "P6773",
		label: "HAL structure ID",
		example: [
			3152062,
			3214360,
			16008925
		],
		types: [
		],
		aliases: [
			"HAL institution ID"
		]
	},
	{
		description: "ID of the data-sheet of members of the Hungarian Academy of Sciences (Q265058)",
		datatype: "external-id",
		id: "P3226",
		label: "HAS member ID",
		example: [
			957435,
			1175738
		],
		types: [
		],
		aliases: [
			"MTA member ID"
		]
	},
	{
		description: "codes to represent names of country subdivisions",
		datatype: "external-id",
		id: "P8119",
		label: "HASC",
		example: [
			99,
			104994,
			18677767,
			12661
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Hierarchical Administrative Subdivision Code"
		]
	},
	{
		description: "identifier for a French politician on the High Authority for Transparency in Public Life website",
		datatype: "external-id",
		id: "P4703",
		label: "HATVP person ID",
		example: [
			455023,
			3579995
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a creative work on  HBO Max",
		datatype: "external-id",
		id: "P8298",
		label: "HBO Max ID",
		example: [
			23572,
			109116,
			155629
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for entries in the HCA Red List of Endangered Crafts",
		datatype: "external-id",
		id: "P6599",
		label: "HCA Red List of Endangered Crafts ID",
		example: [
			203605,
			28873643
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a chemical in the Hazardous Chemical Information System by Safe Work Australia",
		datatype: "external-id",
		id: "P7025",
		label: "HCIS ID",
		example: [
			153,
			64878155,
			28086552,
			2025
		],
		types: [
			"representing a unique identifier",
			"related to chemistry"
		],
		aliases: [
		]
	},
	{
		description: "identifier in HDS/HLS/DHS/DSS: Historical Dictionary of Switzerland (Q642074), a national encyclopedia",
		datatype: "external-id",
		id: "P902",
		label: "HDS ID",
		example: [
			67470,
			435456
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"HLS",
			"DHS",
			"DSS",
			"Historical Dictionary of Switzerland",
			"HDS identifier"
		]
	},
	{
		description: "A unique ID provided by the HGNC for each gene with an approved symbol. HGNC IDs remain stable even if a name or symbol changes.",
		datatype: "external-id",
		id: "P354",
		label: "HGNC ID",
		example: [
			414043
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "The official gene symbol approved by the HGNC, which is typically a short form of the gene name.",
		datatype: "external-id",
		id: "P353",
		label: "HGNC gene symbol",
		example: [
			414043
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Sequence Variant Nomenclature from the Human Genome Variation Society (HGVS)",
		datatype: "external-id",
		label: "HGVS nomenclature",
		id: "P3331",
		types: [
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "identifier of an NHL ice hockey player at the Hockey Hall of Fame website (HHOF.com)",
		datatype: "external-id",
		id: "P3567",
		label: "HHOF.com NHL player ID",
		example: [
			1282969,
			311280
		],
		types: [
		],
		aliases: [
			"Legends of Hockey ID",
			"Hockey Hall of Fame NHL player ID"
		]
	},
	{
		description: "Hong Kong Chinese Authority (Name) ID",
		datatype: "external-id",
		id: "P5909",
		label: "HKCAN ID",
		example: [
			701855,
			5443379,
			15941160
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film at the HKMDB (Hong Kong Movie Database) website",
		datatype: "external-id",
		id: "P2883",
		label: "HKMDB film ID",
		example: [
			987752,
			781053
		],
		types: [
		],
		aliases: [
			"HKMDb film ID"
		]
	},
	{
		description: "identifier for a person at the HKMDB (Hong Kong Movie Database) website",
		datatype: "external-id",
		id: "P3346",
		label: "HKMDB person ID",
		example: [
			24833346,
			706192
		],
		types: [
		],
		aliases: [
			"HKMDb person ID"
		]
	},
	{
		description: "identifier for a person or organization in the database of Het Nieuwe Instituut",
		datatype: "external-id",
		id: "P2476",
		label: "HNI person/institution ID",
		example: [
			232364,
			2015762
		],
		types: [
		],
		aliases: [
			"HNI person ID",
			"HNI person identifier",
			"HNI institution ID",
			"HNI institution identifier"
		]
	},
	{
		description: "identifier for a place in the Historical Gazetteer of Saxony",
		datatype: "external-id",
		id: "P7046",
		label: "HOV-ID",
		example: [
			1731,
			2795,
			14819
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"HOV Code"
		]
	},
	{
		description: "identifier of an entity of Portuguese influence, including geographic/toponymic, onomastic, original author, chronological references, etc.",
		datatype: "external-id",
		id: "P5094",
		label: "HPIP ID",
		example: [
			2337984
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"HPI ID",
			"Heritage of Portuguese Influence ID"
		]
	},
	{
		description: "ID in Hazardous Substances Data Bank",
		datatype: "external-id",
		id: "P2062",
		label: "HSDB ID",
		example: [
			161521,
			118551
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "string in HTML source code that represents this character on a page",
		datatype: "string",
		id: "P4575",
		label: "HTML entity",
		example: [
			9987,
			1053612
		],
		types: [
			"for software"
		],
		aliases: [
		]
	},
	{
		description: "identifier per HURDAT (North Atlantic hurricane database)",
		datatype: "string",
		id: "P502",
		label: "HURDAT identifier",
		example: [
			264,
			498340
		],
		types: [
		],
		aliases: [
			"HURDAT"
		]
	},
	{
		description: "unique identifier of a user account on the Hacker News social media website",
		datatype: "external-id",
		id: "P7171",
		label: "Hacker News username",
		example: [
			92650,
			66302463,
			64743585
		],
		types: [
		],
		aliases: [
			"Hacker News user ID"
		]
	},
	{
		description: "identifier in the database of Amiga video games Hall of Light",
		datatype: "external-id",
		id: "P4671",
		label: "Hall of Light ID",
		example: [
			2608283,
			7577489
		],
		types: [
			"representing a unique identifier",
			"for software"
		],
		aliases: [
			"Hall of Light Amiga database ID"
		]
	},
	{
		description: "identifier for a medal recipient, in the US Hall of Valor",
		datatype: "external-id",
		id: "P1869",
		label: "Hall of Valor ID",
		example: [
			5093459,
			87769136,
			67907138
		],
		types: [
		],
		aliases: [
			"The Hall of Valor ID",
			"Military Times Valor ID",
			"Valor ID"
		]
	},
	{
		description: "Han character(s) this lexeme consists of",
		datatype: "wikibase-item",
		label: "Han character in this lexeme",
		id: "P5425",
		types: [
		],
		aliases: [
			"Chinese character in this lexeme",
			"hanzi in this lexeme",
			"kanji in this lexeme",
			"hanja in this lexeme"
		]
	},
	{
		description: "identifier for a TV Series in the HanCinema database",
		datatype: "external-id",
		id: "P5091",
		label: "HanCinema drama ID",
		example: [
			30147768
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a films in the HanCinema database",
		datatype: "external-id",
		id: "P5108",
		label: "HanCinema film ID",
		example: [
			3809340,
			73993691
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the HanCinema database",
		datatype: "external-id",
		id: "P3045",
		label: "HanCinema person ID",
		example: [
			487962
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a player on the Handball-Bundesliga (HBL) website",
		datatype: "external-id",
		id: "P5057",
		label: "Handball-Bundesliga player ID",
		example: [
			1260466,
			28528643
		],
		types: [
		],
		aliases: [
			"HBL player ID",
			"Handball Bundesliga ID"
		]
	},
	{
		description: "identifier for an handball player at Handball123",
		datatype: "external-id",
		id: "P7002",
		label: "Handball123 player ID",
		example: [
			456871,
			943865,
			1413770,
			22086056,
			4720793,
			270507
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a subject in the Handbook of Texas Online",
		datatype: "external-id",
		id: "P6015",
		label: "Handbook of Texas ID",
		example: [
			52160965,
			6695114,
			6301332,
			156444
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"The Handbook of Texas Online ID",
			"tshaonline ID"
		]
	},
	{
		description: "Handle System identifier, which is a superset of the DOI",
		datatype: "external-id",
		id: "P1184",
		label: "Handle ID",
		example: [
			15664389,
			63615887
		],
		types: [
		],
		aliases: [
			"Handle System ID",
			"hdl",
			"Handle.NET ID",
			"Handle"
		]
	},
	{
		description: "The modern Korean pronunciation(s) for this character in Hangul",
		datatype: "wikibase-item",
		id: "P5537",
		label: "Hangul of a Chinese character",
		example: [
			3595029,
			3594965,
			3594998
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier for a work by Hans Christian Andersen in the Digterens danske Værker catalogue",
		datatype: "external-id",
		id: "P3675",
		label: "Hans Christian Andersen Centre work ID",
		example: [
			11868,
			12317960
		],
		types: [
		],
		aliases: [
			"Hans Christian Andersen Centre's work ID"
		]
	},
	{
		description: "identifier of a person in the Hansard 1803-2005 database, indexing speeches in the British parliament (both Commons and Lords)",
		datatype: "external-id",
		id: "P2015",
		label: "Hansard (1803–2005) ID",
		example: [
			7529424
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Hansard ID (1803-2005)",
			"Hansard identifier (1803-2005)",
			"Hansard (1803-2005) ID"
		]
	},
	{
		description: "identifier for a British MP in Hansard (2006–March 2016)",
		datatype: "external-id",
		id: "P2170",
		label: "Hansard (2006–March 2016) ID",
		example: [
			263802
		],
		types: [
		],
		aliases: [
			"Hansard ID (2006-March 2016)",
			"Hansard identifer (2006-March 2016)",
			"Hansard (2006-March 2016) ID"
		]
	},
	{
		description: "identifier for a vegan or vegetarian restaurant, on the HappyCow reviews website",
		datatype: "external-id",
		id: "P3877",
		label: "HappyCow restaurant ID",
		example: [
			28804296
		],
		types: [
		],
		aliases: [
			"HappyCow ID"
		]
	},
	{
		description: "identifier of an electronic device model as registered in the Radio Equipment List of Innovation, Science and Economic Development Canada",
		datatype: "string",
		id: "P7330",
		label: "Hardware Version Identification Number",
		example: [
			66816999,
			66817000,
			66816996
		],
		types: [
		],
		aliases: [
			"HVIN"
		]
	},
	{
		description: "code in the Harmonized System for a category of object traded internationally",
		datatype: "string",
		id: "P5471",
		label: "Harmonized System Code",
		example: [
			44,
			174320,
			1578
		],
		types: [
		],
		aliases: [
			"HSC",
			"Harmonised System Code"
		]
	},
	{
		description: "identifier for a person who wrote for Harper's Magazine",
		datatype: "external-id",
		id: "P6784",
		label: "Harper's author ID",
		example: [
			4760010,
			4894197,
			15984855,
			38293144
		],
		types: [
		],
		aliases: [
			"Harper's Monthly Magazine author ID"
		]
	},
	{
		description: "numerical identifier for a person in the Harvard Index of Botanists",
		datatype: "external-id",
		id: "P6264",
		label: "Harvard Index of Botanists ID",
		example: [
			21508662,
			347356,
			3418824
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a publication, in Harvard University Herbaria & Libraries' 'Index of Botanical Publications'",
		datatype: "external-id",
		id: "P4754",
		label: "Harvard botanical journal ID",
		example: [
			2975482,
			2160866
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a pre-1963 spacecraft",
		datatype: "external-id",
		id: "P5049",
		label: "Harvard designation",
		example: [
			80811
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier from the HathiTrust Digital Library",
		datatype: "external-id",
		id: "P1844",
		label: "HathiTrust ID",
		example: [
			19208345,
			19826579
		],
		types: [
		],
		aliases: [
			"Hathi Trust ID"
		]
	},
	{
		description: "identifier for a data breach in haveibeenpwned.com",
		datatype: "external-id",
		id: "P8526",
		label: "Have I Been Pwned breach ID",
		example: [
			76316495,
			20863583,
			76313785
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete on the Hawai‘i Sports Hall of Fame website",
		datatype: "external-id",
		id: "P4365",
		label: "Hawai‘i Sports Hall of Fame ID",
		example: [
			6709333,
			5235382
		],
		types: [
		],
		aliases: [
			"Hawaii Sports Hall of Fame ID"
		]
	},
	{
		description: "Identifier for the Haz-Map database, an openly accessible resource on hazardous agents and occupational disease licensed to and published by NCBI/NLM from 2000-2019. It is still accessible and updated, but no longer licensed by NCBI/NLM",
		datatype: "external-id",
		id: "P7999",
		label: "Haz-Map ID",
		example: [
			342939,
			808266,
			1799146
		],
		types: [
			"related to chemistry",
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "health care procedure codes based on the American Medical Association's Current Procedural Terminology",
		datatype: "external-id",
		id: "P7410",
		label: "Healthcare Common Procedure Coding System Identifier",
		example: [
			4689286,
			410061,
			423445
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "entry in Hederich’s encyclopedia of mythology, 3rd edition (1770), via zeno.org",
		datatype: "external-id",
		id: "P2272",
		label: "Hederich encyclopedia article ID",
		example: [
			2786349
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Hederich article",
			"Gründliches mythologisches Lexikon ID"
		]
	},
	{
		description: "entry in the list of members of the Heidelberg Academy for Sciences and Humanities",
		datatype: "external-id",
		id: "P2273",
		label: "Heidelberg Academy for Sciences and Humanities member ID",
		example: [
			67327
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P7667",
		label: "Hellenic Civil Aviation Authority airport code",
		example: [
			211734,
			1430762,
			733326
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete on the Hellenic Olympic Committee website",
		datatype: "external-id",
		id: "P4489",
		label: "Hellenic Olympic Committee athlete ID",
		example: [
			366824,
			405614
		],
		types: [
		],
		aliases: [
			"HOC athlete ID"
		]
	},
	{
		description: "buildings identifier of the City of Helsinki, replaced by nationwide VTJ-PRT",
		datatype: "external-id",
		id: "P8355",
		label: "Helsinki persistent building ID Ratu",
		example: [
			738015,
			926046
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Swiss National Library's archive database",
		datatype: "external-id",
		id: "P1255",
		label: "HelveticArchives ID",
		example: [
			123332,
			117520
		],
		types: [
		],
		aliases: [
			"SZ ID",
			"National Library of Switzerland ID",
			"Swiss National Library ID"
		]
	},
	{
		description: "identifier for an item in Henrik Ibsen writings",
		datatype: "external-id",
		id: "P8518",
		label: "Henrik Ibsen writings ID",
		example: [
			208094,
			353014,
			1777844,
			59995340
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "heritage conservation district of Ontario reference number",
		datatype: "external-id",
		id: "P4334",
		label: "Heritage Conservation District of Ontario ID",
		example: [
			26266304
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for records on the historic environment in England",
		datatype: "external-id",
		id: "P8169",
		label: "Heritage Gateway ID",
		example: [
			66480099,
			17547661,
			26397939
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for sites in the Heritage Gazetteer of Cyprus",
		datatype: "external-id",
		id: "P6916",
		label: "Heritage Gazetteer of Cyprus",
		example: [
			580797,
			2224564,
			1408931,
			1584818
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for sites in the Heritage Gazetteer of Libya",
		datatype: "external-id",
		id: "P6751",
		label: "Heritage Gazetteer of Libya ID",
		example: [
			45829,
			44112,
			55984349
		],
		types: [
			"for places"
		],
		aliases: [
		]
	},
	{
		description: "identifier of the Heritage Lighthouse designated by the Historic Sites and Monuments Board of Canada",
		datatype: "external-id",
		id: "P3211",
		label: "Heritage Lighthouse of Canada ID",
		example: [
			3378335
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of the Heritage Railway Station designated by the Historic Sites and Monuments Board of Canada",
		datatype: "external-id",
		id: "P3209",
		label: "Heritage Railway Station of Canada ID",
		example: [
			276785
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Hermann-Mauguin notation of the mineral's symmetry element (short form)",
		datatype: "external-id",
		id: "P1632",
		label: "Hermann-Mauguin notation",
		example: [
			13362471
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID for a heritage feature in the Highland Historic Environment Record website and database",
		datatype: "external-id",
		id: "P7304",
		label: "Highland Historic Environment Record ID",
		example: [
			1135357,
			639663,
			1815785
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"HHER ID",
			"MHG",
			"Highland HER",
			"Highland HER ID"
		]
	},
	{
		description: "identifier for an area on the Hiking Project website",
		datatype: "external-id",
		id: "P7271",
		label: "Hiking Project area ID",
		example: [
			3114858,
			41164,
			1934145
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a remarkable site (a 'gem') on the Hiking Project website",
		datatype: "external-id",
		id: "P7272",
		label: "Hiking Project site ID",
		example: [
			39739,
			1060496,
			1072342
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a trail on the Hiking Project website",
		datatype: "external-id",
		id: "P7116",
		label: "Hiking Project trail ID",
		example: [
			65924445,
			56221426,
			3478661
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "numerical identifier for a waypoint on hikr.org",
		datatype: "external-id",
		id: "P8593",
		label: "Hikr waypoint ID",
		example: [
			661631,
			2943281,
			15224
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an endangered heritage item (sometimes a natural element) as listed in Hispania Nostra's Red List of Endangered Heritage",
		datatype: "external-id",
		id: "P4868",
		label: "Hispania Nostra Red List code",
		example: [
			5910052,
			5754814
		],
		types: [
		],
		aliases: [
			"Hispania Nostra Red List of Endangered Heritage identifier",
			"Red List of Endangered Heritage ID"
		]
	},
	{
		description: "identifier for a person on the Historia de la Medicina website",
		datatype: "external-id",
		id: "P5468",
		label: "Historia de la Medicina person ID",
		example: [
			264593,
			4766629,
			1406552
		],
		types: [
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an hotel on the Historic Hotels Worldwide website",
		datatype: "external-id",
		id: "P5735",
		label: "Historic Hotels Worldwide ID",
		example: [
			3145393,
			3145660,
			1631066
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an hotel on the Historic Hotels of America website",
		datatype: "external-id",
		id: "P5734",
		label: "Historic Hotels of America ID",
		example: [
			1239042,
			1942904,
			3027805
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an hotel on the Historic Hotels of Europe website",
		datatype: "external-id",
		id: "P5774",
		label: "Historic Hotels of Europe ID",
		example: [
			48869166,
			7307613
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "numerical identifier for a structure or building on the Historic Montana website",
		datatype: "external-id",
		id: "P8617",
		label: "Historic Montana ID",
		example: [
			60766423,
			24693388,
			3109921
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a location in Wales on the List of Historic Place Names of Wales",
		datatype: "external-id",
		id: "P4697",
		label: "Historic Place Names of Wales ID",
		example: [
			5057265,
			7597996
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a building in the Historic Scotland database",
		datatype: "external-id",
		id: "P709",
		label: "Historic Scotland ID",
		example: [
			57803,
			129472,
			15232541
		],
		types: [
		],
		aliases: [
			"HB number",
			"HS ID"
		]
	},
	{
		description: "identifier for a person or an institution that have created, preserved and used the groups of records that constitute the fonds at the Historical Archives of the European Union",
		datatype: "external-id",
		id: "P6917",
		label: "Historical Archives of the European Union ID",
		example: [
			4951,
			153832,
			1378099,
			78525,
			15849
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"HAEU ID"
		]
	},
	{
		description: "Historical Gazetteer",
		datatype: "external-id",
		id: "P2503",
		label: "Historical Gazetteer (GOV) ID",
		example: [
			504279
		],
		types: [
		],
		aliases: [
			"GOV ID",
			"GOV-ID"
		]
	},
	{
		description: "identifier for a place in the Historical Gazetteer of England's Place Names website",
		datatype: "external-id",
		label: "Historical Gazetteer of England's Place Names ID",
		id: "P3627",
		types: [
		],
		aliases: [
		]
	},
	{
		description: "database entries of historical markers",
		datatype: "external-id",
		id: "P7883",
		label: "Historical Marker Database ID",
		example: [
			67503613,
			4923612,
			75829450,
			14705640,
			4966831,
			48895869,
			73331165,
			7355375,
			73332954,
			83196475,
			6796997,
			6484602,
			15238589,
			7084807,
			18159219,
			1331174,
			72877044
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"HMDB ID"
		]
	},
	{
		description: "identifier for a historic structure or a building on the History Colorado website",
		datatype: "external-id",
		id: "P8158",
		label: "History Colorado ID",
		example: [
			90872624,
			90796568,
			49561812
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person or topic in the History of Modern Biomedicine database",
		datatype: "external-id",
		id: "P3885",
		label: "History of Modern Biomedicine ID",
		example: [
			5354193,
			133805,
			29642428,
			29642874
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"History of Modern Biomedicine Group ID",
			"HMBID",
			"History of Modern Biomedicine Research Group ID",
			"HMBRGID",
			"HoMBRG ID"
		]
	},
	{
		description: "identifier on the History of Parliament website",
		datatype: "external-id",
		id: "P1614",
		label: "History of Parliament ID",
		example: [
			6218368,
			1346375
		],
		types: [
		],
		aliases: [
			"HoP ID"
		]
	},
	{
		description: "identifier for ice hockey players at Hockey-Reference.com",
		datatype: "external-id",
		id: "P3598",
		label: "Hockey-Reference.com player ID",
		example: [
			446986
		],
		types: [
		],
		aliases: [
			"Hockey-reference player ID"
		]
	},
	{
		description: "identifier for an ice hockey player in the Internet Hockey Database",
		datatype: "external-id",
		id: "P2602",
		label: "HockeyDB.com player ID",
		example: [
			253073,
			30232217
		],
		types: [
		],
		aliases: [
			"HockeyDB player ID"
		]
	},
	{
		description: "identifier of mills in \"Vereniging de Hollandsche Molen\", an organization that focuses on preservation of wind- and watermills in the Netherlands.",
		datatype: "external-id",
		id: "P2866",
		label: "Hollandsche Molen ID",
		example: [
			5513402,
			14517905
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the Home of the Underdogs database",
		datatype: "external-id",
		id: "P7563",
		label: "Home of the Underdogs game ID",
		example: [
			1265597,
			202810,
			88828,
			1001925
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Attic of the Underdogs ID"
		]
	},
	{
		description: "identifier of a package (formula) in the Homebrew package manager",
		datatype: "external-id",
		id: "P8443",
		label: "Homebrew formula name",
		example: [
			186055,
			535461
		],
		types: [
			"for software"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the HomoloGene database",
		datatype: "string",
		id: "P593",
		label: "HomoloGene ID",
		example: [
			423107,
			223739,
			192191
		],
		types: [
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "authorized term in the International Thesaurus of Lesbian, Gay, Bisexual and Transgender Index Terms (Homosaurus)",
		datatype: "external-id",
		id: "P6417",
		label: "Homosaurus ID",
		example: [
			81299,
			6636
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an individual on Hoopla",
		datatype: "external-id",
		id: "P6868",
		label: "Hoopla artist ID",
		example: [
			7245,
			125121,
			210059
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a publisher on Hoopla",
		datatype: "external-id",
		id: "P6869",
		label: "Hoopla publisher ID",
		example: [
			4669411,
			2137023,
			168407
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a series in Hoopla",
		datatype: "external-id",
		id: "P7651",
		label: "Hoopla series ID",
		example: [
			7719588,
			11679,
			2886835,
			2603941
		],
		types: [
			"representing a unique identifier",
			"for items about works"
		],
		aliases: [
		]
	},
	{
		description: "an audiobook, film, music album, comic, ebook, or television series on Hoopla",
		datatype: "external-id",
		id: "P5680",
		label: "Hoopla title ID",
		example: [
			15728879,
			17544553,
			128444,
			216204
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "Hornbostel-Sachs classification of a musical instrument",
		datatype: "string",
		id: "P1762",
		label: "Hornbostel-Sachs classification",
		example: [
			659216,
			3152896,
			8338,
			187780,
			183932,
			5994,
			5521203
		],
		types: [
		],
		aliases: [
			"Sachs–Hornbostel",
			"Hornbostel-Sachs"
		]
	},
	{
		description: "identifier for a horse on Horsetelex database",
		datatype: "external-id",
		id: "P3165",
		label: "Horsetelex ID",
		example: [
			22318003
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a hotel on the Hotels.com website",
		datatype: "external-id",
		id: "P3898",
		label: "Hotels.com hotel ID",
		example: [
			5182624,
			743147,
			56506795
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a topic in House Divided: The Civil War Research Engine at Dickinson College",
		datatype: "external-id",
		id: "P8400",
		label: "House Divided ID",
		example: [
			1210045,
			55725954
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the House of Representatives of Morocco website",
		datatype: "external-id",
		id: "P5451",
		label: "House of Representatives of Morocco ID",
		example: [
			20961736
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game at the website HowLongToBeat",
		datatype: "external-id",
		id: "P2816",
		label: "HowLongToBeat ID",
		example: [
			1757876,
			1800173,
			2709813
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"HLTB",
			"How Long to Beat",
			"time to complete video game"
		]
	},
	{
		description: "identifier for an article in the Croatian Encyclopedia (Hrvatska enciklopedija)",
		datatype: "external-id",
		id: "P7982",
		label: "Hrvatska enciklopedija ID",
		example: [
			16114908,
			225,
			147516
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an entry in the Hrvatska tehnička enciklopedija",
		datatype: "external-id",
		id: "P8576",
		label: "Hrvatska tehnička enciklopedija ID",
		example: [
			17427167,
			4685619,
			397334
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the Hrvatski biografski leksikon (Croatian biographical dictionary)",
		datatype: "external-id",
		id: "P8581",
		label: "Hrvatski biografski leksikon ID",
		example: [
			1282930,
			4983483,
			381708
		],
		types: [
		],
		aliases: [
			"HBL ID"
		]
	},
	{
		description: "movie identifier in Hulu",
		datatype: "external-id",
		id: "P6466",
		label: "Hulu movie ID",
		example: [
			60738582,
			60761715,
			837945
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "TV series identifier in Hulu",
		datatype: "external-id",
		id: "P6467",
		label: "Hulu series ID",
		example: [
			23572,
			17572811,
			15072906
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "HDI value of a country",
		datatype: "quantity",
		id: "P1081",
		label: "Human Development Index",
		example: [
			739,
			17
		],
		types: [
			"related to economics"
		],
		aliases: [
			"HDI"
		]
	},
	{
		description: "ID in Human Metabolome Database",
		datatype: "external-id",
		id: "P2057",
		label: "Human Metabolome Database ID",
		example: [
			283,
			209460
		],
		types: [
		],
		aliases: [
			"HMDB ID",
			"HMDB accession number"
		]
	},
	{
		description: "The Human Phenotype Ontology (HPO) is a widely used vocabulary of phenotypic abnormalities encountered in human disease",
		datatype: "external-id",
		id: "P3841",
		label: "Human Phenotype Ontology ID",
		example: [
			21955204
		],
		types: [
			"related to medicine",
			"representing a unique identifier"
		],
		aliases: [
			"HPO ID"
		]
	},
	{
		description: "identifier for an application sold on the Humble Store",
		datatype: "external-id",
		id: "P4477",
		label: "Humble Store ID",
		example: [
			23013817,
			29045915,
			1648331
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Humble Bundle ID"
		]
	},
	{
		description: "registration number for Hungarian NGO",
		datatype: "external-id",
		id: "P4031",
		label: "Hungarian NGO ID",
		example: [
			1326397
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a past or present member or office-holder of the Hungarian Parliament",
		datatype: "external-id",
		id: "P4966",
		label: "Hungarian National Assembly identifier",
		example: [
			57641
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an organisation in the Hungarian National Namespace",
		datatype: "external-id",
		id: "P6989",
		label: "Hungarian National Namespace organisation ID",
		example: [
			648716,
			265058
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the Hungarian National Namespace",
		datatype: "external-id",
		id: "P6988",
		label: "Hungarian National Namespace person ID",
		example: [
			81219,
			57467
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a place in the Hungarian National Namespace",
		datatype: "external-id",
		id: "P6987",
		label: "Hungarian National Namespace place ID",
		example: [
			1781,
			45779
		],
		types: [
		],
		aliases: [
			"HNN place ID"
		]
	},
	{
		description: "identifier for an athlete on the website of the Hungarian Olympic Committee",
		datatype: "external-id",
		id: "P4066",
		label: "Hungarian Olympic Committee athlete ID",
		example: [
			542315,
			463618
		],
		types: [
		],
		aliases: [
			"MOB athlete ID"
		]
	},
	{
		description: "identifier for a company in the company register of Hungary",
		datatype: "external-id",
		id: "P2619",
		label: "Hungarian company ID",
		example: [
			458944
		],
		types: [
		],
		aliases: [
			"Hungarian company register number",
			"Hungarian company number",
			"Hungarian company register ID"
		]
	},
	{
		description: "unique identified for public bodies part in Hungary",
		datatype: "external-id",
		id: "P4993",
		label: "Hungarian public body ID",
		example: [
			988086
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "authorized term in the OSZK Thesaurus / Public thesaurus",
		datatype: "external-id",
		id: "P6382",
		label: "Hungarian public thesaurus ID",
		example: [
			144,
			4819934
		],
		types: [
		],
		aliases: [
			"OSZK Thesaurus ID"
		]
	},
	{
		description: "transcription of a monolingual text value in a non-latin script according to the guidelines of the Research Institute for Linguistics of the Hungarian Academy of Sciences (Q7315098), Helyesírás (Q1035212), and Hungarian Wikipedia (Q53464)",
		datatype: "string",
		label: "Hungarian-style transcription",
		id: "P2719",
		types: [
			"Wikidata qualifier",
			"with datatype string that is not an external identifier"
		],
		aliases: [
		]
	},
	{
		description: "transliteration of different Indic scripts",
		datatype: "string",
		label: "Hunterian transliteration",
		id: "P7605",
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon on the Hymenoptera Online website",
		datatype: "external-id",
		id: "P6021",
		label: "Hymenoptera Online taxon ID",
		example: [
			2843562,
			30034,
			2115746
		],
		types: [
		],
		aliases: [
			"HOL taxon ID"
		]
	},
	{
		description: "identifier for hymn authors in the Hymnary.org database",
		datatype: "external-id",
		id: "P6300",
		label: "Hymnary author ID",
		example: [
			1339,
			9554
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for hymnal in the Hymnary.org database",
		datatype: "external-id",
		id: "P6429",
		label: "Hymnary hymnal ID",
		example: [
			4824259,
			5378289
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an individual edition of a published hymn in the Hymnary.org database",
		datatype: "external-id",
		id: "P6430",
		label: "Hymnary instance ID",
		example: [
			57952536,
			57981407
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for hymn text in the Hymnary.org database",
		datatype: "external-id",
		id: "P6348",
		label: "Hymnary text ID",
		example: [
			30041440,
			356486,
			3179058
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for hymn tune in the Hymnary.org database",
		datatype: "external-id",
		id: "P6431",
		label: "Hymnary tune ID",
		example: [
			3008016,
			7711508,
			1058356,
			93359
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon in the database at Hypericum MySpecies",
		datatype: "external-id",
		id: "P6028",
		label: "Hypericum MySpecies ID",
		example: [
			158289,
			162486,
			159185,
			159330
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a scholarly article in the I-Revues bibliographic database",
		datatype: "external-id",
		id: "P8099",
		label: "I-Revues ID",
		example: [
			72183148,
			58830347,
			58153245
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "competition quality ranking assigned by the International Association of Athletics Federations used for comparison and future Olympic qualification",
		datatype: "string",
		id: "P7069",
		label: "IAAF competition category",
		example: [
			661729,
			679614
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "code for an Internet Advertising Bureau (IAB) Quality Assurance Guidelines (QAG) segment",
		datatype: "external-id",
		id: "P5250",
		label: "IAB code",
		example: [
			7066,
			3930,
			399
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Internet Advertising Bureau code"
		]
	},
	{
		description: "identifier for a female-born performer in the Internet Adult Film Database",
		datatype: "external-id",
		id: "P3869",
		label: "IAFD female performer ID",
		example: [
			1768172,
			35980
		],
		types: [
		],
		aliases: [
			"Internet Adult Film Database female-born ID",
			"IAFD female-born performer ID"
		]
	},
	{
		description: "identifier for a film in the Internet Adult Film Database",
		datatype: "external-id",
		id: "P5098",
		label: "IAFD film ID",
		example: [
			83103,
			7216
		],
		types: [
		],
		aliases: [
			"Internet Adult Film Database film ID"
		]
	},
	{
		description: "identifier for a male-born performer in the Internet Adult Film Database",
		datatype: "external-id",
		id: "P4505",
		label: "IAFD male performer ID",
		example: [
			999299,
			3012294,
			1738018
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in IANA's Root Zone Database of delegation details for top-level Internet domains",
		datatype: "external-id",
		id: "P5914",
		label: "IANA Root Zone Database ID",
		example: [
			159371,
			31636,
			39676,
			12947850,
			16049726
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"root zone ID",
			"punycode"
		]
	},
	{
		description: "name of a network service defined in Q30335969",
		datatype: "external-id",
		id: "P5814",
		label: "IANA service name",
		example: [
			440470,
			42283,
			170460
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a time zone in the IANA database",
		datatype: "external-id",
		id: "P6687",
		label: "IANA timezone ID",
		example: [
			28146035,
			16894228,
			5412120,
			4823536
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for cultural heritage records of Instituto Andaluz del Patrimonio Histórico",
		datatype: "external-id",
		id: "P8425",
		label: "IAPH code",
		example: [
			47476,
			1579766,
			6023212
		],
		types: [
		],
		aliases: [
			"IAPH ID"
		]
	},
	{
		description: "transliteration of Devanagari and other related Brahmic scripts",
		datatype: "string",
		label: "IAST transliteration",
		id: "P7581",
		types: [
			"for romanization system"
		],
		aliases: [
			"International Alphabet of Sanskrit Transliteration"
		]
	},
	{
		description: "identifier for a diver in the IAT (Institute for Applied Training Science / Institut für Angewandte Trainingswissenschaft) database",
		datatype: "external-id",
		id: "P2780",
		label: "IAT diver ID",
		example: [
			84871,
			518394
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a triathlete in the IAT (Institute for Applied Training Science / Institut für Angewandte Trainingswissenschaft) database",
		datatype: "external-id",
		id: "P2778",
		label: "IAT triathlete ID",
		example: [
			719376,
			241718
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a weightlifter in the IAT (Institute for Applied Training Science / Institut für Angewandte Trainingswissenschaft) database",
		datatype: "external-id",
		id: "P2779",
		label: "IAT weightlifter ID",
		example: [
			374353,
			454219
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "two-character identifier for an airline",
		datatype: "string",
		id: "P229",
		label: "IATA airline designator",
		example: [
			308952,
			4548
		],
		types: [
		],
		aliases: [
			"IATA reservation code",
			"International Air Transport Association airline designator"
		]
	},
	{
		description: "three-letter identifier for designating airports or cities (for airlines, see P229)",
		datatype: "string",
		id: "P238",
		label: "IATA airport code",
		example: [
			635361,
			3912794,
			90
		],
		types: [
		],
		aliases: [
			"International Air Transport Association airport code",
			"uio"
		]
	},
	{
		description: "identifier of a code page of characters assigned by IBM",
		datatype: "external-id",
		id: "P4734",
		label: "IBM code page ID",
		example: [
			5322566
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"CPGID",
			"IBM code page identifier"
		]
	},
	{
		description: "identifier of a coded character set assigned by IBM",
		datatype: "external-id",
		id: "P4735",
		label: "IBM coded character set ID",
		example: [
			193537
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"CCSID",
			"IBM coded character set identifier"
		]
	},
	{
		description: "identifier of a character/grapheme in the IBM graphic character identification system",
		datatype: "external-id",
		id: "P4736",
		label: "IBM graphic character global ID",
		example: [
			166764
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"GCGID",
			"IBM graphic character global identifier"
		]
	},
	{
		description: "identifier of a character set assigned by IBM",
		datatype: "external-id",
		id: "P4197",
		label: "IBM graphic character set global ID",
		example: [
			1421973
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"GCSGID"
		]
	},
	{
		description: "identifier for a railway station (Internationale Bahnhofsnummer)",
		datatype: "external-id",
		id: "P954",
		label: "IBNR ID",
		example: [
			254647,
			800863,
			800587
		],
		types: [
		],
		aliases: [
			"IBNR identifier",
			"IBNR"
		]
	},
	{
		description: "Standardized four-letter alphabetic code for bird species by the Institute for Bird Populations",
		datatype: "external-id",
		id: "P7182",
		label: "IBP 4-letter bird species alpha code",
		example: [
			747837,
			945114,
			512543,
			27074606
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for sportsperson in the International Bobsleigh & Skeleton Federation (IBSF) database",
		datatype: "external-id",
		id: "P2991",
		label: "IBSF athlete ID",
		example: [
			520234,
			525101
		],
		types: [
		],
		aliases: [
			"FIBT ID",
			"FIBT",
			"ISBF",
			"IBSF ID"
		]
	},
	{
		description: "identifier for a tropical cyclone, issued by the World Data Center for Meteorology",
		datatype: "external-id",
		id: "P4540",
		label: "IBTrACS cyclone ID",
		example: [
			5947135,
			498340
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "biathlete's identifier in the International Biathlon Union's database",
		datatype: "external-id",
		id: "P2459",
		label: "IBU biathlete ID",
		example: [
			189408,
			15478108
		],
		types: [
		],
		aliases: [
			"IBU biathlete identifier"
		]
	},
	{
		description: "ID of a film in the film catalogue of Instituto de la Cinematografía y de las Artes Audiovisuales",
		datatype: "external-id",
		id: "P5128",
		label: "ICAA film catalogue ID",
		example: [
			20026867
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "rating in the Spanish motion picture content rating system",
		datatype: "wikibase-item",
		id: "P3306",
		label: "ICAA rating",
		example: [
			20026867
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "three letter identifier for an airline (two letters only until 1982) (for airports, see P239)",
		datatype: "string",
		id: "P230",
		label: "ICAO airline designator",
		example: [
			213147,
			4548
		],
		types: [
		],
		aliases: [
			"International Civil Aviation Organization airline designator"
		]
	},
	{
		description: "four-character alphanumeric identifier for designating airports (for airlines, see P230)",
		datatype: "string",
		id: "P239",
		label: "ICAO airport code",
		example: [
			17431,
			45523,
			3912794
		],
		types: [
		],
		aliases: [
			"International Civil Aviation Organization airport code",
			"ICAO aerodrome code",
			"ICAO airfield code"
		]
	},
	{
		description: "identifier for the Central Institute for Catalogues and Documentation (form type CF)",
		datatype: "external-id",
		id: "P6287",
		label: "ICCD ID - CF form",
		example: [
			54872430,
			54872214,
			54868487
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for the Central Institute for Catalogues and Documentation (form type CG)",
		datatype: "external-id",
		id: "P6288",
		label: "ICCD ID - CG form",
		example: [
			742076,
			54855371,
			38372952
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for the Central Institute for Catalogues and Documentation (form type S)",
		datatype: "external-id",
		id: "P6286",
		label: "ICCD ID - S form",
		example: [
			55173029,
			55173038,
			1115846
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a chess player, at iccf.com",
		datatype: "external-id",
		id: "P3316",
		label: "ICCF player ID",
		example: [
			106807
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the ICD catalogue codes for diseases - Version 10",
		datatype: "external-id",
		id: "P494",
		label: "ICD-10",
		example: [
			2840
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"ICD 10",
			"ICD-10 code"
		]
	},
	{
		description: "identifier in the ICD-10-CM (International Classification of Diseases, 10th Revision, Clinical Modification)",
		datatype: "external-id",
		id: "P4229",
		label: "ICD-10-CM",
		example: [
			2103933
		],
		types: [
			"related to medicine",
			"representing a unique identifier"
		],
		aliases: [
			"ICD-10 CM",
			"ICD-10-CM code"
		]
	},
	{
		description: "identifier in the ICD-10-PCS (Procedure Coding System, International Classification of Diseases, 10th revision)",
		datatype: "external-id",
		id: "P1690",
		label: "ICD-10-PCS",
		example: [
			1693864,
			5045596
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"ICD-10 PCS",
			"PCS ICD-10"
		]
	},
	{
		description: "identifier in ICD terminology of diseases - Version 11 (foundation ID) (not Mortality and Morbidity Statistics ID)",
		datatype: "external-id",
		id: "P7807",
		label: "ICD-11 (foundation)",
		example: [
			854573,
			1477,
			177895
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in ICD terminology of diseases - Version 11 (Mortality and Morbidity Statistics) linearization (not the foundation ID)",
		datatype: "external-id",
		id: "P7329",
		label: "ICD-11 ID (MMS)",
		example: [
			830308,
			649717,
			168403
		],
		types: [
			"representing a unique identifier",
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the ICD catalogue codes for diseases – Version 9",
		datatype: "external-id",
		id: "P493",
		label: "ICD-9",
		example: [
			2840,
			2827132,
			10737,
			769815
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"ICD-9 code",
			"code ICD-9",
			"ICD 9"
		]
	},
	{
		description: "identifier in the ICD adaption assigning diagnostic and procedure codes",
		datatype: "string",
		id: "P1692",
		label: "ICD-9-CM",
		example: [
			5275614
		],
		types: [
			"related to medicine",
			"representing a unique identifier"
		],
		aliases: [
			"ICD-9 CM"
		]
	},
	{
		description: "International Classification of Diseases for Oncology",
		datatype: "external-id",
		id: "P563",
		label: "ICD-O",
		example: [
			2300699,
			11688946
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"International Classification of Diseases for Oncology"
		]
	},
	{
		description: "identifier for a canoer on the International Canoe Federation website",
		datatype: "external-id",
		id: "P3689",
		label: "ICF canoer ID",
		example: [
			269795,
			4889209
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a photographer on the International Center of Photography website",
		datatype: "external-id",
		id: "P8577",
		label: "ICP artist ID",
		example: [
			60809,
			271918,
			436687
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "classification method for primary care encounters",
		datatype: "string",
		id: "P667",
		label: "ICPC 2 ID",
		example: [
			42982,
			164655
		],
		types: [
			"related to medicine",
			"representing a unique identifier"
		],
		aliases: [
			"ICPC 2",
			"ICPC-2"
		]
	},
	{
		description: "identifier for a prisoner of war, in the archives of the International committee of the Red Cross",
		datatype: "external-id",
		id: "P4554",
		label: "ICRC PoW ID",
		example: [
			4797951,
			6788148
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a compound in the International Chemical Safety Card database",
		datatype: "external-id",
		id: "P5220",
		label: "ICSC ID",
		example: [
			153
		],
		types: [
			"representing a unique identifier",
			"related to chemistry"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the \"International Committee on Taxonomy of Viruses\"-database",
		datatype: "external-id",
		id: "P1076",
		label: "ICTV virus ID",
		example: [
			193447
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "classification of viruses of the International Committee on Taxonomy of Viruses by the molecular composition of the virus genome (DNA, RNA, double or single stranded and translational polarity)",
		datatype: "wikibase-item",
		id: "P4628",
		label: "ICTV virus genome composition",
		example: [
			29002462
		],
		types: [
		],
		aliases: [
			"virus group"
		]
	},
	{
		description: "identifier for information on Brazilian museums from museus.cultura.gov.br (Museusbr)",
		datatype: "external-id",
		id: "P4401",
		label: "ID Museus Brazil",
		example: [
			371803,
			10333736,
			1850416
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for natural monuments in Landkreis Oberspreewald-Lausitz",
		datatype: "external-id",
		id: "P8270",
		label: "ID natural monuments in Landkreis Oberspreewald-Lausitz",
		example: [
			93421780,
			93421779
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique identifier for Archaeological and Paleontological Heritage in Catalonia",
		datatype: "external-id",
		id: "P5957",
		label: "ID of Inventory of the Archaeological and Paleontological Heritage of Catalonia",
		example: [
			17151024,
			3079849,
			2294240
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a dark-sky place on the International Dark-Sky Association website",
		datatype: "external-id",
		id: "P4977",
		label: "IDA place ID",
		example: [
			4905096,
			1802857
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an occupation on IDEO",
		datatype: "external-id",
		id: "P1043",
		label: "IDEO Job ID",
		example: [
			1735282,
			520895
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "official identifier for a Catalonian territorial unit, from Institut Estadístic de Catalunya (IDESCAT)",
		datatype: "external-id",
		id: "P4335",
		label: "IDESCAT territorial code in Catalonia",
		example: [
			6904,
			1492,
			9059342
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a documentary film at the IDFA website",
		datatype: "external-id",
		id: "P7741",
		label: "IDFA film ID",
		example: [
			14944459,
			663341,
			7960559
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier on a researcher on the International Dictionary of Intellectual Historians",
		datatype: "external-id",
		id: "P5553",
		label: "IDIH ID",
		example: [
			521729,
			91482,
			1143571
		],
		types: [
		],
		aliases: [
			"International Dictionary of Intellectual Historians",
			"Dictionary of Intellectual Historians"
		]
	},
	{
		description: "personal identifier for artists in Czechia in Theatre Institute database (IDU)",
		datatype: "external-id",
		id: "P8385",
		label: "IDU person ID",
		example: [
			692,
			60585601
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for theatre names in Czechia in the Theatre Institute database",
		datatype: "external-id",
		id: "P7637",
		label: "IDU theatre company ID",
		example: [
			732697,
			11812447,
			7730881,
			46956562
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"IDU MainID"
		]
	},
	{
		description: "identifier for theatres (not theatre buildings) in Czechia in the Theatre Institute database",
		datatype: "external-id",
		id: "P8129",
		label: "IDU theatre name unique ID",
		example: [
			732697,
			11812447,
			7730881
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a commemorative monument or relevant structure in Catalonia in the Institut d'Estudis Catalans (IEC) [Institute for Catalan Studies] database",
		datatype: "external-id",
		id: "P6239",
		label: "IEC commemorative monument of Catalonia ID",
		example: [
			18004988,
			2288815
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Inventory of Existing Cosmetic Ingredients in China (2015)",
		datatype: "external-id",
		id: "P3978",
		label: "IECIC 2015 ID",
		example: [
			417164
		],
		types: [
			"related to chemistry"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an Epitope in the Immune Epitope Database",
		datatype: "external-id",
		id: "P4168",
		label: "IEDB Epitope ID",
		example: [
			576895
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author in IEEE Xplore",
		datatype: "external-id",
		id: "P6479",
		label: "IEEE Xplore author ID",
		example: [
			18632706,
			23890446,
			295981
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a document in IEEE Xplore",
		datatype: "external-id",
		id: "P6480",
		label: "IEEE Xplore document ID",
		example: [
			31056229,
			55895078,
			32061718
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of an IEEE standard",
		datatype: "external-id",
		id: "P5638",
		label: "IEEE standard",
		example: [
			181693,
			828287,
			1193354,
			570951
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a language per the Internet Engineering Task Force",
		datatype: "external-id",
		id: "P305",
		label: "IETF language tag",
		example: [
			7979
		],
		types: [
			"for items about languages"
		],
		aliases: [
			"language tag IETF",
			"BCP 47 language code",
			"language code"
		]
	},
	{
		description: "rating certificate of a film in the Irish content classification system",
		datatype: "wikibase-item",
		id: "P7573",
		label: "IFCO rating",
		example: [
			20992500,
			470560,
			6074
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on IFPI Austria music site",
		datatype: "external-id",
		id: "P6965",
		label: "IFPI Austria artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on IFPI Danmark music site",
		datatype: "external-id",
		id: "P6966",
		label: "IFPI Danmark artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on IFPI Norge music site",
		datatype: "external-id",
		id: "P6971",
		label: "IFPI Norge artist ID",
		example: [
			21808729,
			20028849,
			181484
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a species at the International Fossil Plant Names Index",
		datatype: "external-id",
		id: "P6341",
		label: "IFPNI species ID",
		example: [
			41216880,
			31200353,
			41008989
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a climber on the International Federation of Sport Climbing website",
		datatype: "external-id",
		id: "P3690",
		label: "IFSC climber ID",
		example: [
			451059,
			350568
		],
		types: [
			"related to sport"
		],
		aliases: [
		]
	},
	{
		description: "rating of a film or theatrical production in the Portuguese classification system",
		datatype: "wikibase-item",
		id: "P5150",
		label: "IGAC rating",
		example: [
			14616749
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the Internet Game Cars Database",
		datatype: "external-id",
		id: "P8018",
		label: "IGCD game ID",
		example: [
			82096008,
			8308676,
			1062256
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an entrant in the Independent Games Festival",
		datatype: "external-id",
		id: "P6032",
		label: "IGF entrant ID",
		example: [
			17985365,
			3320085,
			2025263,
			3016253
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an inductee on the International Gymnastics Hall of Fame website",
		datatype: "external-id",
		id: "P4469",
		label: "IGHOF athlete ID",
		example: [
			270400,
			1393175
		],
		types: [
		],
		aliases: [
			"International Gymnastics Hall of Fame athlete ID"
		]
	},
	{
		description: "identifier for television series on the IGN website",
		datatype: "external-id",
		id: "P5932",
		label: "IGN TV series ID",
		example: [
			23572,
			183513,
			180228
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for films at the IGN website",
		datatype: "external-id",
		id: "P5865",
		label: "IGN film ID",
		example: [
			83495,
			104814,
			163872
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "External identifier for video games at IGN",
		datatype: "external-id",
		id: "P5385",
		label: "IGN game ID",
		example: [
			54935246,
			10493813,
			26903145
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"IGN ID"
		]
	},
	{
		description: "identifier for a point of interest on the IGNrando' website",
		datatype: "external-id",
		id: "P7345",
		label: "IGNrando' ID",
		example: [
			2292418,
			3124528,
			2315401
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "cultural heritage identifier in the Inventario General del Patrimonio Cultural Valenciano",
		datatype: "external-id",
		id: "P2473",
		label: "IGPCV ID",
		example: [
			17621231,
			10836
		],
		types: [
		],
		aliases: [
			"IGPCV code"
		]
	},
	{
		description: "Identification number for items in the Hydrographic Dictionary S-32, issued by International Hydrographic Organization (IHO)",
		datatype: "external-id",
		id: "P2480",
		label: "IHO Hydrographic Dictionary (S-32) Number",
		example: [
			39715
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a work on the website of the Iconothèque historique de l'océan Indien",
		datatype: "external-id",
		id: "P6356",
		label: "IHOI work ID",
		example: [
			59773442,
			60443662,
			59773478
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an administrative territorial entity in Haiti",
		datatype: "external-id",
		id: "P1370",
		label: "IHSI ID",
		example: [
			2070394
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "JSON-LD formatted document URL reference described by the IIIF Presentation API",
		datatype: "url",
		id: "P6108",
		label: "IIIF manifest",
		example: [
			21627180,
			254923,
			4884677
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for the biographical dictionary of the  International Institute of Social History",
		datatype: "external-id",
		id: "P7646",
		label: "IISG ID",
		example: [
			2446622,
			62034983,
			40854631
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a judoka on the International Judo Federation website",
		datatype: "external-id",
		id: "P4559",
		label: "IJF judoka ID",
		example: [
			2975621,
			2261132
		],
		types: [
		],
		aliases: [
			"International Judo Federation ID",
			"IJF ID"
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P5063",
		label: "ILI ID",
		example: [
			144,
			1075651
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Interlingual Index ID"
		]
	},
	{
		description: "address of a multi-user chat or group",
		datatype: "string",
		id: "P8009",
		label: "IM channel",
		example: [
			58105,
			1431,
			285052
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a mineral per the International Mineralogical Association - Commission on New Minerals, Nomenclature and Classification (IMA-CNMNC)",
		datatype: "external-id",
		id: "P484",
		label: "IMA Number, broad sense",
		example: [
			318777
		],
		types: [
		],
		aliases: [
			"IMA approval year"
		]
	},
	{
		description: "identifier for a museum on the Irish Museums Association website",
		datatype: "external-id",
		id: "P5764",
		label: "IMA museum ID",
		example: [
			4750210,
			6070876,
			24901806
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "status given to each mineral by the IMA (International Mineralogical Association)",
		datatype: "wikibase-item",
		id: "P579",
		label: "IMA status and/or rank",
		example: [
			318777
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "rating in the Singaporean film and video game rating system",
		datatype: "wikibase-item",
		id: "P5201",
		label: "IMDA rating",
		example: [
			28532725
		],
		types: [
		],
		aliases: [
			"IMDA classification"
		]
	},
	{
		description: "identifier for the IMDb [with prefix 'tt', 'nm', 'co', 'ev', 'ch' or 'ni']",
		datatype: "external-id",
		id: "P345",
		label: "IMDb ID",
		example: [
			47703,
			762,
			3244512,
			242446,
			16773560,
			29512115
		],
		types: [
		],
		aliases: [
			"Internet Movie Database identifier",
			"IMDb identifier"
		]
	},
	{
		description: "identifier on the 'Institut mémoires de l'édition contemporaine's website",
		datatype: "external-id",
		id: "P5712",
		label: "IMEC ID",
		example: [
			20670130,
			295009,
			1110067
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for the Internet Movie Firearms Database",
		datatype: "external-id",
		id: "P6992",
		label: "IMFDB ID",
		example: [
			105598,
			486844,
			217261,
			62034895,
			176336
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in IMIS, database of Flanders Marine Institute",
		datatype: "external-id",
		id: "P3191",
		label: "IMIS person ID",
		example: [
			21340090
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a ship, ship owner or ship manager per the  International Maritime Organization",
		datatype: "external-id",
		id: "P458",
		label: "IMO ship number",
		example: [
			1244204,
			19364025
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier on the International Music Score Library Project",
		datatype: "external-id",
		id: "P839",
		label: "IMSLP ID",
		example: [
			324319,
			1339,
			1779888
		],
		types: [
		],
		aliases: [
			"IMSLP"
		]
	},
	{
		description: "identifier on the website Images de Montréal (imtl.org)",
		datatype: "external-id",
		id: "P6776",
		label: "IMTL.org ID",
		example: [
			40142432,
			3105346,
			17009835
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Images de Montréal ID"
		]
	},
	{
		description: "artist identifier for the IMVDb music video database",
		datatype: "external-id",
		id: "P6960",
		label: "IMVDb artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video on the INA website",
		datatype: "external-id",
		id: "P3194",
		label: "INA video ID",
		example: [
			3030174
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a geographical indication in Institut national de l'origine et de la qualité",
		datatype: "external-id",
		id: "P3895",
		label: "INAO product ID",
		example: [
			189221
		],
		types: [
		],
		aliases: [
			"INAO ID"
		]
	},
	{
		description: "rating of a movie in the Argentinian content rating system",
		datatype: "wikibase-item",
		id: "P3428",
		label: "INCAA film rating",
		example: [
			748851
		],
		types: [
		],
		aliases: [
			"CAEC film rating"
		]
	},
	{
		description: "uniform, nonproprietary, systematic name internationally recognized to identify a cosmetic ingredient",
		datatype: "string",
		id: "P4951",
		label: "INCI name",
		example: [
			412561
		],
		types: [
			"related to chemistry"
		],
		aliases: [
			"International Nomenclature of Cosmetic Ingredient"
		]
	},
	{
		description: "identifier for a character of the Disney Universe",
		datatype: "external-id",
		id: "P4479",
		label: "INDUCKS character ID",
		example: [
			6550,
			27269399,
			922567
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for creators and authors related to the Disney Universe",
		datatype: "external-id",
		id: "P4481",
		label: "INDUCKS creator ID",
		example: [
			11941,
			504704
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an issue of a printed publication of the Disney Universe",
		datatype: "external-id",
		id: "P4484",
		label: "INDUCKS issue ID",
		example: [
			1923825,
			5408856
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a miniseries of a printed publication of the Disney Universe",
		datatype: "external-id",
		id: "P4485",
		label: "INDUCKS miniseries ID",
		example: [
			3599448,
			3617432
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for printed publications of the Disney Universe",
		datatype: "external-id",
		id: "P4480",
		label: "INDUCKS publication ID",
		example: [
			1911687,
			1770842
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for publishers of printed publications related to the Disney Universe",
		datatype: "external-id",
		id: "P4482",
		label: "INDUCKS publisher ID",
		example: [
			2289818,
			3523275
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a comic book story related to the Disney Universe",
		datatype: "external-id",
		id: "P4483",
		label: "INDUCKS story ID",
		example: [
			4009205,
			4024510
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for Portuguese municipalities, districts and parishes, by the Portuguese National Statistical Institute (INE)",
		datatype: "external-id",
		id: "P6324",
		label: "INE ID (Portugal)",
		example: [
			597,
			210527,
			304139
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for Spanish municipalities, by the Spanish Statistical Office (INE)",
		datatype: "external-id",
		id: "P772",
		label: "INE municipality code",
		example: [
			277302,
			2917693,
			54955
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a locality of Mexico",
		datatype: "external-id",
		id: "P1976",
		label: "INEGI locality ID",
		example: [
			517463
		],
		types: [
		],
		aliases: [
			"INEGI locality identifier"
		]
	},
	{
		description: "identifier for a municipality in Mexico published by INEGI",
		datatype: "external-id",
		id: "P3801",
		label: "INEGI municipality ID",
		example: [
			391149,
			2994111
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "quantity",
		id: "P6069",
		label: "INEP IGC continuous score",
		example: [
			5397366,
			10279562,
			1317163
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "wikibase-item",
		id: "P6095",
		label: "INEP IGC discrete grade",
		example: [
			5397366,
			10279562,
			1317163
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID for cultural heritage in Rio de Janeiro, Brazil",
		datatype: "external-id",
		id: "P5549",
		label: "INEPAC ID",
		example: [
			337224,
			9761740
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Italian national nutriment database",
		datatype: "external-id",
		id: "P4729",
		label: "INRAN Italian Food ID",
		example: [
			147651
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "number sequence for identification of departmental arrondissements in France",
		datatype: "external-id",
		id: "P3423",
		label: "INSEE arrondissement code",
		example: [
			700647,
			702279
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "number sequence for the identification of canton in France",
		datatype: "external-id",
		id: "P2506",
		label: "INSEE canton code",
		example: [
			18129
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "French identifier for countries and foreign territories",
		datatype: "external-id",
		id: "P3422",
		label: "INSEE countries and foreign territories code",
		example: [
			222
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "number sequence for the identification of departments in France",
		datatype: "external-id",
		id: "P2586",
		label: "INSEE department code",
		example: [
			3349,
			18914778,
			3336,
			17012
		],
		types: [
		],
		aliases: [
			"code département Insee",
			"Insee département code"
		]
	},
	{
		description: "identifier with 5 digits or letters for a municipality or a municipal arrondissement in France, per the National Institute of Statistics and Economic Studies",
		datatype: "external-id",
		id: "P374",
		label: "INSEE municipality code",
		example: [
			191772
		],
		types: [
		],
		aliases: [
			"municipality code (France)"
		]
	},
	{
		description: "number sequence for the identification of regions in France",
		datatype: "external-id",
		id: "P2585",
		label: "INSEE region code",
		example: [
			12130,
			17054
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "universal identifier from Infrastructure for Spatial Information in the European Community (INSPIRE), used across EU databases",
		datatype: "external-id",
		id: "P4115",
		label: "INSPIRE ID",
		example: [
			16485959,
			9349157
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for authors in INSPIRE-HEP, a major database for high energy physics",
		datatype: "external-id",
		id: "P2930",
		label: "INSPIRE-HEP author ID",
		example: [
			983183,
			184592
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "three-letter abbreviation country code by the International Olympic Committee",
		datatype: "external-id",
		id: "P984",
		label: "IOC country code",
		example: [
			16641,
			38
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete by the International Orienteering Federation",
		datatype: "external-id",
		id: "P3672",
		label: "IOF athlete ID",
		example: [
			289480
		],
		types: [
		],
		aliases: [
			"International Orienteering Federation athlete ID"
		]
	},
	{
		description: "identifier which classifies and rates the degree of protection provided by mechanical casings and electrical enclosures against intrusion, dust, accidental contact, and water",
		datatype: "string",
		id: "P7315",
		label: "IP Code",
		example: [
			56599248,
			60021939,
			54621446
		],
		types: [
			"Wikidata qualifier"
		],
		aliases: [
			"International Protection Marking ID"
		]
	},
	{
		description: "representation of a IPA phoneme in the Braille system",
		datatype: "string",
		id: "P4225",
		label: "IPA Braille",
		example: [
			334695,
			334723
		],
		types: [
			"for romanization system"
		],
		aliases: [
		]
	},
	{
		description: "the IPA order number of an IPA phoneme",
		datatype: "quantity",
		id: "P3917",
		label: "IPA number order",
		example: [
			334695
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "transcription in the International Phonetic Alphabet",
		datatype: "string",
		id: "P898",
		label: "IPA transcription",
		example: [
			102090,
			20638126
		],
		types: [
			"with datatype string that is not an external identifier"
		],
		aliases: [
			"pronunciation (IPA)",
			"IPA"
		]
	},
	{
		description: "identifier for an athlete on ipc.infostradasports.com website",
		datatype: "external-id",
		id: "P4397",
		label: "IPC.infostradasports.com athlete ID",
		example: [
			41770363,
			2917073
		],
		types: [
		],
		aliases: [
			"International Paralympic Committee athlete numerical ID"
		]
	},
	{
		description: "The IPHAN identifier for a historic place or good",
		datatype: "external-id",
		id: "P5500",
		label: "IPHAN ID",
		example: [
			25439792,
			36240487,
			10300659
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "the international code for a legal entity or artist for copyright administration around Interested Parties Information",
		datatype: "external-id",
		id: "P3453",
		label: "IPI base code",
		example: [
			5593
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for the name of a composer, author and other relevant parties",
		datatype: "external-id",
		id: "P1828",
		label: "IPI name number",
		example: [
			15873,
			5593,
			383541
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Interested Parties Information Name Code",
			"IPI name code",
			"IPI code"
		]
	},
	{
		description: "numerical identifier for a person in the International Plant Names Index",
		datatype: "external-id",
		id: "P586",
		label: "IPNI author ID",
		example: [
			1043,
			1035
		],
		types: [
		],
		aliases: [
			"IPNI ID (author)"
		]
	},
	{
		description: "numerical identifier for a plant name in the International Plant Names Index",
		datatype: "external-id",
		id: "P961",
		label: "IPNI plant ID",
		example: [
			2938240
		],
		types: [
		],
		aliases: [
			"IPNI ID (plant)"
		]
	},
	{
		description: "identifier for a publication in the International Plant Names Index",
		datatype: "external-id",
		id: "P2008",
		label: "IPNI publication ID",
		example: [
			1388502
		],
		types: [
		],
		aliases: [
			"IPNI ID (publication)"
		]
	},
	{
		description: "identifier for archives and funds in the Institute of Public Policies in Human Rights (IPPDH) of Mercosur",
		datatype: "external-id",
		id: "P6281",
		label: "IPPDH ID",
		example: [
			1319177,
			6970429,
			59734073
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "NewsCode for an item, as defined by the International Press Telecommunications Council (IPTC)",
		datatype: "external-id",
		id: "P5429",
		label: "IPTC NewsCode",
		example: [
			23498,
			11633,
			1734,
			173799,
			16502
		],
		types: [
		],
		aliases: [
			"NewsCode"
		]
	},
	{
		description: "range of IPv4 addresses",
		datatype: "string",
		id: "P3761",
		label: "IPv4 routing prefix",
		example: [
			34433,
			246315
		],
		types: [
		],
		aliases: [
			"IPv4 range",
			"IPv4 CIDR",
			"CIDR",
			"routing prefix",
			"IPv4 subnetwork",
			"subnetwork"
		]
	},
	{
		description: "range of IPv6 addresses",
		datatype: "string",
		id: "P3793",
		label: "IPv6 routing prefix",
		example: [
			34433,
			2272849
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"IPv6 range",
			"IPv6 subnetwork",
			"IPv6 CIDR",
			"subnetwork",
			"routing prefix",
			"CIDR"
		]
	},
	{
		description: "official IRC channel of an institution or project",
		datatype: "url",
		id: "P1613",
		label: "IRC channel",
		example: [
			2013,
			53464
		],
		types: [
		],
		aliases: [
			"IRC chan"
		]
	},
	{
		description: "identifier of a scientific name, in the Interim Register of Marine and Nonmarine Genera (IRMNG) database",
		datatype: "external-id",
		id: "P5055",
		label: "IRMNG ID",
		example: [
			2665200,
			233024
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "number given to businesses by the United States Internal Revenue Service",
		datatype: "external-id",
		id: "P1297",
		label: "IRS Employer Identification Number",
		example: [
			95,
			35476,
			312,
			2283
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"FEIN",
			"US EIN",
			"IRS EIN",
			"EIN",
			"IRS Employer ID",
			"tax ID number",
			"tax ID no."
		]
	},
	{
		description: "identifier for Brazilian indigenous populations from Instituto Socioambiental",
		datatype: "external-id",
		id: "P6468",
		label: "ISA ID",
		example: [
			3621312,
			2932811,
			2261479
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "unique identifier for audiovisual works and related versions, similar to ISBN for books",
		datatype: "external-id",
		id: "P3212",
		label: "ISAN",
		example: [
			23817747
		],
		types: [
		],
		aliases: [
			"International Standard Audiovisual Number",
			"ISAN identifier"
		]
	},
	{
		description: "ISBN prefix for countries or languages",
		datatype: "external-id",
		id: "P3097",
		label: "ISBN identifier group",
		example: [
			1860,
			40,
			34
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "part of an ISBN(-13) specific to a publisher",
		datatype: "external-id",
		id: "P3035",
		label: "ISBN publisher prefix",
		example: [
			7437604,
			217595
		],
		types: [
		],
		aliases: [
			"ISBN prefix",
			"ISBN root"
		]
	},
	{
		description: "former identifier for a book (edition), ten digits. Used for all publications up to 2006 (convertible to ISBN-13 for some online catalogs; useful for old books or fac-similes not reedited since 2007)",
		datatype: "external-id",
		id: "P957",
		label: "ISBN-10",
		example: [
			14422206,
			14422206
		],
		types: [
		],
		aliases: [
			"isbn-10",
			"International Standard Book Number-10",
			"isbn",
			"ISBN10"
		]
	},
	{
		description: "identifier for a book (edition), thirteen digit",
		datatype: "external-id",
		id: "P212",
		label: "ISBN-13",
		example: [
			22137041,
			63888904
		],
		types: [
			"multi-source external identifier"
		],
		aliases: [
			"isbn-13",
			"International Standard Book Number-13",
			"Bookland",
			"isbn",
			"ISBN-13",
			"ISBN13"
		]
	},
	{
		description: "entry in the International Seismological Centre Online Event Bibliography",
		datatype: "external-id",
		id: "P5092",
		label: "ISC event ID",
		example: [
			211386
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "International Standard Classification of Occupations code according to the International Labour Organization (ILO) classification structure as of 2008",
		datatype: "string",
		id: "P8283",
		label: "ISCO-08 occupation code",
		example: [
			214917,
			328325,
			1124183
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "International Standard Classification of Occupations code according to the International Labour Organization (ILO) classification structure as of 1988",
		datatype: "string",
		id: "P952",
		label: "ISCO-88 occupation code",
		example: [
			214917,
			328325,
			1124183
		],
		types: [
		],
		aliases: [
			"CITP",
			"International Standard Classification of Occupations"
		]
	},
	{
		description: "identifier for an edition of a publication in the Internet Speculative Fiction Database",
		datatype: "external-id",
		id: "P1234",
		label: "ISFDB publication ID",
		example: [
			15968117
		],
		types: [
		],
		aliases: [
			"Internet Speculative Fiction Database publication ID"
		]
	},
	{
		description: "identifier for a publisher in the Internet Speculative Fiction Database",
		datatype: "external-id",
		id: "P1239",
		label: "ISFDB publisher ID",
		example: [
			536795
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a series, periodical or franchise in the Internet Speculative Fiction Database",
		datatype: "external-id",
		id: "P1235",
		label: "ISFDB series ID",
		example: [
			1136124,
			991271,
			1213577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a title in the Internet Speculative Fiction Database",
		datatype: "external-id",
		id: "P1274",
		label: "ISFDB title ID",
		example: [
			4134557,
			36097
		],
		types: [
		],
		aliases: [
			"Internet Speculative Fiction Database title ID"
		]
	},
	{
		description: "identifier for a library or related organization",
		datatype: "external-id",
		id: "P791",
		label: "ISIL",
		example: [
			131454,
			1048694
		],
		types: [
			"multi-source external identifier"
		],
		aliases: [
			"ISIL",
			"International Standard Identifier for Libraries and Related Organizations"
		]
	},
	{
		description: "identifier for a security",
		datatype: "external-id",
		id: "P946",
		label: "ISIN",
		example: [
			3339028,
			2311
		],
		types: [
			"multi-source external identifier"
		],
		aliases: [
			"International Securities Identification Number"
		]
	},
	{
		description: "International Standard Music Number",
		datatype: "external-id",
		id: "P1208",
		label: "ISMN",
		example: [
			15901614
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "International Standard Name Identifier for an identity. Format: 4 blocks of 4 digits separated by a space, first block is 0000",
		datatype: "external-id",
		id: "P213",
		label: "ISNI",
		example: [
			20,
			1413,
			248,
			2306,
			57188,
			6966447
		],
		types: [
		],
		aliases: [
			"ISO 27729",
			"International Standard Name Identifier"
		]
	},
	{
		description: "representation according to the named ISO standard for transliterating Brahmic scripts",
		datatype: "string",
		label: "ISO 15919 transliteration",
		id: "P5825",
		types: [
			"for romanization system"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a writing system",
		datatype: "external-id",
		id: "P506",
		label: "ISO 15924 alpha-4 code",
		example: [
			8222,
			8216
		],
		types: [
		],
		aliases: [
			"ISO 15924"
		]
	},
	{
		description: "numeric code for a writing system in ISO 15924",
		datatype: "external-id",
		id: "P2620",
		label: "ISO 15924 numeric code",
		example: [
			8222
		],
		types: [
		],
		aliases: [
			"ISO 15924 numeric ID"
		]
	},
	{
		description: "identifier for a country in two-letter format per ISO 3166-1",
		datatype: "external-id",
		id: "P297",
		label: "ISO 3166-1 alpha-2 code",
		example: [
			159,
			145,
			131008,
			131008,
			35555,
			25228,
			1450765,
			1450765
		],
		types: [
		],
		aliases: [
			"country code ISO 3166-1 alpha-2",
			"two letter code"
		]
	},
	{
		description: "identifier for a country in three-letter format per ISO 3166-1",
		datatype: "external-id",
		id: "P298",
		label: "ISO 3166-1 alpha-3 code",
		example: [
			159,
			183
		],
		types: [
		],
		aliases: [
			"country code ISO 3166-1 alpha-3"
		]
	},
	{
		description: "identifier for a country in numeric format per ISO 3166-1",
		datatype: "external-id",
		id: "P299",
		label: "ISO 3166-1 numeric code",
		example: [
			664
		],
		types: [
		],
		aliases: [
			"country code ISO 3166-1 numeric",
			"ISO 3166-1"
		]
	},
	{
		description: "identifier for a country subdivision per ISO 3166-2 (include country code)",
		datatype: "external-id",
		id: "P300",
		label: "ISO 3166-2 code",
		example: [
			41967,
			173,
			1113
		],
		types: [
		],
		aliases: [
			"subdivision code ISO 3166-2"
		]
	},
	{
		description: "identifier for a country name that has been deleted from ISO 3166-1 since its first publication in 1974",
		datatype: "external-id",
		id: "P773",
		label: "ISO 3166-3",
		example: [
			33946
		],
		types: [
		],
		aliases: [
			"Code for formerly used names of countries"
		]
	},
	{
		description: "identifier for a tooth per ISO 3950",
		datatype: "external-id",
		id: "P5209",
		label: "ISO 3950 code",
		example: [
			53831722,
			53831678,
			53831748,
			53831816,
			53831762,
			53831707,
			53831683,
			53831809,
			53831715,
			53831791,
			53831769,
			53831701,
			53831724,
			53831822,
			53831728,
			53831675,
			53831819,
			53831788,
			53831806,
			53831666,
			53831794,
			53831686,
			53831836,
			53831689,
			53831694,
			53831737,
			53831732,
			53831776,
			53831719,
			53831765,
			53831759,
			53831798,
			53831744,
			53831705,
			53831754,
			53831672,
			53831661,
			53831741,
			53831712,
			53831832,
			53831685,
			53831828,
			53831735,
			53831774,
			53831692,
			53831698,
			53831750,
			53831784,
			53831803,
			53831780,
			53831813,
			53831826
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "standard abbreviation for periodicals in the International Organization for Standardization system",
		datatype: "external-id",
		id: "P1160",
		label: "ISO 4 abbreviation",
		example: [
			752075,
			898902,
			180445
		],
		types: [
		],
		aliases: [
			"ISO4",
			"journal abbreviation",
			"abbreviation (ISO 4)"
		]
	},
	{
		description: "identifier for a process, in the ISO-approved classification scheme for welding & soldering processes",
		datatype: "external-id",
		id: "P2766",
		label: "ISO 4063 process number",
		example: [
			1992360
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a currency per ISO 4217",
		datatype: "external-id",
		id: "P498",
		label: "ISO 4217 code",
		example: [
			4917
		],
		types: [
		],
		aliases: [
			"ISO 4217"
		]
	},
	{
		description: "two-letter identifier for a language or family of languages defined in ISO 639-1 standard",
		datatype: "external-id",
		id: "P218",
		label: "ISO 639-1 code",
		example: [
			5287
		],
		types: [
			"representing a unique identifier",
			"for items about languages"
		],
		aliases: [
			"iso 639-1",
			"ISO639-1",
			"iso639-1"
		]
	},
	{
		description: "identifier for a language or macrolanguage or language family language, defined in ISO 639-2 standard, 3-letter technical or bibliographical  code",
		datatype: "external-id",
		id: "P219",
		label: "ISO 639-2 code",
		example: [
			5287
		],
		types: [
			"representing a unique identifier",
			"for items about languages"
		],
		aliases: [
			"iso 639-2",
			"ISO639-2",
			"iso639-2"
		]
	},
	{
		description: "Identifier for requested changes to ISO 639-3 language codes. Identifier is issued by the ISO 639-3 registration authority.",
		datatype: "external-id",
		id: "P6519",
		label: "ISO 639-3 Change Request ID",
		example: [
			61639834,
			61686517
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a language defined in ISO 639-3",
		datatype: "external-id",
		id: "P220",
		label: "ISO 639-3 code",
		example: [
			5287,
			8798
		],
		types: [
			"representing a unique identifier",
			"for items about languages"
		],
		aliases: [
			"iso 639-3"
		]
	},
	{
		description: "identifier for a language family per ISO 639-5",
		datatype: "external-id",
		id: "P1798",
		label: "ISO 639-5 code",
		example: [
			9129,
			721612
		],
		types: [
			"representing a unique identifier",
			"for items about languages"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a language per ISO 639-6",
		datatype: "external-id",
		id: "P221",
		label: "ISO 639-6 code",
		example: [
			9186
		],
		types: [
			"representing a unique identifier",
			"for items about languages"
		],
		aliases: [
			"ISO 639-6",
			"ISO639-6"
		]
	},
	{
		description: "Identifier ISO 9362 SWIFT/BIC code",
		datatype: "external-id",
		id: "P2627",
		label: "ISO 9362 SWIFT/BIC code",
		example: [
			66048
		],
		types: [
		],
		aliases: [
			"ISO 9362",
			"SWIFT code",
			"BIC code",
			"Business Identifier Codes",
			"SWIFT-BIC",
			"SWIFT ID",
			"Business Entity Identifier",
			"BEI",
			"SWIFT -code"
		]
	},
	{
		description: "the Latin transliteration of Cyrillic text (used as qualifier)",
		datatype: "string",
		id: "P2183",
		label: "ISO 9:1995",
		example: [
			7315
		],
		types: [
			"Wikidata qualifier",
			"with datatype string that is not an external identifier",
			"for romanization system"
		],
		aliases: [
			"ISO 9"
		]
	},
	{
		description: "light sensitivity of film or digital sensor (e.g. ISO/ASA 100)",
		datatype: "quantity",
		id: "P6789",
		label: "ISO speed",
		example: [
			34788400,
			64518538
		],
		types: [
		],
		aliases: [
			"ISO speed rating",
			"ASA speed",
			"ISO/ASA"
		]
	},
	{
		description: "number of the ISO standard which normalizes the object",
		datatype: "external-id",
		id: "P503",
		label: "ISO standard",
		example: [
			206008,
			852641,
			50101
		],
		types: [
		],
		aliases: [
			"ISO"
		]
	},
	{
		description: "numeric ID from the Data Category Registry",
		datatype: "string",
		id: "P2263",
		label: "ISOCAT id",
		example: [
			34698,
			5292
		],
		types: [
		],
		aliases: [
			"ISO 12620 ID"
		]
	},
	{
		description: "property of an observable physical quantity being a product of the SI base dimensions (length, mass, time, etc.)",
		datatype: "math",
		id: "P4020",
		label: "ISQ dimension",
		example: [
			48103,
			45003
		],
		types: [
		],
		aliases: [
			"observable dimension",
			"dimension",
			"dimension of a derived quantity"
		]
	},
	{
		description: "international standard code for uniquely identifying sound recordings and music video recordings",
		datatype: "external-id",
		id: "P1243",
		label: "ISRC",
		example: [
			5379488
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"International Standard Recording Code"
		]
	},
	{
		description: "identifier for an athlete in the International Shooting Sport Federation database",
		datatype: "external-id",
		id: "P2730",
		label: "ISSF athlete ID",
		example: [
			6290155
		],
		types: [
		],
		aliases: [
			"ISSF ID"
		]
	},
	{
		description: "International Standard Serial Number (print or electronic)",
		datatype: "external-id",
		id: "P236",
		label: "ISSN",
		example: [
			11148,
			180445,
			64692267
		],
		types: [
		],
		aliases: [
			"International Standard Serial Number",
			"ISO 3297",
			"E-ISSN"
		]
	},
	{
		description: "linking ISSN (ISSN-L) is a specific ISSN that groups the different media of the same serial publication",
		datatype: "external-id",
		id: "P7363",
		label: "ISSN-L",
		example: [
			15749320,
			5215191
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for municipalities in Italy",
		datatype: "external-id",
		id: "P635",
		label: "ISTAT ID",
		example: [
			220,
			490
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "number or ID in the Incunabula Short Title Catalogue",
		datatype: "external-id",
		id: "P6494",
		label: "ISTC No.",
		example: [
			158075,
			4031020,
			61525233
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a figure skater in the International Skating Union database",
		datatype: "external-id",
		id: "P2694",
		label: "ISU figure skater ID",
		example: [
			316861,
			4344606,
			5616031
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for musical works, adopted as international standard ISO 15707",
		datatype: "external-id",
		id: "P1827",
		label: "ISWC",
		example: [
			11985,
			103
		],
		types: [
		],
		aliases: [
			"ISWC Code",
			"International Standard Musical Work Code"
		]
	},
	{
		description: "identifier of a company in the ISzDb (a Hungarian dub database)",
		datatype: "external-id",
		id: "P3115",
		label: "ISzDb company ID",
		example: [
			1097348
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a dub version for a film in the ISzDb (a Hungarian dub database)",
		datatype: "external-id",
		id: "P3116",
		label: "ISzDb dub ID",
		example: [
			26265744
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a film in the ISzDb (a Hungarian dub database)",
		datatype: "external-id",
		id: "P3110",
		label: "ISzDb film ID",
		example: [
			181795
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person in the ISzDb (a Hungarian dub database)",
		datatype: "external-id",
		id: "P3114",
		label: "ISzDb person ID",
		example: [
			81328,
			40715
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a tennis player at the International Tennis Federation (ITF) website",
		datatype: "external-id",
		id: "P599",
		label: "ITF player ID",
		example: [
			11459,
			5812,
			192801,
			64009638,
			19602969
		],
		types: [
		],
		aliases: [
			"ITF Junior ID",
			"ITF ID"
		]
	},
	{
		description: "identifier for a tennis player at the International Tennis Federation (ITF) website as of 2020",
		datatype: "external-id",
		id: "P8618",
		label: "ITF player ID 2020",
		example: [
			11662,
			105550,
			239751,
			274441
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a tennis tournament edition in the International Tennis Federation database",
		datatype: "external-id",
		id: "P6841",
		label: "ITF tournament ID",
		example: [
			3649887,
			3853375,
			3857838
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a wheelchair tennis player on the International Tennis Federation website",
		datatype: "external-id",
		id: "P4299",
		label: "ITF wheelchair player ID",
		example: [
			959958,
			19390609
		],
		types: [
		],
		aliases: [
			"Wheelchair ITF player ID"
		]
	},
	{
		description: "identifier for a taxon in the Integrated Taxonomic Information System",
		datatype: "external-id",
		id: "P815",
		label: "ITIS TSN",
		example: [
			318090,
			723654
		],
		types: [
		],
		aliases: [
			"itis",
			"Integrated Taxonomic Information System Taxonomic Serial Number"
		]
	},
	{
		description: "identifier for a runner on the International Trail-Running Association's website",
		datatype: "external-id",
		id: "P3584",
		label: "ITRA runner ID",
		example: [
			20727709,
			20741639
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "6-digit identifier for a table tennis player as per International Table Tennis Federation (ITTF)",
		datatype: "external-id",
		id: "P1364",
		label: "ITTF table tennis player ID",
		example: [
			2520617,
			443175
		],
		types: [
		],
		aliases: [
			"ITTF Player_ID",
			"International Table Tennis Federation ID",
			"ITTF ID"
		]
	},
	{
		description: "identifier for member countries of the  International Telecommunication Union radiocommunication division",
		datatype: "external-id",
		id: "P3024",
		label: "ITU letter code",
		example: [
			40,
			34
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a triathlete on the International Triathlon Union's website",
		datatype: "external-id",
		id: "P3604",
		label: "ITU triathlete ID",
		example: [
			1370146,
			1174690
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an ITU-R Recommendation",
		datatype: "external-id",
		id: "P5686",
		label: "ITU-R Recommendation",
		example: [
			375976,
			3632269,
			26711370,
			26689604
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of an ITU-T Recommendation",
		datatype: "external-id",
		id: "P5688",
		label: "ITU-T Recommendation",
		example: [
			952898,
			26902004,
			27051333,
			1065865
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "unique global identifier standardized by the ITU and ISO/IEC for naming any object, concept, or thing",
		datatype: "external-id",
		id: "P3743",
		label: "ITU/ISO/IEC object identifier",
		example: [
			248,
			14944328,
			42253
		],
		types: [
		],
		aliases: [
			"ITU object identifier",
			"ISO object identifier",
			"IEC object identifier",
			"ITU/ISO/IEC OID",
			"ITU OID",
			"ISO OID",
			"IEC OID",
			"object identifier",
			"OID",
			"urn:oid:"
		]
	},
	{
		description: "conservation status assigned by the International Union for Conservation of Nature",
		datatype: "wikibase-item",
		id: "P141",
		label: "IUCN conservation status",
		example: [
			42196,
			208549,
			2857311,
			506308,
			207906,
			43502,
			18766
		],
		types: [
			"for a taxon"
		],
		aliases: [
			"conservation status"
		]
	},
	{
		description: "protected areas category by the World Commission on Protected Areas. Used with dedicated items for each category.",
		datatype: "wikibase-item",
		id: "P814",
		label: "IUCN protected areas category",
		example: [
			3364718
		],
		types: [
			"for places"
		],
		aliases: [
			"IUCN Management Category",
			"IUCN category"
		]
	},
	{
		description: "identifier for a taxon in the International Union for Conservation of Nature database; source for conservation status (P141)",
		datatype: "string",
		id: "P627",
		label: "IUCN taxon ID",
		example: [
			310639,
			4754
		],
		types: [
		],
		aliases: [
			"IUCN Red List ID"
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P5320",
		label: "IUF member ID",
		example: [
			1096766,
			981947
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of definition in ''Compendium of Chemical Terminology'' (''IUPAC GoldBook'')",
		datatype: "external-id",
		id: "P4732",
		label: "IUPAC Gold Book ID",
		example: [
			2272566,
			156
		],
		types: [
			"related to chemistry",
			"representing a unique identifier"
		],
		aliases: [
			"GoldBook ID",
			"IUPAC GoldBook ID"
		]
	},
	{
		description: "identifier of objects and ways in the Inventory of historical ways Switzerland (IVS)",
		datatype: "external-id",
		id: "P8475",
		label: "IVS ID",
		example: [
			8987970,
			96098670
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of an athlete by International Weightlifting Federation",
		datatype: "external-id",
		id: "P3667",
		label: "IWF athlete ID",
		example: [
			257843,
			3218304
		],
		types: [
		],
		aliases: [
			"IWF ID",
			"International Weightlifting Federation ID"
		]
	},
	{
		description: "identifier for a war memorial, in the UK Imperial War Museum's War Memorials Register",
		datatype: "external-id",
		id: "P3038",
		label: "IWM memorial ID",
		example: [
			26162445
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete on the International Weightlifting Results Project website",
		datatype: "external-id",
		id: "P4504",
		label: "IWRP athlete ID",
		example: [
			5090884,
			26695601
		],
		types: [
		],
		aliases: [
			"International Weightlifting Results Project athlete ID"
		]
	},
	{
		description: "Iconclass code that corresponds with an artistic theme or concept. For artworks, use P1257 (depicts Iconclass notation)",
		datatype: "external-id",
		id: "P1256",
		label: "Iconclass notation",
		example: [
			1934482
		],
		types: [
			"for items about works"
		],
		aliases: [
			"Iconclass ID (of concept)",
			"Iconclass code"
		]
	},
	{
		description: "identifier for authority control in the French collaborative library catalog (see also P1025). Format: 8 digits followed by a digit or \"X\"",
		datatype: "external-id",
		id: "P269",
		label: "IdRef ID",
		example: [
			535,
			212,
			154571
		],
		types: [
		],
		aliases: [
			"IdRef",
			"Système Universitaire de Documentation authorities ID",
			"SUDOC authority ID",
			"SUDOC authorities ID",
			"SUDOC"
		]
	},
	{
		description: "Identification code for universities and colleges in Japan. This code is defined in Japanese Industrial Standards.",
		datatype: "external-id",
		id: "P7251",
		label: "Identification code for Japanese universities and colleges",
		example: [
			7842,
			7700640,
			11441055
		],
		types: [
			"for items about organizations"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a resource held by the Smithsonian Institution",
		datatype: "external-id",
		id: "P7851",
		label: "Identifier for a resource held by the Smithsonian Institution",
		example: [
			152400,
			17019548,
			725856
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a musher on the Iditarod Trail Sled Dog Race website",
		datatype: "external-id",
		id: "P3760",
		label: "Iditarod musher ID",
		example: [
			18601944,
			96215
		],
		types: [
		],
		aliases: [
			"Iditarod Trail Sled Dog Race musher ID"
		]
	},
	{
		description: "identifier for a video game at the website Igromania.ru",
		datatype: "external-id",
		id: "P6827",
		label: "Igromania ID",
		example: [
			27950674,
			24666782,
			42564798,
			18345138
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Igromania.ru ID"
		]
	},
	{
		description: "identifier for on the website of Il Sole 24 Ore newspaper",
		datatype: "external-id",
		id: "P8136",
		label: "Il Sole 24 Ore ID",
		example: [
			305718,
			2254049,
			3368176
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a creative work or person at Il mondo dei doppiatori",
		datatype: "external-id",
		id: "P5099",
		label: "Il mondo dei doppiatori ID",
		example: [
			36479,
			309248,
			554393,
			117396
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Mondo dei doppiatori ID",
			"Mondo doppiatori ID"
		]
	},
	{
		description: "identifier for a species in the Illustrated catalog of Tessaratomidae",
		datatype: "external-id",
		id: "P6487",
		label: "Illustrated catalog of Tessaratomidae species ID",
		example: [
			10631605,
			18232155,
			18658306
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "link to the online database (Bildkatalog) of the image archive for the display of image sources",
		datatype: "external-id",
		id: "P6482",
		label: "Image Archive, Herder Institute",
		example: [
			53454,
			155743,
			1792
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on Image-Line site",
		datatype: "external-id",
		id: "P7186",
		label: "Image-Line artist ID",
		example: [
			383541,
			349041,
			14544318
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork or other object on the Images d'Art website",
		datatype: "external-id",
		id: "P4761",
		label: "Images d'Art artwork ID",
		example: [
			47088175,
			44848921
		],
		types: [
		],
		aliases: [
			"RMN images d'art",
			"images d'art id",
			"réunion des musées nationaux images d'art"
		]
	},
	{
		description: "International Chemical Identifier",
		datatype: "external-id",
		id: "P234",
		label: "InChI",
		example: [
			2270,
			411208
		],
		types: [
			"related to chemistry"
		],
		aliases: [
			"International Chemical Identifier"
		]
	},
	{
		description: "A hashed version of the full standard InChI - designed to create an identifier that encodes structural information and can also be practically used in web searching.",
		datatype: "external-id",
		id: "P235",
		label: "InChIKey",
		example: [
			897,
			153
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Indiana Philosophy Ontology project",
		datatype: "external-id",
		id: "P863",
		label: "InPhO ID",
		example: [
			219368,
			242028
		],
		types: [
		],
		aliases: [
			"Indiana Philosophy Ontology identifier"
		]
	},
	{
		description: "identifier for a wildfire in the InciWeb database",
		datatype: "external-id",
		id: "P8582",
		label: "InciWeb ID",
		example: [
			98821894,
			96619152,
			96418877
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a fungus taxon in Index Fungorum",
		datatype: "external-id",
		id: "P1391",
		label: "Index Fungorum ID",
		example: [
			24264063,
			390456,
			311527
		],
		types: [
		],
		aliases: [
			"Fungorum ID"
		]
	},
	{
		description: "identifier in the Index Hepaticarum, a nomenclatural database",
		datatype: "external-id",
		id: "P2794",
		label: "Index Hepaticarum ID",
		example: [
			21875939,
			22809351
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "code in Index Herbariorum for plant collections",
		datatype: "external-id",
		id: "P5858",
		label: "Index Herbariorum code",
		example: [
			56556081,
			56486967,
			56486965
		],
		types: [
		],
		aliases: [
			"herbarium code",
			"herbarium abbreviation"
		]
	},
	{
		description: "identifier for a person or an organization in the Index of Historic Collectors and Dealers of Cubism database",
		datatype: "external-id",
		id: "P5921",
		label: "Index of Historic Collectors and Dealers of Cubism ID",
		example: [
			241599,
			459041,
			56099147
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in Index to American Botanical Literature",
		datatype: "external-id",
		id: "P6626",
		label: "Index to American Botanical Literature ID",
		example: [
			62065367,
			62065326,
			62065380
		],
		types: [
		],
		aliases: [
			"IABL ID"
		]
	},
	{
		description: "identifier for species found in India maintained by the 'India Biodiversity Portal' database",
		datatype: "external-id",
		id: "P7537",
		label: "India Biodiversity Portal species ID",
		example: [
			2715878,
			13477570,
			180360
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a bank branch participating in either of the two main Payment and settlement systems in India",
		datatype: "external-id",
		id: "P4635",
		label: "Indian Financial System Code",
		example: [
			42798064,
			42843900,
			42843900
		],
		types: [
		],
		aliases: [
			"IFS Code",
			"IFSC"
		]
	},
	{
		description: "identifier from Indian organization of butterfly biologists working on the conservation of butterflies of India. They maintain an internet-based and peer-reviewed resource devoted to Indian butterflies.",
		datatype: "external-id",
		id: "P4433",
		label: "Indian Foundation for Butterflies ID",
		example: [
			714585
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for medicinal plants found in India maintained by the 'Indian Medicinal Plants Database'",
		datatype: "external-id",
		id: "P7544",
		label: "Indian Medicinal Plants Database ID",
		example: [
			3337223,
			984120,
			50881250
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "code to identify a railway station operated by Indian Railways (this should NOT be used on items for metro stations; use P296 in those instances)",
		datatype: "external-id",
		id: "P5696",
		label: "Indian Railways station code",
		example: [
			986105,
			5529666,
			15643961,
			16971508,
			25549176,
			7285050
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a train service in a particular direction operated on the Indian rail network",
		datatype: "external-id",
		id: "P8180",
		label: "Indian Railways train number",
		example: [
			12413177,
			12413178,
			12415389
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "external Identifiers for players participating in Indian Super League",
		datatype: "external-id",
		id: "P7053",
		label: "Indian Super League player ID",
		example: [
			561004,
			1354055,
			202632
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "code used for an area for calculations in the 1991 census of India",
		datatype: "external-id",
		id: "P6503",
		label: "Indian census area code (1991)",
		example: [
			1356,
			1546240,
			5434787,
			60435727,
			1265617
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "code used for an area for calculations in the 2001 census of India",
		datatype: "external-id",
		id: "P3213",
		label: "Indian census area code (2001)",
		example: [
			1165,
			43086,
			12433979,
			12436675
		],
		types: [
		],
		aliases: [
			"PLCN code",
			"Census 2001 Code"
		]
	},
	{
		description: "code used for an area for calculations in the 2011 census of India",
		datatype: "external-id",
		id: "P5578",
		label: "Indian census area code (2011)",
		example: [
			1165,
			43086,
			12433979,
			12436675,
			712504
		],
		types: [
		],
		aliases: [
			"MDDS code",
			"Village code",
			"Census 2011 Code"
		]
	},
	{
		description: "recipients of Indian gallantry awards",
		datatype: "external-id",
		id: "P6919",
		label: "Indian gallantry awardee ID",
		example: [
			3595115,
			6368246,
			3595309
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete on the Indiana Basketball Hall of Fame website",
		datatype: "external-id",
		id: "P4557",
		label: "Indiana Basketball Hall of Fame ID",
		example: [
			20707812,
			3701737
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork or other object on the Indianapolis Museum of Art collection website",
		datatype: "external-id",
		id: "P4674",
		label: "Indianapolis Museum of Art artwork ID",
		example: [
			924482,
			27897804
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film (movie) in the Indiancine.ma archive of Indian film",
		datatype: "external-id",
		id: "P5987",
		label: "Indiancine.ma film ID",
		example: [
			622380,
			1280536,
			55633075
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person, in the Indiancine.ma archive of Indian film",
		datatype: "external-id",
		id: "P5989",
		label: "Indiancine.ma person ID",
		example: [
			55408,
			8873,
			1968297
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of public administrations in Italy",
		datatype: "external-id",
		id: "P6832",
		label: "IndicePA ID",
		example: [
			43049,
			220,
			490
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game on indiedb.com",
		datatype: "external-id",
		id: "P6717",
		label: "Indie DB video game ID",
		example: [
			61613573,
			23783496,
			14558333,
			23013817
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"IndieDB game ID"
		]
	},
	{
		description: "identifier for a project on the Indiegogo crowdfunding platform",
		datatype: "external-id",
		id: "P7953",
		label: "Indiegogo project ID",
		example: [
			766633,
			21450518,
			63226016
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a Indonesian cultural heritage in Cultural Heritage National Registration System",
		datatype: "external-id",
		id: "P6566",
		label: "Indonesian Cultural Heritage Registration System ID",
		example: [
			12506392,
			26487379,
			4887051,
			2725535,
			962410
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for DPKI directory of small islands by the Indonesian government",
		datatype: "external-id",
		id: "P4227",
		label: "Indonesian Small Islands Directory ID",
		example: [
			2690002,
			25017816,
			22706701
		],
		types: [
		],
		aliases: [
			"Direktori Pulau-Pulau Kecil Indonesia ID",
			"DPKI ID",
			"DPKI"
		]
	},
	{
		description: "code for ethnic groups in Indonesia, defined in Ensiklopedi Suku Bangsa di Indonesia",
		datatype: "external-id",
		id: "P3034",
		label: "Indonesian ethnicity code",
		example: [
			340520
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ethnicity code (Indonesia)"
		]
	},
	{
		description: "registration number of  intangible cultural heritage in Indonesia",
		datatype: "external-id",
		id: "P8325",
		label: "Indonesian intangible cultural heritage",
		example: [
			2367252,
			17998767
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Indonesian prison database",
		datatype: "external-id",
		id: "P8668",
		label: "Indonesian prison database ID",
		example: [
			4712525,
			5121278
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of a Roman politician in the Infames Romani database",
		datatype: "external-id",
		id: "P8175",
		label: "Infames Romani ID",
		example: [
			723447,
			1471360,
			355544
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon on the Info Flora website",
		datatype: "external-id",
		id: "P6098",
		label: "Info Flora ID",
		example: [
			19607777,
			254655,
			26297
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a horse on the official French Infochevaux database",
		datatype: "external-id",
		id: "P3169",
		label: "Infochevaux ID",
		example: [
			22318003
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier for artists in the Information Center for Israeli Art",
		datatype: "external-id",
		id: "P1736",
		label: "Information Center for Israeli Art artist ID",
		example: [
			3125265
		],
		types: [
		],
		aliases: [
			"Information Center for Israeli Art artist identifier",
			"Information Center for Israeli Art artist ID",
			"ICIA ID",
			"Israel Museum artist ID"
		]
	},
	{
		description: "identifier assigned to an artwork by the Information Center for Israeli Art",
		datatype: "external-id",
		id: "P5223",
		label: "Information Center for Israeli Art artwork ID",
		example: [
			54478299
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Inguma database researcher link",
		datatype: "external-id",
		id: "P7558",
		label: "Inguma database ID",
		example: [
			39288674,
			16517758,
			3187789
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon in the Insects (Insecta) of the World database",
		datatype: "external-id",
		id: "P7224",
		label: "Insects (Insecta) of the World ID",
		example: [
			527496,
			22651,
			311221
		],
		types: [
		],
		aliases: [
			"insecta.pro ID"
		]
	},
	{
		description: "identifier for a location on Instagram",
		datatype: "external-id",
		id: "P4173",
		label: "Instagram location ID",
		example: [
			6360620,
			35410829
		],
		types: [
		],
		aliases: [
			"IG location ID"
		]
	},
	{
		description: "item's username on Instagram",
		datatype: "external-id",
		id: "P2003",
		label: "Instagram username",
		example: [
			23548,
			83287,
			383541,
			9543
		],
		types: [
			"for items about people"
		],
		aliases: [
			"IG account",
			"IG username"
		]
	},
	{
		description: "identifier for a writer on the Institut culturel de Bretagne website",
		datatype: "external-id",
		id: "P5561",
		label: "Institut culturel de Bretagne ID",
		example: [
			2892999,
			2452369,
			3335188
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork in the collections of the Instituto Moreira Salles",
		datatype: "external-id",
		id: "P7835",
		label: "Instituto Moreira Salles ID",
		example: [
			59856328,
			59873669,
			59874426
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for colleges and universities in the United States",
		datatype: "external-id",
		id: "P1771",
		label: "Integrated Postsecondary Education Data System ID",
		example: [
			186047
		],
		types: [
		],
		aliases: [
			"IPEDS ID",
			"Unit ID",
			"UnitID",
			"Integrated Postsecondary Education Data System identifier"
		]
	},
	{
		description: "InterPro unique identifier",
		datatype: "external-id",
		id: "P2926",
		label: "InterPro ID",
		example: [
			24575295
		],
		types: [
			"related to chemistry"
		],
		aliases: [
		]
	},
	{
		description: "identifier for games on tads.org",
		datatype: "external-id",
		id: "P6748",
		label: "Interactive Fiction Database ID",
		example: [
			1946760,
			63436910,
			17985365
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"IFDB ID",
			"tads.org Unique Identifier"
		]
	},
	{
		description: "identifier for an author on the Interbibly website",
		datatype: "external-id",
		id: "P5557",
		label: "Interbibly author ID",
		example: [
			3090137,
			2851370,
			39875458
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on Interia Muzyka site",
		datatype: "external-id",
		id: "P7156",
		label: "Interia Muzyka artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Interlex database (used to be Neurolex)",
		datatype: "external-id",
		id: "P696",
		label: "Interlex ID",
		example: [
			147298
		],
		types: [
			"related to medicine",
			"representing a unique identifier"
		],
		aliases: [
			"Neurolex ID"
		]
	},
	{
		description: "identifier for a boxer on the International Boxing Hall of Fame website",
		datatype: "external-id",
		id: "P4474",
		label: "International Boxing Hall of Fame boxer ID",
		example: [
			7287341,
			454699
		],
		types: [
		],
		aliases: [
			"IBHOF boxer ID"
		]
	},
	{
		description: "classification system for technical standards",
		datatype: "string",
		id: "P5046",
		label: "International Classification for Standards",
		example: [
			50101,
			1484877,
			258311
		],
		types: [
		],
		aliases: [
			"ICS"
		]
	},
	{
		description: "Identifier in the database of all fencers holding an international licence at the International Fencing Federation (FIE: Fédération Internationale d'Escrime)",
		datatype: "external-id",
		id: "P2423",
		label: "International Fencing Federation fencer ID",
		example: [
			1393165,
			274448
		],
		types: [
		],
		aliases: [
			"Fédération Internationale d'Escrime ID",
			"FIE fencer ID",
			"FIE identifier"
		]
	},
	{
		description: "identifier of an International Mathematical Olympiad participant on the official website of IMO",
		datatype: "external-id",
		id: "P5819",
		label: "International Mathematical Olympiad participant ID",
		example: [
			216350,
			117346,
			92362
		],
		types: [
		],
		aliases: [
			"IMO participant ID"
		]
	},
	{
		description: {
		},
		datatype: "wikibase-item",
		id: "P2127",
		label: "International Nuclear Event Scale",
		example: [
			486,
			840847,
			3149899
		],
		types: [
		],
		aliases: [
			"INES"
		]
	},
	{
		description: "unique identifier of a food additive in the International Numbering System",
		datatype: "external-id",
		id: "P4849",
		label: "International Numbering System number",
		example: [
			159683
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"INS number"
		]
	},
	{
		description: "identifier for a person at Olympic.org, the official website of the International Olympic Committee (IOC)",
		datatype: "external-id",
		id: "P3171",
		label: "International Olympic Committee athlete ID",
		example: [
			2616656,
			1189
		],
		types: [
		],
		aliases: [
			"IOC athlete ID",
			"Olympic.org athlete ID",
			"Olympic.org ID"
		]
	},
	{
		description: "alphabetical identifier for an athlete on the International Paralympic Committee website",
		datatype: "external-id",
		id: "P7550",
		label: "International Paralympic Committee athlete alphabetical ID",
		example: [
			41770363,
			7154658,
			3369644
		],
		types: [
		],
		aliases: [
			"IPC athlete ID",
			"paralympic.org"
		]
	},
	{
		description: "code of industry by ISIC (International Standard Industrial Classification of All Economic Activities)",
		datatype: "string",
		id: "P1796",
		label: "International Standard Industrial Classification code Rev.4",
		example: [
			3477363
		],
		types: [
		],
		aliases: [
			"ISIC Rev.4"
		]
	},
	{
		description: "ISO standard unique identifier for text-based works",
		datatype: "external-id",
		id: "P4280",
		label: "International Standard Text Code",
		example: [
			156136
		],
		types: [
		],
		aliases: [
			"ISTC"
		]
	},
	{
		description: "identifier for an inductee on the International Swimming Hall of Fame website",
		datatype: "external-id",
		id: "P3691",
		label: "International Swimming Hall of Fame ID",
		example: [
			257192,
			703944
		],
		types: [
		],
		aliases: [
			"ISHOF ID"
		]
	},
	{
		description: "identifier for an athlete on the International World Games Association website",
		datatype: "external-id",
		id: "P4588",
		label: "International World Games Association athlete ID",
		example: [
			2833306,
			119692
		],
		types: [
		],
		aliases: [
			"IWGA athlete ID"
		]
	},
	{
		description: "identifier for an item on Internet Archive",
		datatype: "external-id",
		id: "P724",
		label: "Internet Archive ID",
		example: [
			150827,
			725401,
			220394
		],
		types: [
		],
		aliases: [
			"IAid",
			"Internet Archive identifier",
			"archive.org"
		]
	},
	{
		description: "identifier for a species of bird, in the Internet Bird Collection database",
		datatype: "external-id",
		id: "P3099",
		label: "Internet Bird Collection species ID",
		example: [
			1264098
		],
		types: [
		],
		aliases: [
			"IBC ID"
		]
	},
	{
		description: "identifier for a writer on the Internet Book Database of Fiction website",
		datatype: "external-id",
		id: "P5365",
		label: "Internet Book Database of Fiction writer ID",
		example: [
			155845,
			105167,
			465179
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for personnel on Broadway",
		datatype: "external-id",
		id: "P1220",
		label: "Internet Broadway Database person ID",
		example: [
			5685,
			213793,
			396
		],
		types: [
		],
		aliases: [
			"IBDB person ID",
			"IBDB person identifier",
			"IBDB identifier person",
			"IBDB name",
			"IBDB person"
		]
	},
	{
		description: "identifier for a specific run of a show",
		datatype: "external-id",
		id: "P1218",
		label: "Internet Broadway Database production ID",
		example: [
			23008456
		],
		types: [
		],
		aliases: [
			"IBDB production ID",
			"IBDB identifier production"
		]
	},
	{
		description: "identifier for a play or other work (which may have had 1 or more productions)",
		datatype: "external-id",
		id: "P1219",
		label: "Internet Broadway Database show ID",
		example: [
			86440,
			650063
		],
		types: [
		],
		aliases: [
			"IBDB show ID",
			"IBDB identifier show",
			"Broadway show id"
		]
	},
	{
		description: "identifier for a theatre or other venue in the IBDB",
		datatype: "external-id",
		id: "P1217",
		label: "Internet Broadway Database venue ID",
		example: [
			4742962
		],
		types: [
		],
		aliases: [
			"IBDB venue ID",
			"IBDB venue identifier",
			"IBDB identifier venue"
		]
	},
	{
		description: "permit issued by the Chinese Ministry of Industry and Information Technology to permit China-based websites to operate in China",
		datatype: "external-id",
		id: "P7477",
		label: "Internet Content Provider Registration Record ID",
		example: [
			3077586,
			3077675,
			14772
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ICP license ID"
		]
	},
	{
		description: "identifier for an article in the Internet Encyclopedia of Philosophy",
		datatype: "external-id",
		id: "P5088",
		label: "Internet Encyclopedia of Philosophy ID",
		example: [
			205,
			9081,
			538733
		],
		types: [
		],
		aliases: [
			"IEP Id"
		]
	},
	{
		description: "identifier for a game on the Internet Game Database",
		datatype: "external-id",
		id: "P5794",
		label: "Internet Game Database game ID",
		example: [
			55076932,
			15297043,
			10493813,
			2357489
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"IGDB game ID"
		]
	},
	{
		description: "identifier for a person on the Internet Game Database",
		datatype: "external-id",
		id: "P5796",
		label: "Internet Game Database person ID",
		example: [
			55003047,
			11860326,
			2606967,
			316013
		],
		types: [
		],
		aliases: [
			"igdb.com person ID",
			"Internet Game Database person ID",
			"IGDB person ID"
		]
	},
	{
		description: "identifier for a platform on the Internet Game Database",
		datatype: "external-id",
		id: "P5795",
		label: "Internet Game Database platform ID",
		example: [
			48493,
			10680,
			1406,
			200912
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"IGDB platform ID"
		]
	},
	{
		description: "identifier for an actor or a company, in Lortel's Internet Off-Broadway Database",
		datatype: "external-id",
		id: "P4456",
		label: "Internet Off-Broadway Database creditable entity ID",
		example: [
			7422463,
			16254847
		],
		types: [
		],
		aliases: [
			"IOBDb actor ID",
			"iobdb.com actor ID",
			"Lortel Archives actor ID",
			"Internet Off-Broadway Database actress  ID",
			"IOBDb actress ID",
			"iobdb.com actress ID",
			"Lortel Archives actress ID",
			"Internet Off-Broadway Database person ID",
			"IOBDb person ID",
			"iobdb.com person ID",
			"Lortel Archives person ID"
		]
	},
	{
		description: "identifier for a production in Lortel's Internet Off-Broadway Database",
		datatype: "external-id",
		id: "P7398",
		label: "Internet Off-Broadway Database production ID",
		example: [
			13402403,
			24470901,
			30602904
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"IOBDB work ID",
			"IOBDB production ID",
			"IOBDB.com work ID",
			"IOBDB.com production ID",
			"Internet Off-Broadway Database work ID"
		]
	},
	{
		description: "identifier for pinball machines at the Internet Pinball Database",
		datatype: "external-id",
		id: "P6011",
		label: "Internet Pinball Database ID",
		example: [
			22908074,
			1393920,
			2047418
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"IPDB ID"
		]
	},
	{
		description: "identifier for a person in the Internet Speculative Fiction Database",
		datatype: "external-id",
		id: "P1233",
		label: "Internet Speculative Fiction Database author ID",
		example: [
			34981,
			71429
		],
		types: [
		],
		aliases: [
			"ISFDB author ID"
		]
	},
	{
		description: "identifier for a professional wrestling performer at the Internet Wrestling Database",
		datatype: "external-id",
		id: "P2829",
		label: "Internet Wrestling Database ID",
		example: [
			44437
		],
		types: [
		],
		aliases: [
			"IWD ID",
			"profightdb wrestler ID"
		]
	},
	{
		description: "identifier for an article in the Internetowy Polski Słownik Biograficzny",
		datatype: "external-id",
		id: "P8130",
		label: "Internetowy Polski Słownik Biograficzny ID",
		example: [
			48851129,
			191479,
			6349709
		],
		types: [
		],
		aliases: [
			"IPSB ID"
		]
	},
	{
		description: "identifier for a stolen artwork in the dedicated Interpol database",
		datatype: "external-id",
		id: "P6372",
		label: "Interpol WOA artwork ID (OBSOLETE)",
		example: [
			2270805,
			9052203,
			6120039
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author in the IntraText digital library",
		datatype: "external-id",
		id: "P6873",
		label: "IntraText author ID",
		example: [
			4295,
			188646,
			547749
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist or other person at Invaluable.com",
		datatype: "external-id",
		id: "P4927",
		label: "Invaluable.com person ID",
		example: [
			296,
			50281166,
			360371,
			2625979
		],
		types: [
		],
		aliases: [
			"Invaluable.com artist ID"
		]
	},
	{
		description: "identifier for a species on the Invasive Plant Atlas of the United States website",
		datatype: "external-id",
		id: "P6161",
		label: "Invasive Plant Atlas of the United States ID",
		example: [
			786072,
			894236,
			305979
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon datasheet in the Invasive Species Compendium, produced by the Centre for Agriculture and Bioscience International",
		datatype: "external-id",
		id: "P5698",
		label: "Invasive Species Compendium Datasheet ID",
		example: [
			3155566,
			614156,
			155867
		],
		types: [
		],
		aliases: [
			"ISC ID",
			"ISC Datasheet ID",
			"Invasive Species Compendium ID"
		]
	},
	{
		description: "identifier for an architectural property in Catalonia. max. 5-digit numeric",
		datatype: "external-id",
		id: "P1600",
		label: "Inventari del Patrimoni Arquitectònic de Catalunya code",
		example: [
			18006527,
			11227
		],
		types: [
		],
		aliases: [
			"BCIN",
			"BCIL",
			"Catalan architectural inventory ID",
			"IPA (Catalonia)"
		]
	},
	{
		description: "identifier of an artwork in the inventory of sculptures of Florentine museums",
		datatype: "external-id",
		id: "P3467",
		label: "Inventario Sculture - Polo Museale Fiorentino",
		example: [
			179900
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "control number for a work, in 'Inventories of American Painting and Sculpture'",
		datatype: "external-id",
		id: "P4814",
		label: "Inventories of American Painting and Sculpture control number",
		example: [
			47522991,
			3355073
		],
		types: [
		],
		aliases: [
			"Inventory of American Painting control number",
			"Inventory of American Sculpture control number",
			"Art Inventories Catalog",
			"SIRIS control number",
			"Smithsonian Institution Research Information System control number",
			"Smithsonian American Art Museum control number",
			"IAPS control number",
			"IAS control number"
		]
	},
	{
		description: "identifier for an ancient city in the Inventory of Archaic and Classical Poleis",
		datatype: "external-id",
		id: "P8137",
		label: "Inventory of Archaic and Classical Poleis ID",
		example: [
			2830434,
			854843,
			733291
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for items in the inventory of Christian shrines and pilgrimage sites in France",
		datatype: "external-id",
		id: "P5449",
		label: "Inventory of French sanctuaries ID",
		example: [
			42944122,
			2886945,
			22939729
		],
		types: [
		],
		aliases: [
			"French sanctuaries ID",
			"Inventory of Christian shrines and pilgrimage sites in France ID"
		]
	},
	{
		description: "identifier of a place of worship in Quebec, built before 1975",
		datatype: "external-id",
		id: "P5599",
		label: "Inventory of Quebec's Places of Worship ID",
		example: [
			55600246,
			652073,
			28133506
		],
		types: [
		],
		aliases: [
			"identifiant Inventaire des lieux de culte du Québec",
			"identifiant Inventaire des lieux de culte du Quebec"
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P6542",
		label: "Inventário dos Monumentos RJ ID",
		example: [
			61783267,
			61794612,
			18476242
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an Iowa Sports Hall of Fame inductee",
		datatype: "external-id",
		id: "P4631",
		label: "Iowa Sports Hall of Fame ID",
		example: [
			3856872,
			930115
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for places in Iran",
		datatype: "external-id",
		id: "P1010",
		label: "Iran statistics ID",
		example: [
			3616,
			911727,
			5778923
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Iranian National Heritage database",
		datatype: "external-id",
		id: "P1369",
		label: "Iranian National Heritage registration number",
		example: [
			129072
		],
		types: [
		],
		aliases: [
			"CHRC",
			"Cultural Heritage Registration Code (Iran)",
			"ICHTO"
		]
	},
	{
		description: "identifier of an article, on iranicaonline.org",
		datatype: "external-id",
		id: "P3021",
		label: "Iranica ID",
		example: [
			146597,
			9601
		],
		types: [
		],
		aliases: [
			"Encyclopædia Iranica"
		]
	},
	{
		description: "grid location reference from the Irish Grid reference system used in Ireland",
		datatype: "string",
		id: "P4091",
		label: "Irish Grid Reference",
		example: [
			68364,
			4879916
		],
		types: [
			"to indicate a location"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a structure, in National Inventory of Architectural Heritage database of Ireland",
		datatype: "external-id",
		id: "P4088",
		label: "Irish National Inventory of Architectural Heritage ID",
		example: [
			30246808
		],
		types: [
		],
		aliases: [
			"NIAH ID"
		]
	},
	{
		description: "identifier of a structure, in National Monument database of Ireland, maintained by Heritage Ireland",
		datatype: "external-id",
		id: "P4059",
		label: "Irish National Monument ID",
		example: [
			1260144,
			33530
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a rugby union player selected with Ireland national team on the Irish Rugby Football Union website",
		datatype: "external-id",
		id: "P3848",
		label: "Irish Rugby Football Union men's player ID",
		example: [
			912889
		],
		types: [
		],
		aliases: [
			"IRFU ID",
			"Irish Rugby Football Union ID"
		]
	},
	{
		description: "identifier for a men's rugby sevens player selected with the Ireland national team on the Irish Rugby Football Union website",
		datatype: "external-id",
		id: "P4949",
		label: "Irish Rugby Football Union men's sevens player ID",
		example: [
			42887458
		],
		types: [
		],
		aliases: [
			"IRFU men's sevens ID"
		]
	},
	{
		description: "Identifier for a female rugby union player selected with Ireland women's national team on the Irish Rugby Football Union website",
		datatype: "external-id",
		id: "P4836",
		label: "Irish Rugby Football Union women's player ID",
		example: [
			42531650,
			3339465
		],
		types: [
		],
		aliases: [
			"Irish Rugby Football Union women's ID",
			"IRFU women's ID"
		]
	},
	{
		description: "identifier for a women's rugby sevens player selected with the Ireland national team on the Irish Rugby Football Union website",
		datatype: "external-id",
		id: "P4950",
		label: "Irish Rugby Football Union women's sevens player ID",
		example: [
			42531650
		],
		types: [
		],
		aliases: [
			"IRFU women's sevens ID"
		]
	},
	{
		description: "identifier in Sites and Monuments Record database of Ireland",
		datatype: "external-id",
		id: "P4057",
		label: "Irish Sites and Monuments Record ID",
		example: [
			1775146,
			33313
		],
		types: [
		],
		aliases: [
			"SMR ID"
		]
	},
	{
		description: "identifier for a person, in the 'Irish Playography' database of theatre plays",
		datatype: "external-id",
		id: "P7934",
		label: "Irish playography person ID",
		example: [
			1742217,
			84968722,
			1292714
		],
		types: [
		],
		aliases: [
			"Playography Ireland person ID"
		]
	},
	{
		description: "identifier for a play, in the 'Irish Playography' database of theatre plays",
		datatype: "external-id",
		id: "P7932",
		label: "Irish playography play ID",
		example: [
			4946696,
			55191837,
			7744670
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Israeli cinema, television and radio database",
		datatype: "external-id",
		id: "P3906",
		label: "Ishim ID",
		example: [
			238719,
			2573044
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a scholar on Isidore, a platform that collects links to scholarly documents and official texts",
		datatype: "external-id",
		id: "P4491",
		label: "Isidore scholar ID",
		example: [
			41665925,
			38042966,
			23
		],
		types: [
		],
		aliases: [
			"Isidore ID"
		]
	},
	{
		description: "ID in the Israeli Antiquities Authority archive",
		datatype: "external-id",
		id: "P3941",
		label: "Israel Antiquities Authority ID",
		example: [
			2777661
		],
		types: [
		],
		aliases: [
			"IAA ID"
		]
	},
	{
		description: "identifier for a chess player from the Israel Chess Federation",
		datatype: "external-id",
		id: "P3867",
		label: "Israel Chess Federation player ID",
		example: [
			272403
		],
		types: [
		],
		aliases: [
			"ICF ID"
		]
	},
	{
		description: "ID for movies backed by the Israel Film Fund",
		datatype: "external-id",
		id: "P5151",
		label: "Israel Film Fund ID",
		example: [
			592466
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a player on the Israel Football Association website",
		datatype: "external-id",
		id: "P3748",
		label: "Israel Football Association player ID",
		example: [
			6832507,
			19560915
		],
		types: [
		],
		aliases: [
			"IFA player ID"
		]
	},
	{
		description: "identifier of a person (artist) in the Israel Museum Jerusalem collection",
		datatype: "external-id",
		id: "P7681",
		label: "Israel Museum Jerusalem artist ID",
		example: [
			1451551,
			1988310,
			52148641
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "The Israeli municipal code (Hebrew סמל) is an outline encoding used by the Israel Central Bureau of Statistics to finely fine-tune their statistics. It's a unique identifier given to each municipality in Israel.",
		datatype: "external-id",
		id: "P3466",
		label: "Israeli CBS municipal ID",
		example: [
			1218,
			152641,
			171639,
			168140
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an article in the Internet encyclopedia Istrapedia",
		datatype: "external-id",
		id: "P8603",
		label: "Istrapedia ID",
		example: [
			98481536,
			13280,
			8030830
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a rugby player on the It's Rugby website",
		datatype: "external-id",
		id: "P3769",
		label: "It's Rugby player ID",
		example: [
			579573,
			961659,
			1146098
		],
		types: [
		],
		aliases: [
			"It's Rugby ID"
		]
	},
	{
		description: "identifier for incumbent and former deputies from the Italian Chamber of Deputies",
		datatype: "external-id",
		id: "P1341",
		label: "Italian Chamber of Deputies dati ID",
		example: [
			3956186,
			3737980,
			597155
		],
		types: [
		],
		aliases: [
			"Chamber of Deputies of Italy dati ID"
		]
	},
	{
		description: "identifier for football player of AIC",
		datatype: "external-id",
		id: "P6319",
		label: "Italian Footballers' Association player ID",
		example: [
			68060,
			367368,
			52876
		],
		types: [
		],
		aliases: [
			"AIC player ID",
			"Associazione Italiana Calciatori player ID"
		]
	},
	{
		description: "identifier for an earthquake in the Italian National Earthquake Centre database",
		datatype: "external-id",
		id: "P4207",
		label: "Italian National Earthquake Center ID",
		example: [
			37730232
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an Italian athlete on the website of the Italian National Olympic Committee",
		datatype: "external-id",
		id: "P4069",
		label: "Italian National Olympic Committee athlete ID",
		example: [
			3961195,
			233527
		],
		types: [
		],
		aliases: [
			"CONI athlete ID"
		]
	},
	{
		description: "identifier of a lighthouse or beacon in \"Fari e Segnalamenti\" list of the Italian Navy",
		datatype: "external-id",
		id: "P3863",
		label: "Italian Navy Lighthouses and Beacons ID",
		example: [
			973243
		],
		types: [
		],
		aliases: [
			"EF ID"
		]
	},
	{
		description: "This property describes the school identifier used by Italian Ministry of Education, Universities and Research for identifying italian schools",
		datatype: "external-id",
		id: "P5114",
		label: "Italian School ID",
		example: [
			52083858
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a member of the Senate of the Kingdom of Sardinia or of the Senate of the Kingdom of Italy on the Italian Senate website",
		datatype: "external-id",
		id: "P3954",
		label: "Italian Senate ID",
		example: [
			470067,
			2835595
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for incumbent and former senators from the Italian Senate of the Republic",
		datatype: "external-id",
		id: "P2549",
		label: "Italian Senate of the Republic ID",
		example: [
			3757035,
			2503364
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "name of the article in Italian Vikidia",
		datatype: "external-id",
		id: "P7822",
		label: "Italian Vikidia ID",
		example: [
			68,
			1321,
			96
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"itvd",
			"Vikidia article in Italian",
			"article in Italian Vikidia"
		]
	},
	{
		description: "identifier for Italian comunes in the cadastre",
		datatype: "external-id",
		id: "P806",
		label: "Italian cadastre code",
		example: [
			42303
		],
		types: [
		],
		aliases: [
			"codice catastale"
		]
	},
	{
		description: "unique identifier for a entity in the Itaú Cultural Encyclopedia website",
		datatype: "external-id",
		id: "P4399",
		label: "Itaú Cultural ID",
		example: [
			528922,
			946076,
			61986955
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Enciclopédia Itaú Cultural de Arte e Cultura Brasileiras ID",
			"Enciclopédia Itaú Cultural ID",
			"itaucultural ID"
		]
	},
	{
		description: "URL of a project hosted on itch.io",
		datatype: "url",
		id: "P7294",
		label: "Itch.io URL",
		example: [
			6392377,
			67471766,
			56808347
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "profile on itch.io",
		datatype: "external-id",
		id: "P8176",
		label: "Itch.io developer profile",
		example: [
			91125606,
			17042553,
			19680180
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a topic on J-GLOBAL",
		datatype: "external-id",
		id: "P7783",
		label: "J-GLOBAL ID",
		example: [
			58139859,
			632006,
			416487,
			7842
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier assigned to an artist by the J. Paul Getty Museum",
		datatype: "external-id",
		id: "P2432",
		label: "J. Paul Getty Museum artist id",
		example: [
			184212
		],
		types: [
		],
		aliases: [
			"J. Paul Getty Museum artist identifier",
			"Getty Museum artist id"
		]
	},
	{
		description: "identifier for an object in the J. Paul Getty Museum",
		datatype: "external-id",
		id: "P2582",
		label: "J. Paul Getty Museum object ID",
		example: [
			20178648
		],
		types: [
		],
		aliases: [
			"Getty Museum object id"
		]
	},
	{
		description: "identifier for a manager (coach) at website of J.League, Japan's professional association football (soccer) league",
		datatype: "external-id",
		id: "P4048",
		label: "J.League manager ID",
		example: [
			331991
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a player at website of J.League, Japan's professional association football (soccer) league",
		datatype: "external-id",
		id: "P3565",
		label: "J.League player ID",
		example: [
			24875234
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for athletes in Japan Association of Athletics Federations (JAAF) database and website",
		datatype: "external-id",
		id: "P5073",
		label: "JAAF athlete ID",
		example: [
			9161411
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"JAAF ID"
		]
	},
	{
		description: "identifier of a flavour, food additive, contaminant, toxicant or veterinary drug in the JECFA database",
		datatype: "external-id",
		id: "P4852",
		label: "JECFA database ID",
		example: [
			159683
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "standard that was developed by the Japanese Industrial Standards",
		datatype: "external-id",
		id: "P6857",
		label: "JIS standard",
		example: [
			11225828,
			905250,
			11225838
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Japanese Industrial Standards ID"
		]
	},
	{
		description: "ID of JKT48 members at their website",
		datatype: "external-id",
		id: "P6336",
		label: "JKT48 member ID",
		example: [
			26236957,
			26236958,
			13097026
		],
		types: [
		],
		aliases: [
			"JKT48 ID"
		]
	},
	{
		description: "Magnitude of an earthquake according to Japan Meteorological Agency",
		datatype: "quantity",
		id: "P5900",
		label: "JMA Magnitude",
		example: [
			36204,
			55080471,
			23825118
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an earthquake event in Japan Meteorological Agency Seismic Intensity Database",
		datatype: "external-id",
		id: "P5182",
		label: "JMA Seismic Intensity Database ID",
		example: [
			36204,
			26874532
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "maximum intensity scale of this earthquake given by JMA Seismic Intensity Scale",
		datatype: "wikibase-item",
		id: "P5386",
		label: "JMA Seismic Intensity Scale",
		example: [
			36204,
			55080471,
			3742341,
			11529237
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "film IDs on Japanese Movie Database",
		datatype: "external-id",
		id: "P2400",
		label: "JMDb film ID",
		example: [
			189540,
			860461,
			155653
		],
		types: [
		],
		aliases: [
			"JMDb film identifier"
		]
	},
	{
		description: "ID of an actor or a company at Japanese Movie Database",
		datatype: "external-id",
		id: "P3703",
		label: "JMDb person or company ID",
		example: [
			8006,
			182950
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "rating of a film in the Austrian film rating system",
		datatype: "wikibase-item",
		id: "P3650",
		label: "JMK film rating",
		example: [
			637820,
			246283
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a pesticide in the JMPR database",
		datatype: "external-id",
		id: "P4853",
		label: "JMPR database ID",
		example: [
			412265
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for entries at the Japanese Dictionary Database",
		datatype: "external-id",
		id: "P6646",
		label: "JMdictDB ID",
		example: [
			3595028
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for artists whose arts were collected by Indian private collector Jehangir Nicholson",
		datatype: "external-id",
		id: "P7566",
		label: "JNAF artist ID",
		example: [
			3345966,
			325611,
			16864498
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P6413",
		label: "JORFSearch organization ID",
		example: [
			60594053,
			16641381,
			3000915
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the JPL Small-Body Database",
		datatype: "external-id",
		id: "P716",
		label: "JPL Small-Body Database ID",
		example: [
			1134434
		],
		types: [
		],
		aliases: [
			"JPL Small-Body Database identifier"
		]
	},
	{
		description: "ID in the JRC Names gazetteer, which provides spelling variants and EMM news about the entity (220k news items per day). Alias: JRCN",
		datatype: "external-id",
		id: "P6640",
		label: "JRC Names id",
		example: [
			146183,
			80,
			1851405,
			631612
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"JRCN"
		]
	},
	{
		description: "identifier for an article in JSTOR",
		datatype: "external-id",
		id: "P888",
		label: "JSTOR article ID",
		example: [
			21606687,
			29037140,
			28036687,
			42307276,
			15132029
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a journal in JSTOR",
		datatype: "external-id",
		id: "P1230",
		label: "JSTOR journal ID",
		example: [
			32180,
			15761333
		],
		types: [
		],
		aliases: [
			"JSTOR journal code"
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P8562",
		label: "JSTOR publisher ID",
		example: [
			1017974,
			27310948,
			255147
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a topic at JSTOR",
		datatype: "external-id",
		id: "P3827",
		label: "JSTOR topic ID",
		example: [
			989963,
			9612,
			431
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a tropical cyclone, issued by the Joint Typhoon Warning Center",
		datatype: "external-id",
		id: "P3399",
		label: "JTWC tropical cyclone ID",
		example: [
			15136651,
			3546220
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Julkaisufoorumi (Finnish Publication Forum)",
		datatype: "external-id",
		id: "P1277",
		label: "JUFO ID",
		example: [
			180445,
			15753866
		],
		types: [
		],
		aliases: [
			"Julkaisufoorumi ID"
		]
	},
	{
		description: "identifier for a wrestler in the Japan Wrestling Federation Database",
		datatype: "external-id",
		id: "P6502",
		label: "JWF Wrestlers Database person ID",
		example: [
			8060666,
			3299319,
			331026
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an album per the Jamendo website",
		datatype: "external-id",
		id: "P2513",
		label: "Jamendo album ID",
		example: [
			3341139
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist per the Jamendo website",
		datatype: "external-id",
		id: "P2514",
		label: "Jamendo artist ID",
		example: [
			1814063
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on Jango site",
		datatype: "external-id",
		id: "P7187",
		label: "Jango artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a golf player, in the Japan Golf Tour database",
		datatype: "external-id",
		id: "P3535",
		label: "Japan Golf Tour player ID",
		example: [
			440171
		],
		types: [
		],
		aliases: [
			"JapanTour ID",
			"JapanTour golf player ID"
		]
	},
	{
		description: "identifier for a game available on the PlayStation Store (JP region)",
		datatype: "external-id",
		id: "P5999",
		label: "Japan PlayStation Store ID",
		example: [
			17452,
			55381995,
			22129424
		],
		types: [
		],
		aliases: [
			"Japan PS Store ID",
			"PS Store JP ID",
			"PlayStation Store Japan ID"
		]
	},
	{
		description: "Japan Professional Basketball League",
		datatype: "external-id",
		id: "P5960",
		label: "Japan Professional Basketball League ID",
		example: [
			952047,
			28748034
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a men's rugby union player selected with the Japan national team on the Japan Rugby Football Union website",
		datatype: "external-id",
		id: "P4937",
		label: "Japan Rugby Football Union men's player ID",
		example: [
			6832188
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a men's rugby sevens player selected with the Japan national team on the Japan Rugby Football Union website",
		datatype: "external-id",
		id: "P4941",
		label: "Japan Rugby Football Union men's sevens player ID",
		example: [
			6684640
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a women's rugby union player selected with the Japan national team on the Japan Rugby Football Union website",
		datatype: "external-id",
		id: "P4938",
		label: "Japan Rugby Football Union women's player ID",
		example: [
			11648832
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a women's rugby sevens player selected with the Japan national team on the Japan Rugby Football Union website",
		datatype: "external-id",
		id: "P4940",
		label: "Japan Rugby Football Union women's sevens player ID",
		example: [
			26236482
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Japan Search portal",
		datatype: "external-id",
		id: "P6698",
		label: "Japan Search name ID",
		example: [
			5586,
			5589,
			4873997,
			794
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Japan Search name identifier"
		]
	},
	{
		description: "identifier of a person in the Japan Sumo Association database",
		datatype: "external-id",
		id: "P3385",
		label: "Japan Sumo Association ID",
		example: [
			448054
		],
		types: [
		],
		aliases: [
			"Grand Sumo ID",
			"Goo Sumo ID"
		]
	},
	{
		description: "identifier for an inductee on the Japanese Baseball Hall of Fame website",
		datatype: "external-id",
		id: "P4562",
		label: "Japanese Baseball Hall of Fame ID",
		example: [
			11450055,
			5366584
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a site in the Japanese Database of National important cultural properties",
		datatype: "external-id",
		id: "P4275",
		label: "Japanese Database of National important cultural properties",
		example: [
			11333899
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a high school in Japan",
		datatype: "external-id",
		id: "P1386",
		label: "Japanese High School Code",
		example: [
			11672444
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique code for magazines used in Japan",
		datatype: "external-id",
		id: "P8473",
		label: "Japanese magazine code",
		example: [
			6157807,
			5369562
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an aircraft per the Japanese military",
		datatype: "external-id",
		id: "P849",
		label: "Japanese military aircraft designation",
		example: [
			190211
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "type of an pitch accent of a Japanese lexeme",
		datatype: "wikibase-item",
		label: "Japanese pitch accent type",
		id: "P5426",
		types: [
		],
		aliases: [
			"Japanese pitch accent"
		]
	},
	{
		description: "identifier for an artist or organization on the Jaxsta website",
		datatype: "external-id",
		id: "P7052",
		label: "Jaxsta profile ID",
		example: [
			26876,
			1299,
			38903,
			209651
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a recording on the Jaxsta website",
		datatype: "external-id",
		id: "P7056",
		label: "Jaxsta recording ID",
		example: [
			60709218,
			60368758,
			62587323,
			3596262
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a release on the Jaxsta website",
		datatype: "external-id",
		id: "P7055",
		label: "Jaxsta release ID",
		example: [
			37814092,
			181826,
			62587323,
			368809
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author on the website Jeugdliteratuur.org",
		datatype: "external-id",
		id: "P7504",
		label: "Jeugdliteratuur ID",
		example: [
			30053470,
			43192596,
			3261739,
			231841
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on JewAge, a genealogical database for Jewish people",
		datatype: "external-id",
		id: "P4116",
		label: "JewAge person ID",
		example: [
			937
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an entry at Jewish Encyclopedia Daat",
		datatype: "external-id",
		id: "P3710",
		label: "Jewish Encyclopedia Daat ID",
		example: [
			2909560
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "article identifier in online version of 1906 Jewish Encyclopedia",
		datatype: "external-id",
		id: "P8590",
		label: "Jewish Encyclopedia ID",
		example: [
			65008,
			173457,
			60
		],
		types: [
		],
		aliases: [
			"jewishencyclopedia.com ID"
		]
	},
	{
		description: "Electronic Jewish Encyclopedia in Russian",
		datatype: "external-id",
		id: "P1438",
		label: "Jewish Encyclopedia ID (Russian)",
		example: [
			7322,
			273279
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Shorter Jewish Encyclopedia in Russian"
		]
	},
	{
		description: "Jewish Museum Berlin person ID",
		datatype: "external-id",
		id: "P6214",
		label: "Jewish Museum Berlin person ID",
		example: [
			59161469,
			58358600,
			58363991
		],
		types: [
		],
		aliases: [
			"Berlin Jewish Museum"
		]
	},
	{
		description: "identifier for a person in the Jewish Virtual Library",
		datatype: "external-id",
		id: "P8568",
		label: "Jewish Virtual Library person ID",
		example: [
			70899,
			39837,
			5033487
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a town in The JewishGen Communities Database",
		datatype: "external-id",
		id: "P3198",
		label: "JewishGen Locality ID",
		example: [
			3010530
		],
		types: [
		],
		aliases: [
			"JewishGen ID"
		]
	},
	{
		description: "identifier for an artwork by Joan Miró in the Joan Miró Online Image Bank",
		datatype: "external-id",
		id: "P6489",
		label: "Joan Miró Online Image Bank ID",
		example: [
			20816658,
			60229578,
			2981628
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the Service des Musées de France Joconde authority file",
		datatype: "external-id",
		id: "P7711",
		label: "Joconde author ID",
		example: [
			148475,
			446984,
			120582,
			5128670
		],
		types: [
		],
		aliases: [
			"Joconde creator ID",
			"Joconde artist ID"
		]
	},
	{
		description: "identifier for stage or type of creation from the Service des Musées de France Joconde authority file",
		datatype: "external-id",
		id: "P7961",
		label: "Joconde creation ID",
		example: [
			5078274,
			1784021,
			207977
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a discovery environment in the Service des Musées de France Joconde authority file",
		datatype: "external-id",
		id: "P7960",
		label: "Joconde discovery ID",
		example: [
			1149405,
			959782,
			1416685
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for the general context (domain) of a cultural artifact from the Service des Musées de France Joconde authority file",
		datatype: "external-id",
		id: "P7712",
		label: "Joconde domain ID",
		example: [
			7137052,
			23498,
			11634,
			590870
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an epoch or a style in the Joconde database of the French Museum Service",
		datatype: "external-id",
		id: "P7786",
		label: "Joconde epoch ID",
		example: [
			34636,
			164800,
			2277
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a type of inscription from the Service des Musées de France Joconde authority file",
		datatype: "external-id",
		id: "P7884",
		label: "Joconde inscription ID",
		example: [
			138619,
			2118609,
			162919,
			722218
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for places from the Service des Musées de France Joconde authority file",
		datatype: "external-id",
		id: "P7850",
		label: "Joconde location ID",
		example: [
			189,
			162126,
			831052
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for object types from the Service des Musées de France Joconde authority file",
		datatype: "external-id",
		id: "P7844",
		label: "Joconde object type ID",
		example: [
			178401,
			3305213,
			490274,
			1317634
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a creative technique from the Service des Musées de France Joconde authority file",
		datatype: "external-id",
		id: "P8192",
		label: "Joconde technique ID",
		example: [
			765814,
			133036,
			3556204
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for time periods in the Service des Musées de France Joconde authority file",
		datatype: "external-id",
		id: "P7885",
		label: "Joconde time period ID",
		example: [
			6939,
			26257,
			8101,
			115603
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Joconde database of the French Ministry of Culture",
		datatype: "external-id",
		id: "P347",
		label: "Joconde work ID",
		example: [
			26250,
			3873324
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon in John J. Audubon's 'Birds of America' on the National Audubon Society website",
		datatype: "external-id",
		id: "P6041",
		label: "John J. Audubon's Birds of America ID",
		example: [
			208004,
			25317,
			833243
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unclassified designator for United States military electronic equipment",
		datatype: "external-id",
		id: "P2832",
		label: "Joint Electronics Type Designation Automated System designation",
		example: [
			564415
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"JETDS",
			"JETDAS"
		]
	},
	{
		description: "invariant of a knot or link. Use q as variable and list monomials in decreasing order.",
		datatype: "math",
		id: "P5352",
		label: "Jones polynomial",
		example: [
			1188344,
			168620,
			7797291
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a journal on JournalBase",
		datatype: "external-id",
		id: "P7368",
		label: "JournalBase ID",
		example: [
			68598032,
			2810781,
			15059356
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a scientific journal in the JournalTOCs bibliographic database",
		datatype: "external-id",
		id: "P8100",
		label: "JournalTOCs ID",
		example: [
			4034061,
			27724516,
			3486571
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier on Journalisted, an independent, not-for-profit website (by Media Standards Trust) listing the published writing of journalists",
		datatype: "external-id",
		id: "P1714",
		label: "Journalisted ID",
		example: [
			333493
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier for a judoka at the JudoInside.com database",
		datatype: "external-id",
		id: "P2767",
		label: "JudoInside judoka ID",
		example: [
			1938947,
			353514
		],
		types: [
		],
		aliases: [
			"JudoInside.com ID"
		]
	},
	{
		description: "identifier of a person on the biographical dictionary of the Lycée Clemenceau alumni, said \"Julien\"",
		datatype: "external-id",
		id: "P4930",
		label: "Julien ID",
		example: [
			980750,
			50143133
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on Juno Download music site",
		datatype: "external-id",
		id: "P6920",
		label: "Juno Download artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "decision of a French-speaking supreme court on Juricaf",
		datatype: "external-id",
		id: "P7658",
		label: "Juricaf decision ID",
		example: [
			62057801,
			76363802,
			19148908
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "distinct number used to identify a mauza or village in Bangladesh and parts of India",
		datatype: "external-id",
		id: "P7925",
		label: "Jurisdiction List number",
		example: [
			60783369,
			28164077,
			5575229
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"JL number",
			"J.L. number"
		]
	},
	{
		description: "ID for American or Canadian football player in www.justsportsstats.com",
		datatype: "external-id",
		id: "P3566",
		label: "Just Sports Stats ID",
		example: [
			6828171
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for the assignee of a patent in Justia Patents",
		datatype: "external-id",
		id: "P6740",
		label: "Justia Patents assignee ID",
		example: [
			1150535,
			127552,
			1654103,
			49108
		],
		types: [
		],
		aliases: [
			"Justia Patents organization ID"
		]
	},
	{
		description: "ID of a company in Justia Patents",
		datatype: "external-id",
		id: "P3875",
		label: "Justia Patents company ID",
		example: [
			312
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of an inventor in Justia Patents",
		datatype: "external-id",
		id: "P3874",
		label: "Justia Patents inventor ID",
		example: [
			19837
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a race, a team or an athlete on the Juwra.com website",
		datatype: "external-id",
		id: "P3949",
		label: "Juwra.com ID",
		example: [
			7855,
			4575693
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a player at website of K League, South Korea's professional association football (soccer) league",
		datatype: "external-id",
		id: "P3053",
		label: "K League player ID",
		example: [
			318757,
			313940
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier issued by the National Assembly Library of Korea",
		datatype: "external-id",
		id: "P8223",
		label: "K-Scholar ID",
		example: [
			9545,
			371212,
			475424
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a member of the Royal Academy of Dutch language and literature",
		datatype: "external-id",
		id: "P3277",
		label: "KANTL member ID",
		example: [
			21226597
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "rating in the Finnish film and television rating system",
		datatype: "wikibase-item",
		id: "P5152",
		label: "KAVI rating",
		example: [
			16933688
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a baseball hitter in koreabaseball.com",
		datatype: "external-id",
		id: "P4370",
		label: "KBO hitter ID",
		example: [
			3056420
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a baseball pitcher in koreabaseball.com",
		datatype: "external-id",
		id: "P4371",
		label: "KBO pitcher ID",
		example: [
			489302
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for the KBpedia knowledge graph, which provides consistent mappings across seven large-scale public knowledge bases including Wikidata, and is used to promote data interoperability and extraction of training sets for machine learning",
		datatype: "external-id",
		id: "P8408",
		label: "KBpedia ID",
		example: [
			28425,
			21113921,
			830043
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"KBpedia",
			"KKO",
			"KBpedia knowledge graph",
			"KBpedia ontology",
			"kbpedia",
			"Kbpedia"
		]
	},
	{
		description: "identifier on the Munzinger Archiv",
		datatype: "external-id",
		id: "P1287",
		label: "KDG Komponisten der Gegenwart",
		example: [
			439786
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier from databases dealing with genomes, enzymatic pathways, and biological chemicals",
		datatype: "external-id",
		id: "P665",
		label: "KEGG ID",
		example: [
			193598
		],
		types: [
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a place on the KEPN site",
		datatype: "external-id",
		id: "P3639",
		label: "KEPN ID",
		example: [
			963155,
			2011274
		],
		types: [
		],
		aliases: [
			"Key to English Place-Names ID"
		]
	},
	{
		description: "identifier for a school in the information system by KERIS",
		datatype: "external-id",
		id: "P5744",
		label: "KERIS school ID",
		example: [
			12593305,
			14721964,
			15006446
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a film in the KINENOTE movie database",
		datatype: "external-id",
		id: "P2508",
		label: "KINENOTE film ID",
		example: [
			189540,
			860461,
			155653
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person in the KINENOTE movie database",
		datatype: "external-id",
		id: "P3305",
		label: "KINENOTE person ID",
		example: [
			253882,
			57604
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "the value (without separator) of a positive integer. Various interfaces exist for properties of them.",
		datatype: "external-id",
		id: "P5176",
		label: "KIT Linked Open Numbers ID",
		example: [
			812996,
			19243120
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"natural number",
			"positive integer",
			"non-negative integer",
			"KIT Linked Open Numbers ID",
			"Number World ID",
			"value of positive integer"
		]
	},
	{
		description: "identifier for an album on KKBox music site",
		datatype: "external-id",
		id: "P5153",
		label: "KKBox album ID",
		example: [
			19687629,
			19363369
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on KKBox music site",
		datatype: "external-id",
		id: "P5154",
		label: "KKBox artist ID",
		example: [
			45188,
			13580495,
			19848
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a building or landscape element in the KLEKs database",
		datatype: "external-id",
		id: "P5556",
		label: "KLEKs ID",
		example: [
			55595763,
			27732559,
			27513006
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of a documentary film at Korean Movie Database",
		datatype: "external-id",
		id: "P3750",
		label: "KMDb documentary film ID",
		example: [
			7084719,
			18393869
		],
		types: [
		],
		aliases: [
			"KMDb documentary ID"
		]
	},
	{
		description: "ID of a film at Korean Movie Database",
		datatype: "external-id",
		id: "P3704",
		label: "KMDb film ID",
		example: [
			4751662,
			7080491
		],
		types: [
		],
		aliases: [
			"Korean movie database film id"
		]
	},
	{
		description: "identifier for a person on the Korean Movie Database (KMDb)",
		datatype: "external-id",
		id: "P1649",
		label: "KMDb person ID",
		example: [
			464601,
			315484
		],
		types: [
		],
		aliases: [
			"Korean Movie Database person ID"
		]
	},
	{
		description: "item with sitelinks to wikimedia page containing text of a relevant KML file",
		datatype: "wikibase-item",
		id: "P3096",
		label: "KML file",
		example: [
			1544264
		],
		types: [
			"to indicate a location"
		],
		aliases: [
			"KML",
			"Keyhole Markup Language file"
		]
	},
	{
		description: "rating of a film in the South Korean film/video rating system",
		datatype: "wikibase-item",
		id: "P3818",
		label: "KMRB film rating",
		example: [
			20444585,
			61448040
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Persistent identifier for an artwork from the collection of the Royal Museum of Fine Arts Antwerp in Antwerp, Belgium",
		datatype: "external-id",
		id: "P4905",
		label: "KMSKA work PID",
		example: [
			375216
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the Royal Netherlands Academy of Arts and Sciences past member database",
		datatype: "external-id",
		id: "P2454",
		label: "KNAW past member ID",
		example: [
			2727456
		],
		types: [
		],
		aliases: [
			"Royal Netherlands Academy of Arts and Sciences past member",
			"KNAW past member identifier"
		]
	},
	{
		description: "identifier in the KNApSAcK Core System",
		datatype: "external-id",
		id: "P2064",
		label: "KNApSAcK ID",
		example: [
			6856299,
			20972182
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for each of the Ukrainian administrative units",
		datatype: "external-id",
		id: "P1077",
		label: "KOATUU identifier",
		example: [
			1743602
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for every municipality (town and commune) in Hungary issued by the Hungarian Central Statistical Office",
		datatype: "external-id",
		id: "P939",
		label: "KSH code",
		example: [
			320798,
			1094308
		],
		types: [
		],
		aliases: [
			"HCSO code"
		]
	},
	{
		description: "identifier for player on KSI site",
		datatype: "external-id",
		id: "P6495",
		label: "KSI player ID",
		example: [
			56529732,
			50488652,
			1008379,
			6667419
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the Who's Who database of the Catholic University of Leuven",
		datatype: "external-id",
		id: "P3237",
		label: "KU Leuven person ID",
		example: [
			6169071
		],
		types: [
		],
		aliases: [
			"KU Leuven who's who"
		]
	},
	{
		description: "identifier of member of the Royal Flemish Academy of Belgium for Science and the Arts",
		datatype: "external-id",
		id: "P3887",
		label: "KVAB member ID",
		example: [
			5274123
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the personnel database of the courtiers of the Austrian Habsburg imperial line and the branch lines",
		datatype: "external-id",
		id: "P1818",
		label: "Kaiserhof ID",
		example: [
			1505273
		],
		types: [
		],
		aliases: [
			"KH",
			"Kaiserhof ID"
		]
	},
	{
		description: "identifier in the global Kaitai Struct formats repository",
		datatype: "external-id",
		id: "P4460",
		label: "Kaitai Struct format gallery ID",
		example: [
			243303,
			178051,
			751800
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a creative work on Kanopy",
		datatype: "external-id",
		id: "P7985",
		label: "Kanopy ID",
		example: [
			535628,
			163868,
			16996794
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the Kansallisbiografia (National Biography of Finland)",
		datatype: "external-id",
		id: "P2180",
		label: "Kansallisbiografia ID",
		example: [
			256001,
			29721
		],
		types: [
		],
		aliases: [
			"National Biography of Finland ID"
		]
	},
	{
		description: "identifier for a structure or building in the Kansas Historic Resources Inventory database",
		datatype: "external-id",
		id: "P8616",
		label: "Kansas Historic Resources Inventory ID",
		example: [
			14689510,
			48847626,
			6783730
		],
		types: [
		],
		aliases: [
			"KHRI ID"
		]
	},
	{
		description: "identifier for an athlete on the Kansas Sports Hall of Fame website",
		datatype: "external-id",
		id: "P4366",
		label: "Kansas Sports Hall of Fame ID",
		example: [
			5262533,
			5523124
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an entry on the Kansaspedia website",
		datatype: "external-id",
		id: "P7687",
		label: "Kansaspedia ID",
		example: [
			4087333,
			15492944,
			5583561,
			373886
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Kansapedia ID"
		]
	},
	{
		description: "identifier for karatekas in the Karate Records database",
		datatype: "external-id",
		id: "P2705",
		label: "Karate Records ID",
		example: [
			977616,
			958114
		],
		types: [
		],
		aliases: [
			"KarateRec ID",
			"KarateRec.com ID"
		]
	},
	{
		description: "code describing the hazards of a chemical in transport",
		datatype: "external-id",
		id: "P700",
		label: "Kemler code",
		example: [
			407577
		],
		types: [
			"related to chemistry"
		],
		aliases: [
			"Hazard Identification Number",
			"HIN"
		]
	},
	{
		description: "identifier for a school situated in Kerala",
		datatype: "external-id",
		id: "P7065",
		label: "Kerala state school code",
		example: [
			64091705,
			64091018,
			64690560
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "username in the cryptographic social network Keybase",
		datatype: "external-id",
		id: "P6837",
		label: "Keybase username",
		example: [
			14956410,
			62849,
			15136093
		],
		types: [
		],
		aliases: [
			"Keybase.io username",
			"Keybase ID"
		]
	},
	{
		description: "identifier for a school (usually government-affiliated) in the province of Khyber Pakhtunkhwa",
		datatype: "external-id",
		id: "P6957",
		label: "Khyber Pakhtunkhwa EMIS code",
		example: [
			25230706
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Khyber Pakhtunkhwa Education Management Information System code"
		]
	},
	{
		description: "numeric identifier for an association football player at kicker.de",
		datatype: "external-id",
		id: "P6615",
		label: "Kicker.de player ID (former scheme)",
		example: [
			1624510,
			151269,
			17580386,
			432932
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a project on the Kickstarter crowdfunding platform",
		datatype: "external-id",
		id: "P8019",
		label: "Kickstarter project ID",
		example: [
			5164863,
			3808860,
			581039
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a street of Kiev",
		datatype: "external-id",
		id: "P1854",
		label: "Kiev street code",
		example: [
			1076911
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Dutch media content rating system",
		datatype: "wikibase-item",
		id: "P2684",
		label: "Kijkwijzer rating",
		example: [
			16467423
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in Killer List of Videogames",
		datatype: "external-id",
		id: "P2858",
		label: "Killer List of Videogames ID",
		example: [
			173626
		],
		types: [
		],
		aliases: [
			"arcade-museum.com",
			"KLOV ID"
		]
	},
	{
		description: "identifier of an article on Kindred Britain",
		datatype: "external-id",
		id: "P3051",
		label: "Kindred Britain ID",
		example: [
			692,
			8016,
			40909,
			5536493,
			3044
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Database about Films adaptations of literary work (18th and 19th century)",
		datatype: "external-id",
		id: "P7458",
		label: "Kinematoscope film ID",
		example: [
			2824760,
			1780602
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "database of film adaptations of literary work (18th and 19th century)",
		datatype: "external-id",
		id: "P7484",
		label: "Kinematoscope film director ID",
		example: [
			724276,
			51123,
			263367
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "Database about Films adaptations of literary work (18th and 19th century)",
		datatype: "external-id",
		id: "P7487",
		label: "Kinematoscope literary work ID",
		example: [
			339761,
			649013,
			1373644
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "Database about Films adaptations of literary work (18th and 19th century)",
		datatype: "external-id",
		id: "P7485",
		label: "Kinematoscope writer ID",
		example: [
			9711,
			213675,
			3816
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a movie at Kino-teatr.ua",
		datatype: "external-id",
		id: "P5311",
		label: "Kino-teatr.ua film ID",
		example: [
			25431158
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person at Kino-teatr.ua",
		datatype: "external-id",
		id: "P5312",
		label: "Kino-teatr.ua person ID",
		example: [
			192682,
			276005,
			39666
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of a cinema described on the website Kinoliste.com",
		datatype: "external-id",
		id: "P4981",
		label: "Kinoliste ID",
		example: [
			50821779
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film/movie in the Russian Kinopoisk.ru database",
		datatype: "external-id",
		id: "P2603",
		label: "Kinopoisk film ID",
		example: [
			19347291,
			80044
		],
		types: [
		],
		aliases: [
			"Kinopoisk movie ID",
			"Kinopoisk video ID"
		]
	},
	{
		description: "identifier for a person in the Kinopoisk.ru database",
		datatype: "external-id",
		id: "P2604",
		label: "Kinopoisk person ID",
		example: [
			38111,
			383541,
			1738018
		],
		types: [
		],
		aliases: [
			"Kinopoisk actor ID"
		]
	},
	{
		description: "identifier for films in the German Kinopolis database",
		datatype: "external-id",
		id: "P2970",
		label: "Kinopolis film ID",
		example: [
			44578,
			15965953
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of biographical article at Sergei Nikolaev's project Kinosozvezdie",
		datatype: "external-id",
		id: "P6741",
		label: "Kinosozvezdie biography ID",
		example: [
			4166965,
			4503736,
			764546
		],
		types: [
		],
		aliases: [
			"Kinosozvezdie actor ID"
		]
	},
	{
		description: "number in the Kinsky–Halm Catalogue of the works of Ludwig van Beethoven, which do not have opus numbers, or are fragmentary",
		datatype: "external-id",
		id: "P7161",
		label: "Kinsky–Halm Catalogue",
		example: [
			8076022,
			166550,
			166173
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "Kirshenbaum symbol for a IPA phoneme",
		datatype: "string",
		id: "P3625",
		label: "Kirshenbaum code",
		example: [
			518603
		],
		types: [
			"with datatype string that is not an external identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for minerals, rocks, mineral resources at kivid.info",
		datatype: "external-id",
		id: "P7348",
		label: "Kivid.info ID",
		example: [
			415831,
			354025,
			3131070
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "German classification of occupations 2010",
		datatype: "external-id",
		id: "P1021",
		label: "KldB-2010 occupation code",
		example: [
			508846
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of an article in Klexikon",
		datatype: "external-id",
		id: "P6573",
		label: "Klexikon article ID",
		example: [
			339,
			3314483,
			11768
		],
		types: [
		],
		aliases: [
			"Klexikon article name"
		]
	},
	{
		description: "entry in the Germania Sacra Klosterdatenbank",
		datatype: "external-id",
		id: "P3407",
		label: "Klosterdatenbank ID",
		example: [
			1646116
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for law in Knesset site",
		datatype: "external-id",
		id: "P7390",
		label: "Knesset Law ID",
		example: [
			12410683,
			12407344,
			25487972
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "link from mathematical knot/link articles to authoritative information source Knot Atlas",
		datatype: "external-id",
		id: "P8426",
		label: "Knot Atlas identifier",
		example: [
			1188344,
			96632000
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier used to link to the KnotInfo website entry for a knot",
		datatype: "external-id",
		id: "P8427",
		label: "Knotinfo identifier",
		example: [
			1188344,
			4544970,
			168620,
			168697,
			94806552
		],
		types: [
		],
		aliases: [
			"Knotinfo ID"
		]
	},
	{
		description: "Wikidata property for an identifier",
		datatype: "external-id",
		id: "P6760",
		label: "Know Your Meme ID",
		example: [
			128450,
			83103,
			1136
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Know Your Meme entry",
			"KYM entry",
			"KYM ID"
		]
	},
	{
		description: "ID of a player at KHL.ru",
		datatype: "external-id",
		id: "P3652",
		label: "Kontinental Hockey League player ID",
		example: [
			587994
		],
		types: [
		],
		aliases: [
			"KHL player ID"
		]
	},
	{
		description: "identifier for an association football (soccer) player at Kooora.com (in Arabic) and Goalzz.com (in English)",
		datatype: "external-id",
		id: "P8021",
		label: "Kooora/Goalzz player ID",
		example: [
			403437,
			2160925,
			27562798
		],
		types: [
		],
		aliases: [
			"Goalzz player ID",
			"Kooora player ID"
		]
	},
	{
		description: "identifier for an entry in the online version of 'Dictionary of Foreign Words and Foreign-language Phrases' by Władysław Kopaliński",
		datatype: "external-id",
		label: "Kopaliński Online ID",
		id: "P5533",
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier on the Munzinger Archiv",
		datatype: "external-id",
		id: "P1288",
		label: "Kritisches Lexikon der Gegenwartsliteratur ID",
		example: [
			70300
		],
		types: [
		],
		aliases: [
			"KLG ID",
			"KLG Kritisches Lexikon der Gegenwartsliteratur ID"
		]
	},
	{
		description: "identifier in the critical dictionary of foreign contemporary literature",
		datatype: "external-id",
		id: "P1289",
		label: "Kritisches Lexikon zur fremdsprachigen Gegenwartsliteratur ID",
		example: [
			313001,
			163118
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"KLfG ID"
		]
	},
	{
		description: "link to article of Russian-language online encyclopedia",
		datatype: "external-id",
		id: "P6385",
		label: "Krugosvet article",
		example: [
			1943650,
			5372,
			922480
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for people, places, events, etc. used by some Nordic museums",
		datatype: "external-id",
		id: "P1248",
		label: "KulturNav-ID",
		example: [
			959698,
			60195569
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "object identifier in Kulturelles Erbe Köln",
		datatype: "external-id",
		id: "P4582",
		label: "Kulturelles Erbe Köln object ID",
		example: [
			20536671,
			2174943
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Norwegian heritage property identification number of Riksantikvaren (the Directorate for Cultural Heritage)",
		datatype: "external-id",
		id: "P758",
		label: "Kulturminne ID",
		example: [
			755010,
			118752
		],
		types: [
		],
		aliases: [
			"Lokalitets ID",
			"Kulturminne identifier",
			"Norwegian Directorate for Cultural Heritage database ID"
		]
	},
	{
		description: "unique artist identifier used by Kunstindeks Danmark",
		datatype: "external-id",
		id: "P1138",
		label: "Kunstindeks Danmark Artist ID",
		example: [
			83578,
			435149
		],
		types: [
		],
		aliases: [
			"KID ID",
			"KID",
			"KID artist ID"
		]
	},
	{
		description: "identifier for artwork in the Danish art database",
		datatype: "external-id",
		id: "P2108",
		label: "Kunstindeks Danmark artwork ID",
		example: [
			20973150
		],
		types: [
		],
		aliases: [
			"KID artwork ID"
		]
	},
	{
		description: "identifier of a company in the Dutch KvK Business Register",
		datatype: "external-id",
		id: "P3220",
		label: "KvK company ID",
		example: [
			2406378
		],
		types: [
		],
		aliases: [
			"Dutch Organization Number",
			"Netherlands Organization Number"
		]
	},
	{
		description: "identifier of a film (movie) in the Icelandic film database kvikmyndir.is",
		datatype: "external-id",
		id: "P3340",
		label: "Kvikmyndir film ID",
		example: [
			3130121,
			698111
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person in the Icelandic film database kvikmyndir.is",
		datatype: "external-id",
		id: "P3341",
		label: "Kvikmyndir person ID",
		example: [
			3441908,
			65116,
			76711
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "indicates the characteristic climate of a place",
		datatype: "wikibase-item",
		id: "P2564",
		label: "Köppen climate classification",
		example: [
			62,
			17070
		],
		types: [
			"for places"
		],
		aliases: [
		]
	},
	{
		description: "identifier on 'L'Encyclopédie philosophique'",
		datatype: "external-id",
		id: "P6223",
		label: "L'Encyclopédie philosophique ID",
		example: [
			9312,
			58586,
			9406
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the website of L'Express",
		datatype: "external-id",
		id: "P6620",
		label: "L'Express person ID",
		example: [
			3133201,
			20807844,
			984375
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on the L'Officiel des spectacles website",
		datatype: "external-id",
		id: "P8637",
		label: "L'Officiel des spectacles ID",
		example: [
			55128479,
			1479960,
			97366433
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of a football player by L'Équipe",
		datatype: "external-id",
		id: "P3665",
		label: "L'Équipe football player ID",
		example: [
			4210878,
			1929
		],
		types: [
		],
		aliases: [
			"lequipe.fr football player ID"
		]
	},
	{
		description: "identifier for an author on the Infocentre littéraire des écrivains website",
		datatype: "external-id",
		id: "P5532",
		label: "L'île author ID",
		example: [
			55689104,
			3164663,
			55689144
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "semi-scientific classification system for catfish from the Loricariidae family",
		datatype: "external-id",
		id: "P7291",
		label: "L-number",
		example: [
			4865994,
			4865994,
			4865994,
			4865994,
			5527917,
			6409729
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist or an artwork on the Los Angeles County Museum of Art website",
		datatype: "external-id",
		id: "P4611",
		label: "LACMA ID",
		example: [
			7836,
			1061035
		],
		types: [
		],
		aliases: [
			"Los Angeles County Museum of Art ID"
		]
	},
	{
		description: "identifier for a contributor on the Los Angeles Review of Books website",
		datatype: "external-id",
		id: "P5639",
		label: "LARB contributor ID",
		example: [
			6760780,
			4727513,
			6380615
		],
		types: [
		],
		aliases: [
			"Los Angeles Review of Books contributor ID"
		]
	},
	{
		description: "identifier for a local administrative unit, renamed from NUTS 4 and NUTS 5. Format: 2 letters followed by digits",
		datatype: "external-id",
		id: "P782",
		label: "LAU",
		example: [
			804356,
			850676,
			472,
			806817
		],
		types: [
		],
		aliases: [
			"local administrative unit"
		]
	},
	{
		description: "identifier for bodies of water in Germany according to the Bund/Länder-Arbeitsgemeinschaft Wasser (LAWA)",
		datatype: "external-id",
		id: "P3866",
		label: "LAWA waterbody ID",
		example: [
			584,
			1616544
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID in series of dossier on the company and people by LB.ua",
		datatype: "external-id",
		id: "P6980",
		label: "LB.ua dossier ID",
		example: [
			16714996,
			54860605,
			4163253,
			1186724,
			246959
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person, on Lord Byron and his Times website",
		datatype: "external-id",
		id: "P2977",
		label: "LBT person ID",
		example: [
			315346,
			273708
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "subject headings for public libraries maintained by the Spanish Ministry of Education, Culture and Sport",
		datatype: "string",
		id: "P920",
		label: "LEM ID",
		example: [
			5891
		],
		types: [
		],
		aliases: [
			"LEMb ID",
			"LEMBP ID",
			"Lista de Encabezamientos para Bibliotecas Públicas ID",
			"Lista de Encabezamientos para Bibliotecas Publicas ID",
			"Spanish subject headings for public libraries ID"
		]
	},
	{
		description: "identifier for a female basketball player on the Ligue féminine de basket website",
		datatype: "external-id",
		id: "P4382",
		label: "LFB player ID",
		example: [
			6471142,
			299943
		],
		types: [
		],
		aliases: [
			"Ligue féminine de basket player ID"
		]
	},
	{
		description: "identifier for a player on the website of the French Ligue Féminine de Handball (LFH)",
		datatype: "external-id",
		id: "P4289",
		label: "LFH player ID",
		example: [
			36697190,
			27975446
		],
		types: [
		],
		aliases: [
			"Ligue Féminine de Handball player ID"
		]
	},
	{
		description: "identifier for a football player on the Ligue de Football Professionnel website",
		datatype: "external-id",
		id: "P3683",
		label: "LFP player ID",
		example: [
			957465,
			41225846
		],
		types: [
		],
		aliases: [
			"LFP.fr player ID",
			"Ligue1.com player ID"
		]
	},
	{
		description: "identifier in LGBT Danmark's online dictionary",
		datatype: "external-id",
		id: "P8285",
		label: "LGBT Danmark online dictionary ID",
		example: [
			52746927,
			724351
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a character entry on LGBT fans deserve better database",
		datatype: "external-id",
		id: "P6780",
		label: "LGBTFansDB character ID",
		example: [
			2337146,
			774719,
			23908728,
			2715425,
			3657317,
			2233031,
			61976512,
			10375174,
			2567177,
			937126,
			1042244
		],
		types: [
		],
		aliases: [
			"LGBT fans deserve better character ID"
		]
	},
	{
		description: "code used by the Local Government Directory, a website run by the Government of India, which maintains directory of rural and urban local governments in India and their political territorial entities",
		datatype: "external-id",
		id: "P6425",
		label: "LGD local body code",
		example: [
			60882927,
			548210,
			709298
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an emulator in the Linux Game Database",
		datatype: "external-id",
		id: "P5117",
		label: "LGDB emulator ID",
		example: [
			1054055
		],
		types: [
		],
		aliases: [
			"Linux Game Database emulator ID"
		]
	},
	{
		description: "identifier for a game engine in the Linux Game Database",
		datatype: "external-id",
		id: "P5119",
		label: "LGDB engine ID",
		example: [
			1196014
		],
		types: [
		],
		aliases: [
			"Linux Game Database engine ID"
		]
	},
	{
		description: "identifier for a game in the Linux Game Database",
		datatype: "external-id",
		id: "P5116",
		label: "LGDB game ID",
		example: [
			214142
		],
		types: [
		],
		aliases: [
			"Linux Game Database game ID"
		]
	},
	{
		description: "identifier for a software tool in the Linux Game Database",
		datatype: "external-id",
		id: "P5118",
		label: "LGDB tool ID",
		example: [
			7187399
		],
		types: [
		],
		aliases: [
			"Linux Game Database tool ID"
		]
	},
	{
		description: "identifier for the items in the libris-catalogue of the Royal Swedish Library about specific publications",
		datatype: "external-id",
		id: "P1182",
		label: "LIBRIS editions",
		example: [
			15822873
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "background information on organizations, political parties, biographies of famous people",
		datatype: "external-id",
		id: "P6210",
		label: "LIGA profile",
		example: [
			4274589,
			212268,
			1122797
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "user ID on LINE BLOG",
		datatype: "external-id",
		id: "P7211",
		label: "LINE BLOG user ID",
		example: [
			1155646,
			47925,
			60988562
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"LINE BLOG user identifier"
		]
	},
	{
		description: "identifier used in the LIPID MAPS database for lipids",
		datatype: "external-id",
		id: "P2063",
		label: "LIPID MAPS ID",
		example: [
			410888,
			2815995
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a basketball player on the official website of the Lietuvos krepšinio lyga, the main league in Lithuania",
		datatype: "external-id",
		id: "P4612",
		label: "LKL player ID",
		example: [
			7849155,
			16474985
		],
		types: [
		],
		aliases: [
			"Lietuvos krepšinio lyga player ID"
		]
	},
	{
		description: "identifier for a coach in the French basketball championship",
		datatype: "external-id",
		id: "P6743",
		label: "LNB Coach id",
		example: [
			3474586,
			1085736,
			3367377
		],
		types: [
		],
		aliases: [
			"LNB Pro A coach ID"
		]
	},
	{
		description: "identifier assigned by the National Library of Latvia",
		datatype: "external-id",
		id: "P1368",
		label: "LNB ID",
		example: [
			615419,
			33977
		],
		types: [
		],
		aliases: [
			"LNB identifier",
			"National Library of Latvia identifier"
		]
	},
	{
		description: "identifier for a player in the Ligue Nationale de Basket-ball (LNB) Pro A webpages",
		datatype: "external-id",
		id: "P4216",
		label: "LNB Pro A player ID",
		example: [
			535652,
			3190767
		],
		types: [
		],
		aliases: [
			"Pro A player ID"
		]
	},
	{
		description: "identifier for a player on the Ligue Nationale de Handball (LNH) website",
		datatype: "external-id",
		id: "P4192",
		label: "LNH player ID",
		example: [
			20961816,
			16683254
		],
		types: [
		],
		aliases: [
			"Ligue Nationale de Handball player ID"
		]
	},
	{
		description: "identifier for a player on the French Ligue nationale de volley websiste",
		datatype: "external-id",
		id: "P4281",
		label: "LNV player ID",
		example: [
			27758374,
			19843685
		],
		types: [
		],
		aliases: [
			"Ligue nationale de volley player ID"
		]
	},
	{
		description: "identifier for a writer on the Library of America website",
		datatype: "external-id",
		id: "P5618",
		label: "LOA ID",
		example: [
			257953,
			379580,
			187019
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for medical observations, measurements, and documents in the Regenstrief Institute's Logical Observation Identifiers Names and Codes (LOINC), a database of internationalized medical terminology",
		datatype: "external-id",
		id: "P4338",
		label: "LOINC ID",
		example: [
			1778909,
			311213
		],
		types: [
			"related to medicine",
			"representing a unique identifier"
		],
		aliases: [
			"Logical Observation Identifiers Names and Codes ID"
		]
	},
	{
		description: "identifier for a person on the LONSEA site",
		datatype: "external-id",
		id: "P5306",
		label: "LONSEA ID",
		example: [
			336268,
			3972418
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a golf player, in the LPGA database",
		datatype: "external-id",
		id: "P2810",
		label: "LPGA Tour golf player ID",
		example: [
			2361213
		],
		types: [
		],
		aliases: [
			"LPGA Tour ID"
		]
	},
	{
		description: "URL for the website List of Prokaryotic names with Standing in Nomenclature (LPSN)",
		datatype: "url",
		id: "P1991",
		label: "LPSN URL",
		example: [
			15732012,
			2264864
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a contributor on the London Review of Books website",
		datatype: "external-id",
		id: "P5502",
		label: "LRB contributor ID",
		example: [
			156268,
			528840,
			6113241
		],
		types: [
		],
		aliases: [
			"London Review of Books ID",
			"London Review of Books contributor ID",
			"LRB ID"
		]
	},
	{
		description: "Localbody code (political territorial entity) in Local Self Government Department (Kerala) site",
		datatype: "external-id",
		id: "P8573",
		label: "LSG localbody code",
		example: [
			13110136,
			13112589,
			13111598,
			98271150,
			7785507
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a Korean writer, book, and event in Literature Translation Institute of Korea Library (library.klti.or.kr)",
		datatype: "external-id",
		id: "P4760",
		label: "LTI Korea Library ID",
		example: [
			494036,
			44366
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique number of a protected area in the German state of Baden-Württemberg",
		datatype: "external-id",
		id: "P5965",
		label: "LUBW Protected Area No",
		example: [
			54313423,
			54314517,
			54315681
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of a film director in the LUMIERE database of the European Audiovisual Observatory",
		datatype: "external-id",
		id: "P4283",
		label: "LUMIERE director ID",
		example: [
			55171,
			28831552
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of a film in the LUMIERE database of the European Audiovisual Observatory",
		datatype: "external-id",
		id: "P4282",
		label: "LUMIERE film ID",
		example: [
			19816400
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a writer on the Lorraine des écrivains website",
		datatype: "external-id",
		id: "P5700",
		label: "La Lorraine des écrivains writer ID",
		example: [
			472613,
			3587946,
			2851251
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the online biographical dictionary of the French 'Comité pour d'Histoire de la Poste'",
		datatype: "external-id",
		id: "P4822",
		label: "La Poste personality ID",
		example: [
			33199843,
			3079081,
			47532433
		],
		types: [
		],
		aliases: [
			"La Poste ID",
			"Laposte ID"
		]
	},
	{
		description: "identifier of an author on La Vie des idées",
		datatype: "external-id",
		id: "P5550",
		label: "La Vie des idées ID",
		example: [
			2966146,
			3490892,
			2093915
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a player at the LaPreferente.com site",
		datatype: "external-id",
		id: "P7359",
		label: "LaPreferente.com player ID",
		example: [
			1873999,
			54835,
			3187831
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "record label identifier code issued by Gesellschaft zur Verwertung von Leistungsschutzrechten (GVL)",
		datatype: "external-id",
		id: "P7320",
		label: "Labelcode",
		example: [
			56404384,
			54860,
			212699
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a species in the Lace bugs database",
		datatype: "external-id",
		id: "P6349",
		label: "Lace bugs database ID",
		example: [
			10398240,
			10559022,
			11072745
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a golf player, in the Ladies European Tour database",
		datatype: "external-id",
		id: "P3897",
		label: "Ladies European Tour golf player ID",
		example: [
			25481,
			1792109
		],
		types: [
		],
		aliases: [
			"Ladies European Tour ID"
		]
	},
	{
		description: "identifier for an artist on the Lafonoteca website",
		datatype: "external-id",
		id: "P5295",
		label: "Lafonoteca artist ID",
		example: [
			8963929,
			6460413
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "libration point of an object (default: object-sun-earth)",
		datatype: "wikibase-item",
		id: "P1145",
		label: "Lagrangian point",
		example: [
			767805
		],
		types: [
			"for astronomical objects"
		],
		aliases: [
			"libration point",
			"Lagrange point",
			"L-point"
		]
	},
	{
		description: "Identification code for lakes in Sweden, for lakes important enough also used, with SE- prefix, as EU_CD",
		datatype: "external-id",
		id: "P761",
		label: "Lake ID (Sweden)",
		example: [
			3424558,
			61779786,
			65767965,
			1367814
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "number of a lake in Global Lake Database",
		datatype: "external-id",
		id: "P5866",
		label: "LakeNet ID",
		example: [
			1047206,
			1133271,
			931708
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an article on the online biographical reference work about global cartoonists",
		datatype: "external-id",
		id: "P5035",
		label: "Lambiek Comiclopedia artist ID",
		example: [
			24705,
			60834778
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an entry about comic magazines from Lambiek",
		datatype: "external-id",
		id: "P8644",
		label: "Lambiek comic magazines ID",
		example: [
			1929868,
			1431686
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a member of the Landtag of Liechtenstein",
		datatype: "external-id",
		id: "P4267",
		label: "Landtag of Liechtenstein ID",
		example: [
			1732970,
			28870122
		],
		types: [
		],
		aliases: [
			"Liechtenstein Landtag ID",
			"Landtag.li ID"
		]
	},
	{
		description: "Identifier for a term in the Norwegian language, as given by an entry in the Language Council of Norways termwiki. This is a terminology database for academic disciplines. The terms are usually given as Bokmål, Nynorsk, and English variants.",
		datatype: "external-id",
		id: "P5445",
		label: "Language Council of Norways termwiki ID",
		example: [
			386724,
			36279
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a subject on the 'Encyclopédie Larousse'",
		datatype: "external-id",
		id: "P6058",
		label: "Larousse ID",
		example: [
			9711,
			216958,
			155,
			219825,
			50188,
			698111
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist, group or work, on Last.fm",
		datatype: "external-id",
		id: "P3192",
		label: "Last.fm ID",
		example: [
			2306,
			150901,
			643167,
			6481483
		],
		types: [
		],
		aliases: [
			"LastFM music ID",
			"Lastfm ID"
		]
	},
	{
		description: "identifier of a journal in Latindex",
		datatype: "external-id",
		id: "P3127",
		label: "Latindex ID",
		example: [
			23739791,
			3229252,
			24935648
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "number for the Lattes Platform entry on the person or group. Relationship between entry and subject must be supported by a source",
		datatype: "external-id",
		id: "P1007",
		label: "Lattes Platform number",
		example: [
			10396164,
			10325405
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "National Address Register classifier code (State Land Service of the Republic of Latvia)",
		datatype: "external-id",
		id: "P2497",
		label: "Latvian National Address Register ID",
		example: [
			432829
		],
		types: [
		],
		aliases: [
			"Latvian National Address Register identifier"
		]
	},
	{
		description: "identifier for an article in the website of the Latvian National Encyclopedia",
		datatype: "external-id",
		id: "P6870",
		label: "Latvian National Encyclopedia Online ID",
		example: [
			3504809,
			6691,
			2503249
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person in the database of the Latvian Olympic Committee (Latvian: Latvijas Olimpiskā Komiteja, LOK)",
		datatype: "external-id",
		id: "P2593",
		label: "Latvian Olympic Committee athlete ID",
		example: [
			520234,
			2663228
		],
		types: [
		],
		aliases: [
			"LOK athlete ID",
			"Latvijas Olimpiskā Komiteja athlete ID"
		]
	},
	{
		description: "identifier for geographical territories under special state-level protection in Latvia",
		datatype: "external-id",
		id: "P4029",
		label: "Latvian Protected Nature Territory ID",
		example: [
			864764
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "URL of official information pages about Latvian Protected Nature Territories from Nature Conservation Agency",
		datatype: "url",
		id: "P4001",
		label: "Latvian Protected Nature Territory URL",
		example: [
			28466010
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of the cultural heritage on http://saraksts.mantojums.lv/",
		datatype: "external-id",
		id: "P2494",
		label: "Latvian cultural heritage register ID",
		example: [
			2512369
		],
		types: [
		],
		aliases: [
			"Latvian cultural heritage register identifier",
			"Latvian cultural heritage ID"
		]
	},
	{
		description: "Latvian Geospatial Information Agency geographical names database identifier",
		datatype: "external-id",
		id: "P2496",
		label: "Latvian toponymic names database ID",
		example: [
			15219939
		],
		types: [
		],
		aliases: [
			"Latvian toponymic names database identifier",
			"Latvian toponymic names ID"
		]
	},
	{
		description: "transcription of name in Latvian orthography",
		datatype: "string",
		id: "P8046",
		label: "Latvian transcription",
		example: [
			428024,
			83385239,
			568872,
			18031774,
			1261347,
			804970
		],
		types: [
			"for romanization system"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a legal entity in Latvia",
		datatype: "external-id",
		id: "P8053",
		label: "Latvian unified registration number",
		example: [
			3736450,
			72585507,
			16361579
		],
		types: [
		],
		aliases: [
			"Latvian URN"
		]
	},
	{
		description: "identifier of a video game developer in the LaunchBox Games Database",
		datatype: "external-id",
		id: "P7784",
		label: "LaunchBox Games Database developer ID",
		example: [
			739552,
			735267,
			55085218
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the LaunchBox Games Database",
		datatype: "external-id",
		id: "P7785",
		label: "LaunchBox Games Database game ID",
		example: [
			276217,
			618610,
			1800173
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game platform in the LaunchBox Games Database",
		datatype: "external-id",
		id: "P7809",
		label: "LaunchBox Games Database platform ID",
		example: [
			229429,
			253044,
			11232199,
			3046263,
			94
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game publisher in the LaunchBox Games Database",
		datatype: "external-id",
		id: "P7810",
		label: "LaunchBox Games Database publisher ID",
		example: [
			739552,
			173941,
			11709677,
			617752
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an official Launchpad repository (\"project\") for a software application",
		datatype: "external-id",
		id: "P3802",
		label: "Launchpad.net project ID",
		example: [
			8041,
			1252773
		],
		types: [
			"for software"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on the Laut.de website",
		datatype: "external-id",
		id: "P5356",
		label: "Laut.de artist ID",
		example: [
			58735,
			493637
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "the website URL code for the Laws & Regulations Database of the Republic of China",
		datatype: "external-id",
		id: "P7242",
		label: "Laws & Regulations Database of the Republic of China ID",
		example: [
			213099,
			10876328,
			18865501
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a film (movie) in the Lexikon des Internationalen Films (Lexicon of International Films)",
		datatype: "external-id",
		id: "P3107",
		label: "LdiF ID",
		example: [
			161196,
			2345,
			20444585
		],
		types: [
		],
		aliases: [
			"LdIF ID",
			"Lexikon des internationalen Films",
			"LdiF film-id"
		]
	},
	{
		description: "identifier for an artist in the Delarge dictionary",
		datatype: "external-id",
		id: "P1988",
		label: "Le Delarge ID",
		example: [
			3560717,
			558
		],
		types: [
		],
		aliases: [
			"Le Dictionnaire des arts plastiques modernes et contemporains ID",
			"Delarge ID"
		]
	},
	{
		description: "identifier for a topic on the website of Le Figaro",
		datatype: "external-id",
		id: "P6621",
		label: "Le Figaro tag ID",
		example: [
			1726930,
			268634,
			794
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a topic on the Le Monde website",
		datatype: "external-id",
		id: "P5558",
		label: "Le Monde ID",
		example: [
			2105,
			20716,
			77
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a topic in the French newspaper Le Monde diplomatique",
		datatype: "external-id",
		id: "P3612",
		label: "Le Monde diplomatique subject ID",
		example: [
			7825,
			51
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a topic on the website of Le Parisien",
		datatype: "external-id",
		id: "P6622",
		label: "Le Parisien tag ID",
		example: [
			2980738,
			29210910,
			405
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P6664",
		label: "Le Vif tag ID",
		example: [
			55649583,
			12969
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an hotel on the Leading Hotels of the World website",
		datatype: "external-id",
		id: "P5834",
		label: "Leading Hotels of the World hotel ID",
		example: [
			3145551,
			1375672,
			3210501
		],
		types: [
		],
		aliases: [
			"LHW hotel ID"
		]
	},
	{
		description: "identifier for a chemical compound in leadscope.com",
		datatype: "external-id",
		id: "P2083",
		label: "Leadscope ID",
		example: [
			2815995
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "authority control identifier of the Lebanese National Library",
		datatype: "external-id",
		id: "P7026",
		label: "Lebanese National Library ID",
		example: [
			19185,
			115243
		],
		types: [
		],
		aliases: [
			"LNL ID"
		]
	},
	{
		description: "identifier for a volleyball player on the Lega Pallavolo Serie A  Femminile website",
		datatype: "external-id",
		id: "P4259",
		label: "Lega Pallavolo Serie A Femminile player ID",
		example: [
			3336263,
			3497926
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a volleyball player on the Lega Pallavolo Serie A website",
		datatype: "external-id",
		id: "P4303",
		label: "Lega Pallavolo Serie A player ID",
		example: [
			20740986,
			3417269
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a soccer player in the Lega Serie A website",
		datatype: "external-id",
		id: "P5339",
		label: "Lega Serie A soccer player ID",
		example: [
			15984451,
			795017
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a soccer team in the Lega Serie A website",
		datatype: "external-id",
		id: "P5424",
		label: "Lega Serie A team ID",
		example: [
			2768
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a coach at legabasket.it",
		datatype: "external-id",
		id: "P5612",
		label: "LegaBasket.it coach ID",
		example: [
			4017902,
			971504,
			2253587
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a player at legabasket.it",
		datatype: "external-id",
		id: "P5476",
		label: "LegaBasket.it player ID",
		example: [
			10345591,
			1332856
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person, in University College London's 'Legacies of British Slave-ownership' project",
		datatype: "external-id",
		id: "P3023",
		label: "Legacies of British Slave-ownership person ID",
		example: [
			5540581,
			442902,
			6264103
		],
		types: [
		],
		aliases: [
			"LBS person ID",
			"British Slave-ownership person ID",
			"LBS ID"
		]
	},
	{
		description: "identifier for a physical item in the Legacies of British Slave-Ownership database",
		datatype: "external-id",
		id: "P8587",
		label: "Legacies of British Slave-ownership place ID",
		example: [
			17548373,
			98381232,
			1981760
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for newspapers that have their obituaries indexed on Legacy.com",
		datatype: "external-id",
		id: "P8507",
		label: "Legacy.com newspaper ID",
		example: [
			7712726,
			7571091
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person's obituary on Legacy.com",
		datatype: "external-id",
		id: "P8367",
		label: "Legacy.com person ID",
		example: [
			2134183,
			30308881
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a legally distinct entity per ISO 17442",
		datatype: "external-id",
		id: "P1278",
		label: "Legal Entity Identifier",
		example: [
			2283,
			16574093
		],
		types: [
		],
		aliases: [
			"Global Legal Entity Identifier",
			"LEI",
			"ISO 17442 code",
			"Legal Entity ID",
			"GLEI"
		]
	},
	{
		description: "unique identifier of a Lego brick design",
		datatype: "external-id",
		label: "Lego design ID",
		id: "P6247",
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "unique identifier of a Lego brick design with a specific colour",
		datatype: "external-id",
		label: "Lego element ID",
		id: "P6248",
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "unique identifier of a Lego set",
		datatype: "external-id",
		id: "P6187",
		label: "Lego set ID",
		example: [
			58789915
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Leidse Hoogleraren, a catalogue of University Professors of Leiden University since 1575",
		datatype: "external-id",
		id: "P2861",
		label: "Leidse Hoogleraren ID",
		example: [
			12989630
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Lemon 64 database of Commodore 64 videogames",
		datatype: "external-id",
		id: "P4816",
		label: "Lemon 64 identifier",
		example: [
			757862
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Lemon 64 ID"
		]
	},
	{
		description: "identifier in the Lemon Amiga database of Amiga videogames",
		datatype: "external-id",
		id: "P4846",
		label: "Lemon Amiga identifier",
		example: [
			7577489,
			2121419
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for documents in the Lens.org catalog (patents, articles)",
		datatype: "external-id",
		id: "P7100",
		label: "Lens ID",
		example: [
			26707522,
			44309585
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the members' database of the Leopoldina – German Academy of Sciences",
		datatype: "external-id",
		id: "P3413",
		label: "Leopoldina member ID",
		example: [
			543431
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a Lepidoptera taxon, in the UK Natural History Museum's 'Global Lepidoptera Names Index'",
		datatype: "external-id",
		id: "P3064",
		label: "LepIndex ID",
		example: [
			46160
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Catalogue of Lepidoptera of Belgium",
		datatype: "external-id",
		id: "P5862",
		label: "Lepidoptera of Belgium ID",
		example: [
			27653
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier for an actor/actress/playwright in the Les Archives du spectacle database",
		datatype: "external-id",
		id: "P1977",
		label: "Les Archives du Spectacle Person ID",
		example: [
			106057,
			55418,
			66377
		],
		types: [
		],
		aliases: [
			"Archives du Spectacle Person ID"
		]
	},
	{
		description: "identifier for a participating celebrity in the Enfoiréthèque, the database of Les Enfoirés website",
		datatype: "external-id",
		id: "P5261",
		label: "Les Enfoirés participant ID",
		example: [
			239917,
			180326
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a song in the Enfoiréthèque, the database of Les Enfoirés website",
		datatype: "external-id",
		id: "P5262",
		label: "Les Enfoirés song ID",
		example: [
			708698,
			153202
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a poet on the Les Voix de la poésie website",
		datatype: "external-id",
		id: "P5477",
		label: "Les Voix de la poésie poet ID",
		example: [
			28952282,
			982041,
			50379275
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in \"Les roses cultivées à l'Haÿ en 1902: essai de classement\" by Jules Gravereaux",
		datatype: "external-id",
		id: "P8662",
		label: "Les roses cultivées à l'Haÿ en 1902 ID",
		example: [
			60964948,
			4048501,
			60965128
		],
		types: [
		],
		aliases: [
			"Hay 1902"
		]
	},
	{
		description: "note on LesBiographies.com, a biographical dictionary edited by the Société générale de presse",
		datatype: "external-id",
		id: "P4434",
		label: "LesBiographies.com ID",
		example: [
			984375,
			3296368,
			36205302,
			12969
		],
		types: [
		],
		aliases: [
			"Les Biographies ID",
			"La Documentation permanente ID",
			"Bérard-Quélin ID",
			"EPEPA ID",
			"Le Bérard-Quélin ID",
			"Encyclopédie périodique, économique, politique et administrative ID"
		]
	},
	{
		description: "identifier for an author of Italian literature on the website Letteraturaitaliana.net",
		datatype: "external-id",
		id: "P7331",
		label: "Letteraturaitaliana.net author ID",
		example: [
			240576,
			704179,
			1029676,
			983263
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an actor on the website Letterboxd",
		datatype: "external-id",
		id: "P6119",
		label: "Letterboxd actor ID",
		example: [
			83325,
			180665,
			44063
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film on the website Letterboxd",
		datatype: "external-id",
		id: "P6127",
		label: "Letterboxd film ID",
		example: [
			181795,
			163872,
			83495,
			36479
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a coach at the LevskiSofia.info",
		datatype: "external-id",
		id: "P6410",
		label: "LevskiSofia.info coach ID",
		example: [
			5547156,
			1259148,
			1376437
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a player at the LevskiSofia.info",
		datatype: "external-id",
		id: "P6411",
		label: "LevskiSofia.info player ID",
		example: [
			5547156,
			443770,
			2395647
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Lexicon istoric retic (LIR), Romansh variant of Historical Dictionary of Switzerland",
		datatype: "external-id",
		id: "P886",
		label: "Lexicon istoric retic ID",
		example: [
			688171
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"LIR ID"
		]
	},
	{
		description: "ID for the German encyclopedia of film terms (\"Lexikon der Filmbegriffe\")",
		datatype: "external-id",
		id: "P8188",
		label: "Lexikon der Filmbegriffe ID",
		example: [
			194383,
			177576,
			1630740
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "IDs for actors listed in the LezWatch.TV actor database",
		datatype: "external-id",
		id: "P7105",
		label: "LezWatch.TV actor ID",
		example: [
			16730126,
			199884,
			5648835
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "IDs for characters listed in the LezWatch.TV character database",
		datatype: "external-id",
		id: "P7106",
		label: "LezWatch.TV character ID",
		example: [
			2745195,
			53865444,
			16145383
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID for shows listed in LezWatch.TV show database",
		datatype: "external-id",
		id: "P7107",
		label: "LezWatch.TV show ID",
		example: [
			13098946,
			17014382,
			28059498
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for cultural heritage monuments issued by the Bremen State Office for the Preservation of Monuments",
		datatype: "external-id",
		id: "P4246",
		label: "LfD-HB object ID",
		example: [
			19479
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifer for national heritage sites issued by the Landesamt für Denkmalpflege Sachsen",
		datatype: "external-id",
		id: "P1708",
		label: "LfDS object ID",
		example: [
			18643398
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author on the website Liber Liber",
		datatype: "external-id",
		id: "P7208",
		label: "Liber Liber author ID",
		example: [
			2640854,
			101698,
			1052581,
			3679113
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for libraries and information centers in the Czech Republic",
		datatype: "external-id",
		id: "P6574",
		label: "Libraries & Information Centers in the Czech Republic ID",
		example: [
			9170816,
			10860618,
			12029623
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier issued by the National Library of Australia (see also P1315 for the newer People Australia identifier). VIAF component. Format: 1-12 digits, removing leading zero-padding.",
		datatype: "external-id",
		id: "P409",
		label: "Libraries Australia ID",
		example: [
			436699,
			37103
		],
		types: [
		],
		aliases: [
			"AuCNLKIN",
			"AuCNLKIN ID",
			"AuCNLKIN identifier",
			"Libraries Australia identifier",
			"Australian National Bibliographic Database identifier",
			"NLA Kinetica Service identifier",
			"CNLKIN",
			"CNLKIN identifier",
			"CNL Kinetica Service identifier",
			"NLA (Australia) identifier",
			"NLA (Australia) ID"
		]
	},
	{
		description: "identifier for a library in the Libraries.org database",
		datatype: "external-id",
		id: "P4848",
		label: "Libraries.org ID",
		example: [
			814779,
			22341583,
			26547522,
			6515993,
			193563
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a heading in the Library of Congress Children's Subject Headigns",
		datatype: "external-id",
		id: "P8647",
		label: "Library of Congress Children's Subject Headings ID",
		example: [
			1360,
			25265,
			165318
		],
		types: [
		],
		aliases: [
			"LC Children's Subject Headings ID",
			"Children's Subject Headings ID",
			"LCSHAC ID"
		]
	},
	{
		description: "subject classification identifier used in the Library of Congress Classification system",
		datatype: "external-id",
		id: "P1149",
		label: "Library of Congress Classification",
		example: [
			34749,
			621080,
			8018
		],
		types: [
		],
		aliases: [
			"LoC Classification",
			"LC Classification",
			"LCC",
			"LCCS",
			"LCC Subject Category"
		]
	},
	{
		description: "Library of Congress Classification number assigned to a publication",
		datatype: "string",
		id: "P8360",
		label: "Library of Congress Classification (works and editions)",
		example: [
			17156005,
			17416765,
			18011319
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "record number for entries in the LoC bibliographic catalog (for  authority records use P244)",
		datatype: "external-id",
		id: "P1144",
		label: "Library of Congress Control Number (LCCN) (bibliographic)",
		example: [
			14944010
		],
		types: [
		],
		aliases: [
			"LCCN editions",
			"LoC editions",
			"Library of Congress Control Number (bibliographic)",
			"LC Control Number",
			"LCCN (LoC)",
			"Library of Congress Card Number (bibliographic)",
			"LCCN"
		]
	},
	{
		description: "a system of classification for Cultural Heritage Organizations developed by the Library of Congress",
		datatype: "external-id",
		id: "P3234",
		label: "Library of Congress Cultural Heritage Organizations",
		example: [
			312,
			7603626
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID in the Library of Congress controlled vocabulary for demographic groups",
		datatype: "external-id",
		id: "P4946",
		label: "Library of Congress Demographic Group Terms ID",
		example: [
			1492760
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"LCDGT ID",
			"Demographic Group Terms ID (Library of Congress)",
			"Demographic Group ID (Library of Congress)",
			"LC Demographic Group Terms ID",
			"LoC Demographic Group Terms ID"
		]
	},
	{
		description: "identifier for file formats in the Library of Congress database",
		datatype: "external-id",
		id: "P3266",
		label: "Library of Congress Format Description Document ID",
		example: [
			188199
		],
		types: [
		],
		aliases: [
			"Library of Congress FDD ID",
			"FDD ID",
			"LocFDD ID"
		]
	},
	{
		description: "ID in the Library of Congress controlled vocabulary for genres and forms",
		datatype: "external-id",
		id: "P4953",
		label: "Library of Congress Genre/Form Terms ID",
		example: [
			253137
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Genre/Form Terms ID",
			"LCGFT ID",
			"GFT ID (Library of Congress)",
			"LC Genre/Form Terms ID",
			"LoC Genre/Form Terms ID"
		]
	},
	{
		description: "identifier in the Library of Congress JukeBox database of singers",
		datatype: "external-id",
		id: "P2089",
		label: "Library of Congress JukeBox ID",
		example: [
			2916502,
			1339
		],
		types: [
		],
		aliases: [
			"LOC Jukebox ID",
			"Jukebox ID"
		]
	},
	{
		description: "identifier for a term in the Library of Congress Medium of Performance Thesaurus for Music",
		datatype: "external-id",
		id: "P8516",
		label: "Library of Congress Medium of Performance Thesaurus ID",
		example: [
			51290,
			30903,
			11298102
		],
		types: [
		],
		aliases: [
			"LCMPT ID",
			"Library of Congress Music Medium of Performance Thesaurus ID",
			"Library of Congress Medium of Performance Thesaurus for Music ID"
		]
	},
	{
		description: "Library of Congress identifier for persons, organizations, events, places, titles, and subject headings  [Format: 1-2 specific letters followed by 8-10 digits (see regex). For manifestations of works, use P1144]",
		datatype: "external-id",
		id: "P244",
		label: "Library of Congress authority ID",
		example: [
			5582,
			33384,
			712504,
			61148
		],
		types: [
		],
		aliases: [
			"Library of Congress Name Authority File",
			"Library of Congress Subject Headings",
			"LCAuth identifier",
			"SACO ID",
			"NACO ID",
			"LC/NACO/SACO Authority File ID",
			"LoC identifier",
			"Library of Congress Subject Headings ID",
			"LCSH ID",
			"LoC Authorities ID",
			"LCAuth ID",
			"LCNAF ID",
			"LOC ID"
		]
	},
	{
		description: "Biographical Articles of the Library of Congress of Chile ID",
		datatype: "external-id",
		id: "P5442",
		label: "Library of Congress of Chile person ID",
		example: [
			5942130,
			326
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Reseñas biográficas parlamentarias ID"
		]
	},
	{
		description: "identifier for a federal politician in Canada (by the Library of Parliament)",
		datatype: "external-id",
		id: "P6616",
		label: "Library of Parliament of Canada person ID",
		example: [
			6808691,
			2604970,
			3099714
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Library of Parliament person ID",
			"Library of Parliament ID",
			"ParlInfo ID"
		]
	},
	{
		description: "identifier of a work in the National Library of Argentine Congress",
		datatype: "external-id",
		id: "P2879",
		label: "Library of the National Congress of Argentina ID",
		example: [
			24008412
		],
		types: [
		],
		aliases: [
			"BCNA ID",
			"BCN ID"
		]
	},
	{
		description: "authority control for authors on LibraryThing",
		datatype: "external-id",
		id: "P7400",
		label: "LibraryThing author ID",
		example: [
			64070601,
			5686,
			55944213
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "authority control for series on LibraryThing",
		datatype: "external-id",
		id: "P8513",
		label: "LibraryThing series ID",
		example: [
			8337,
			682339,
			18450006
		],
		types: [
			"for items about works"
		],
		aliases: [
		]
	},
	{
		description: "LibraryThing (LT) control number",
		datatype: "external-id",
		id: "P1085",
		label: "LibraryThing work ID",
		example: [
			786908,
			15991228
		],
		types: [
		],
		aliases: [
			"LT work identifier",
			"LibraryThing work identifier",
			"LT work ID"
		]
	},
	{
		description: "identifier for articles on Libregamewiki",
		datatype: "external-id",
		id: "P6666",
		label: "LibreGameWiki ID",
		example: [
			161234,
			722334,
			214142,
			971909
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Libregamewiki ID",
			"LGW ID"
		]
	},
	{
		description: "identifier for a creative work on Libreflix",
		datatype: "external-id",
		id: "P6614",
		label: "Libreflix ID",
		example: [
			20629223,
			17087021,
			15052343
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "author ID for an author represented at LibriVox",
		datatype: "external-id",
		id: "P1899",
		label: "LibriVox author ID",
		example: [
			2959615,
			276028
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an item in the catalogue of the Swedish National Library",
		datatype: "external-id",
		id: "P5587",
		label: "Libris-URI",
		example: [
			7724,
			202113
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "author identifier used by the LiederNet Archive",
		datatype: "external-id",
		id: "P8234",
		label: "LiederNet author ID",
		example: [
			44403,
			6220138,
			347026
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "composer identifier used by the LiederNet Archive",
		datatype: "external-id",
		id: "P8235",
		label: "LiederNet composer ID",
		example: [
			7351,
			57286
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "song cycle identifier used by the LiederNet Archive",
		datatype: "external-id",
		id: "P8236",
		label: "LiederNet song cycle ID",
		example: [
			765966,
			19893650
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "song text identifier used by the LiederNet Archive",
		datatype: "external-id",
		id: "P8237",
		label: "LiederNet text ID",
		example: [
			27230628,
			19195453,
			19756899
		],
		types: [
			"for items about works"
		],
		aliases: [
		]
	},
	{
		description: "official profile of a female association football (soccer) player from Liga MX Femenil, the top level Mexican league for women",
		datatype: "external-id",
		id: "P6198",
		label: "Liga MX Femenil player ID",
		example: [
			42303877,
			40742806,
			50379701
		],
		types: [
		],
		aliases: [
			"Liga MX female player ID"
		]
	},
	{
		description: "musical notation in LilyPond syntax",
		datatype: "musical-notation",
		id: "P6883",
		label: "LilyPond notation",
		example: [
			20640627,
			46425,
			2541238,
			224169
		],
		types: [
		],
		aliases: [
			"musical notation"
		]
	},
	{
		description: "identifier for an album on Line Music",
		datatype: "external-id",
		id: "P4748",
		label: "Line Music album ID",
		example: [
			45312998
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on Line Music",
		datatype: "external-id",
		id: "P4747",
		label: "Line Music artist ID",
		example: [
			39075630,
			6667429,
			383541
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a language from Linguasphere Observatory",
		datatype: "external-id",
		id: "P1396",
		label: "Linguasphere code",
		example: [
			3798706,
			652
		],
		types: [
			"representing a unique identifier",
			"for items about languages"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a language per Linguist list",
		datatype: "external-id",
		id: "P1232",
		label: "Linguist list code",
		example: [
			4726836,
			6450184,
			7974669
		],
		types: [
			"representing a unique identifier",
			"for items about languages"
		],
		aliases: [
			"multitree code"
		]
	},
	{
		description: "identifier of dataset used by the Linked Open Data Cloud project",
		datatype: "external-id",
		id: "P8605",
		label: "Linked Open Data Cloud identifier",
		example: [
			2013,
			905695,
			5188229,
			2134522
		],
		types: [
			"multi-source external identifier"
		],
		aliases: [
			"LOD ID",
			"LOD Cloud ID"
		]
	},
	{
		description: "identifier for an official company, school, or organisation page, on LinkedIn",
		datatype: "external-id",
		id: "P4264",
		label: "LinkedIn company ID",
		example: [
			8766,
			213660
		],
		types: [
		],
		aliases: [
			"LinkedIn organisation ID",
			"LinkedIn ID (company)",
			"LICID",
			"LinkedIn school ID",
			"LinkedIn edu ID",
			"Linked In company ID"
		]
	},
	{
		description: "identifier for a person, on the LinkedIn website",
		datatype: "external-id",
		id: "P6634",
		label: "LinkedIn personal profile ID",
		example: [
			240933,
			50308926,
			42310145
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Linked In personal profile ID"
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P8281",
		label: "Liszt Academy Lexikon person ID",
		example: [
			14836168,
			41309
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in Litchfield Ledger database",
		datatype: "external-id",
		id: "P6362",
		label: "Litchfield Ledger ID",
		example: [
			179090,
			207191,
			1151173,
			455133
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Armiarma basque literature on-line database identifier",
		datatype: "external-id",
		id: "P5985",
		label: "Literaturaren Zubitegia ID",
		example: [
			11909473,
			12263621,
			12260021
		],
		types: [
		],
		aliases: [
			"Armiarma ID"
		]
	},
	{
		description: "identifier for an author on the Literature Ireland website",
		datatype: "external-id",
		id: "P5542",
		label: "Literature Ireland ID",
		example: [
			4768599,
			3667278,
			3322810
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Lithostratigraphic database of Germany maintained by the BGR",
		datatype: "external-id",
		id: "P731",
		label: "Litholex ID",
		example: [
			10640572
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for football player on site Lithuanian Football Encyclopedia",
		datatype: "external-id",
		id: "P7742",
		label: "Lithuanian Football Encyclopedia player ID",
		example: [
			926684,
			1395261,
			394372,
			2656866
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for athlete on website of the Lithuanian National Olympic Committee (in Lithuanian: Lietuvos tautinis olimpinis komitetas, LTOK)",
		datatype: "external-id",
		id: "P4061",
		label: "Lithuanian National Olympic Committee athlete ID",
		example: [
			59813,
			7909383
		],
		types: [
		],
		aliases: [
			"LTOK athlete ID"
		]
	},
	{
		description: "identifier for an article on Lithuanian Sport Encyclopedia",
		datatype: "external-id",
		id: "P6504",
		label: "Lithuanian Sport Encyclopedia (LSE) article ID",
		example: [
			18590205,
			639515,
			928945
		],
		types: [
		],
		aliases: [
			"LSE"
		]
	},
	{
		description: "Littera identifier related to medieval Galician-Portuguese music (cantigas)",
		datatype: "external-id",
		id: "P6130",
		label: "Littera ID",
		example: [
			47595,
			3398968,
			2438904,
			3854591
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "organisation in the LittleSis who-knows-who of government and business database",
		datatype: "external-id",
		id: "P3393",
		label: "LittleSis organization ID",
		example: [
			6749265,
			483551
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "entry in the LittleSis who-knows-who of government and business database",
		datatype: "external-id",
		id: "P3388",
		label: "LittleSis people ID",
		example: [
			27865661,
			36697157,
			41142
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a Lexeme on the online Littré",
		datatype: "external-id",
		label: "Littré ID",
		id: "P7724",
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "username of a person or organisation, on LiveJournal",
		datatype: "external-id",
		id: "P3258",
		label: "LiveJournal ID",
		example: [
			3739746,
			4054424
		],
		types: [
			"for items about people",
			"for items about organizations"
		],
		aliases: [
			"LiveJournal username"
		]
	},
	{
		description: "identifier for an artist on LiveXLive site",
		datatype: "external-id",
		id: "P7188",
		label: "LiveXLive artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a player at the Livelib.ru",
		datatype: "external-id",
		id: "P7836",
		label: "Livelib.ru person ID",
		example: [
			20190248,
			426509,
			3050728,
			97228
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "LiverTox database ID",
		datatype: "external-id",
		id: "P7830",
		label: "LiverTox ID",
		example: [
			248550,
			147778,
			414238,
			50377176
		],
		types: [
			"representing a unique identifier",
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "categorization of the likelihood that a medication is associated with drug induced liver injury that was developed by the Drug-Induced Liver Injury Network (DILIN) Network and published in NCBI's LiverTox",
		datatype: "wikibase-item",
		id: "P8026",
		label: "LiverTox likelihood score",
		example: [
			677,
			25100990,
			422654
		],
		types: [
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a British or Commonwealth person who served during the first World War, in the Imperial War Museums' 'Lives of the First World War' database",
		datatype: "external-id",
		id: "P4601",
		label: "Lives of WWI ID",
		example: [
			212719,
			12054266
		],
		types: [
		],
		aliases: [
			"Lives of the First World War ID",
			"LivesOfWWI ID",
			"Lives of World War I ID",
			"Lives of the 1st World War ID"
		]
	},
	{
		description: "identifier for an author on the Livre et lecture en Bretagne website",
		datatype: "external-id",
		id: "P5543",
		label: "Livre et lecture en Bretagne ID",
		example: [
			3371088,
			25565421,
			52349594
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Ship ID in Lloyd's Register of Ships",
		datatype: "external-id",
		id: "P4336",
		label: "Lloyd's Register Ship ID",
		example: [
			572950
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "alphanumerical identifier for a place covered by the Historic American Buildings Survey, Historic American Engineering Record or the Historic American Landscapes Survey on the Library of Congress website",
		datatype: "external-id",
		id: "P8655",
		label: "LoC HABS/HAER/HALS place ID",
		example: [
			96402371,
			3507989,
			99481483
		],
		types: [
		],
		aliases: [
			"HABS ID",
			"HAER ID",
			"HALS ID",
			"Historic American Buildings Survey ID",
			"Historic American Engineering Record ID",
			"Historic American Landscapes Survey ID",
			"Control Number"
		]
	},
	{
		description: "identifier for an item in one of the controlled vocabularies maintained by the Library of Congress",
		datatype: "external-id",
		id: "P4801",
		label: "LoC and MARC vocabularies ID",
		example: [
			133792,
			755620,
			1194038,
			1323191,
			2003,
			5292
		],
		types: [
			"representing a unique identifier",
			"multi-source external identifier"
		],
		aliases: [
			"LoC&MARC ID"
		]
	},
	{
		description: "identifier for a mountain on the Lists of John website",
		datatype: "external-id",
		id: "P3907",
		label: "LoJ peak ID",
		example: [
			28604365,
			6919585
		],
		types: [
		],
		aliases: [
			"Lists of John ID"
		]
	},
	{
		description: "identifier for a Swiss MP within Lobbywatch's database",
		datatype: "external-id",
		id: "P8474",
		label: "Lobbywatch.ch ID of a member of parliament",
		example: [
			16669767,
			49316204
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a placename page on the Placenames Database of Ireland (Logainm) site",
		datatype: "external-id",
		id: "P5097",
		label: "Logainm ID",
		example: [
			1761
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Logicielsmoto database of Thomson software",
		datatype: "external-id",
		id: "P5453",
		label: "Logicielsmoto identifier",
		example: [
			3201630,
			88828,
			91282,
			3554350
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an article in lokalhistoriewiki.no",
		datatype: "external-id",
		id: "P6520",
		label: "Lokalhistoriewiki.no ID",
		example: [
			485297,
			19393344,
			4114337,
			4988530
		],
		types: [
		],
		aliases: [
			"Lokalhistoriewiki article"
		]
	},
	{
		description: "identifier for an architecture author (not artwork author) in LombardiaBeniCulturali database",
		datatype: "external-id",
		id: "P8271",
		label: "LombardiaBeniCulturali architecture author ID",
		example: [
			3639322,
			762
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an artwork in the cultural heritage database of the Lombardy Region of Italy",
		datatype: "external-id",
		id: "P3855",
		label: "LombardiaBeniCulturali artwork ID",
		example: [
			933665
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an artwork author in the cultural heritage database of the Lombardy Region of Italy",
		datatype: "external-id",
		id: "P8210",
		label: "LombardiaBeniCulturali artwork author ID",
		example: [
			93727539,
			3608101,
			16559119
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a historical building in the cultural heritage database of the Lombardy Region of Italy",
		datatype: "external-id",
		id: "P3503",
		label: "LombardiaBeniCulturali building ID",
		example: [
			3950101
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a historical institution in the cultural heritage database of the Lombardy Region of Italy",
		datatype: "external-id",
		id: "P3849",
		label: "LombardiaBeniCulturali institution ID",
		example: [
			731222
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a historical toponym in the cultural heritage database of the Lombardy Region of Italy",
		datatype: "external-id",
		id: "P3850",
		label: "LombardiaBeniCulturali toponym ID",
		example: [
			47440
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a company listed on the London Stock Exchange",
		datatype: "external-id",
		id: "P8676",
		label: "London Stock Exchange company ID",
		example: [
			847869,
			1465461
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a swimmer in the LongSwimsDB database",
		datatype: "external-id",
		id: "P7232",
		label: "LongSwimsDB ID",
		example: [
			33125411,
			3484608,
			482912,
			17538847
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the longtake.it site",
		datatype: "external-id",
		id: "P8305",
		label: "LongTake person ID",
		example: [
			106907,
			106057,
			4612,
			13909
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person, in the Loop database of researcher impact",
		datatype: "external-id",
		id: "P2798",
		label: "Loop ID",
		example: [
			23795300
		],
		types: [
		],
		aliases: [
			"Loop profile ID"
		]
	},
	{
		description: "identifier for an author on the Los Angeles Review of Books website",
		datatype: "external-id",
		id: "P5705",
		label: "Los Angeles Review of Books author ID",
		example: [
			28113171,
			6536525,
			72334
		],
		types: [
		],
		aliases: [
			"LARB author ID"
		]
	},
	{
		description: "identifier on the German Lost Art Foundation website",
		datatype: "external-id",
		id: "P1428",
		label: "Lost Art ID",
		example: [
			17271987
		],
		types: [
		],
		aliases: [
			"German Lost Art Foundation ID"
		]
	},
	{
		description: "identifier for Indian authors, in the Lotsawa House library of translations of Tibetan Buddhist religious texts",
		datatype: "external-id",
		id: "P4349",
		label: "Lotsawa House Indian author ID",
		example: [
			320150
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for Tibetan authors, in the Lotsawa House library of translations of Tibetan Buddhist religious texts",
		datatype: "external-id",
		id: "P4348",
		label: "Lotsawa House Tibetan author ID",
		example: [
			25252
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete on the Louisiana Sports Hall of Fame website",
		datatype: "external-id",
		id: "P4367",
		label: "Louisiana Sports Hall of Fame ID",
		example: [
			16008148,
			237894
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier",
		datatype: "external-id",
		id: "P745",
		label: "Low German Bibliography and Biography ID",
		example: [
			69087,
			559394
		],
		types: [
		],
		aliases: [
			"PBB ID",
			"Plattdeutsche Bibliographie und Biographie ID"
		]
	},
	{
		description: "identifier in the online database for castles in Lower Austria maintained by the Institut für Realienkunde des Mittelalters und der frühen Neuzeit (University of Salzburg)",
		datatype: "external-id",
		id: "P8227",
		label: "Lower Austrian Castle ID",
		example: [
			698689,
			37961908,
			38087857
		],
		types: [
		],
		aliases: [
			"NÖ-Burgen online ID"
		]
	},
	{
		description: "identifier to link with the Lower Austrian database of museums",
		datatype: "external-id",
		id: "P7296",
		label: "Lower Austrian Museum ID",
		example: [
			697719,
			63396683,
			1311808
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier used in the database for Lower Sorbian place names on dolnoserbski.de maintained by the Sorbian institute",
		datatype: "external-id",
		id: "P8661",
		label: "Lower Sorbian place name ID",
		example: [
			1464329,
			584815
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "person in the LUCERNA Magic Lantern Web Resource",
		datatype: "external-id",
		id: "P6583",
		label: "Lucerna person ID",
		example: [
			152260,
			271032,
			39599
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a game designer at the Luding database",
		datatype: "external-id",
		id: "P3506",
		label: "Luding designer ID",
		example: [
			61088
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a game at the Luding database",
		datatype: "external-id",
		id: "P3528",
		label: "Luding game ID",
		example: [
			17271,
			279606
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a publisher on the Luding website",
		datatype: "external-id",
		id: "P6162",
		label: "Luding game publisher ID",
		example: [
			2961890,
			3316086,
			882160
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a photographer in the Luminous-Lint database",
		datatype: "external-id",
		id: "P4759",
		label: "Luminous-Lint ID",
		example: [
			551491
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the Lutris database",
		datatype: "external-id",
		id: "P7597",
		label: "Lutris game ID",
		example: [
			54906424,
			1574053,
			20012932,
			74401,
			733992,
			54920200,
			61448741,
			4047361,
			852583,
			3519191,
			4050885
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game genre in the Lutris database",
		datatype: "external-id",
		id: "P7616",
		label: "Lutris genre ID",
		example: [
			603555,
			122207,
			2941225,
			7858602,
			2762504
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game platform in the Lutris database",
		datatype: "external-id",
		id: "P7617",
		label: "Lutris platform ID",
		example: [
			10677,
			1063978,
			47604,
			7820426
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on Lyrics007 site",
		datatype: "external-id",
		id: "P7206",
		label: "Lyrics007 artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier on LyricsTranslate",
		datatype: "external-id",
		id: "P7212",
		label: "LyricsTranslate ID",
		example: [
			383541,
			833283,
			19848,
			62034003,
			13580495,
			25056945,
			91933505,
			96264870,
			22041338
		],
		types: [
		],
		aliases: [
			"LyricsTranslate identifier",
			"LyricsTranslate"
		]
	},
	{
		description: "identifier of a person in the Léonore database",
		datatype: "external-id",
		id: "P640",
		label: "Léonore ID",
		example: [
			529,
			3124401
		],
		types: [
		],
		aliases: [
			"Léonore identifier",
			"Leonore ID",
			"Leonore identifier",
			"Léonore",
			"Leonore",
			"LH ID"
		]
	},
	{
		description: "classification system for literature on Sami matters",
		datatype: "string",
		label: "Løøv classification",
		id: "P6709",
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "exoplanet mass multiplied by the inclination angle",
		datatype: "quantity",
		id: "P2051",
		label: "M sin i",
		example: [
			1252981
		],
		types: [
			"for physical quantities"
		],
		aliases: [
			"M x sin i",
			"M ⋅ sin i"
		]
	},
	{
		description: "United Nations M.49 code for the subject item",
		datatype: "external-id",
		id: "P2082",
		label: "M.49 code",
		example: [
			18,
			664
		],
		types: [
		],
		aliases: [
			"M49 code",
			"UN M49 code",
			"ISO 3166-1 numeric code"
		]
	},
	{
		description: "unique identifier of an organisation registered with the IEEE",
		datatype: "string",
		id: "P4776",
		label: "MAC Address Block Large ID",
		example: [
			2283
		],
		types: [
			"for software",
			"representing a unique identifier"
		],
		aliases: [
			"Media Access Control address Block Large identifier",
			"MAC Address Block Large ID",
			"MA-L ID",
			"MA-L",
			"Organizationally Unique Identifier",
			"OUI"
		]
	},
	{
		description: "identifier for a structure or a building in the Massachusetts Cultural Resource Information System database",
		datatype: "external-id",
		id: "P8239",
		label: "MACRIS ID",
		example: [
			4906806,
			61989500,
			2270033
		],
		types: [
		],
		aliases: [
			"Massachusetts Cultural Resource Information System ID"
		]
	},
	{
		description: "identifier for items in the catalogue of the Musées d'Art et d'Histoire de Genève (MAHG)",
		datatype: "external-id",
		id: "P6877",
		label: "MAHG ID",
		example: [
			63143571,
			64484998,
			63218098,
			18783185,
			62587934
		],
		types: [
		],
		aliases: [
			"Musées d'Art et d'Histoire de Genève ID"
		]
	},
	{
		description: "name of Multiple Arcade Machine Emulator ROM for a software release",
		datatype: "external-id",
		id: "P2451",
		label: "MAME ROM name",
		example: [
			7685817,
			55535
		],
		types: [
		],
		aliases: [
			"Multiple Arcade Machine Emulator ROM",
			"ROM name (MAME)"
		]
	},
	{
		description: "identifier for an artwork on the website of the Musée d'Art Moderne de la Ville de Paris",
		datatype: "external-id",
		id: "P6374",
		label: "MAMVP artwork ID",
		example: [
			28073494,
			18927542,
			3713932
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a poet on the Modern American Poetry website",
		datatype: "external-id",
		id: "P5509",
		label: "MAPS poet ID",
		example: [
			3780149,
			193608,
			11245026
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique identifier for artists in the collection of the Rio Grande do Sul Art Museum",
		datatype: "external-id",
		id: "P6667",
		label: "MARGS ID",
		example: [
			17490032,
			634371,
			10317920
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a TV channel in the MAVISE database of the European Audiovisual Observatory",
		datatype: "external-id",
		id: "P4676",
		label: "MAVISE TV channel ID",
		example: [
			1094569
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a company in the MAVISE database of the European Audiovisual Observatory",
		datatype: "external-id",
		id: "P4679",
		label: "MAVISE company ID",
		example: [
			458944
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a licensing authority/register in the MAVISE database of the European Audiovisual Observatory",
		datatype: "external-id",
		id: "P4678",
		label: "MAVISE competent authority ID",
		example: [
			541497
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an on-demand audiovisual service in the MAVISE database of the European Audiovisual Observatory",
		datatype: "external-id",
		id: "P4677",
		label: "MAVISE on-demand audiovisual service ID",
		example: [
			18089153
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "code for item in the Mercosur Common Nomenclature",
		datatype: "string",
		id: "P1987",
		label: "MCN code",
		example: [
			164327
		],
		types: [
		],
		aliases: [
			"Mercosur code"
		]
	},
	{
		description: "numerical identifier for a structure or a building of interest in the Mississippi Department of Archives and History's Historic Resources Inventory database",
		datatype: "external-id",
		id: "P8249",
		label: "MDAH's HRI ID",
		example: [
			5170667,
			4244830,
			7371062
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "code used by the Ministry of Drinking Water and Sanitation, Government of India to identify village, panchayats, community development blocks, districts and states of India.",
		datatype: "external-id",
		id: "P6335",
		label: "MDWS place ID",
		example: [
			1356,
			307474,
			16136305
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for Indian diplomatic missions in foreign countries",
		datatype: "external-id",
		id: "P7531",
		label: "MEA Indian Mission ID",
		example: [
			4374001,
			5755079,
			73031084
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID number for the online catalogue of Musée d'ethnographie de Genève",
		datatype: "external-id",
		id: "P4157",
		label: "MEG ID",
		example: [
			33125234
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a book or translation in the Hungarian Electronic Library",
		datatype: "external-id",
		id: "P2623",
		label: "MEK ID",
		example: [
			1400237
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a software package in the MELPA archive",
		datatype: "external-id",
		id: "P6888",
		label: "MELPA package ID",
		example: [
			52157847,
			64821138,
			64821140
		],
		types: [
			"for software"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a past or present MEP in a directory of all members of the European Parliament",
		datatype: "external-id",
		id: "P1186",
		label: "MEP directory ID",
		example: [
			2243702
		],
		types: [
		],
		aliases: [
			"MEP directory identifier",
			"MEP ID",
			"Europarl member",
			"European Parliament member"
		]
	},
	{
		description: "ID for a proteolytic enzyme in MEROPS database",
		datatype: "external-id",
		id: "P3717",
		label: "MEROPS enzyme ID",
		example: [
			24726118
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "METeorological Aerodrome Report",
		datatype: "external-id",
		id: "P5001",
		label: "METAR code",
		example: [
			1055865,
			1536,
			654068,
			6452640
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "stable identifier for an entry on the MGG Online website",
		datatype: "external-id",
		id: "P6091",
		label: "MGG Online ID",
		example: [
			498715,
			1719083,
			11639
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Die Musik in Geschichte und Gegenwart ID"
		]
	},
	{
		description: "official gene symbol for a mouse gene",
		datatype: "external-id",
		id: "P2394",
		label: "MGI Gene Symbol",
		example: [
			18253252
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an object (painting, sculpture, instrument) in the collection of the Museumslandschaft Hessen Kassel",
		datatype: "external-id",
		id: "P5407",
		label: "MHK object ID",
		example: [
			17401759,
			21406264,
			19272288,
			1051375
		],
		types: [
		],
		aliases: [
			"mhk object ID",
			"Museumslandschaft Hessen Kassel object ID"
		]
	},
	{
		description: "ISO 10383 market identifier code",
		datatype: "external-id",
		id: "P7534",
		label: "MIC market code",
		example: [
			69322780,
			69324839,
			1003968,
			8025740,
			69336177,
			517750,
			13677
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"MIC",
			"ISO 10383 market code",
			"Market Identifier Code"
		]
	},
	{
		description: "20 or 30 digit code which denotes a military symbol as specified in MIL-STD-2525",
		datatype: "external-id",
		id: "P4297",
		label: "MIL-STD-2525 Symbol Identification Code",
		example: [
			12876,
			10358588
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a musical instrument, on the instrument keyword thesaurus from Musical Instruments Museums Online",
		datatype: "external-id",
		id: "P3763",
		label: "MIMO instrument ID",
		example: [
			379248,
			61285
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a Major League Baseball player",
		datatype: "external-id",
		id: "P3541",
		label: "MLB.com player ID",
		example: [
			2964906
		],
		types: [
		],
		aliases: [
			"Major League Baseball ID",
			"Major League Baseball player ID",
			"MLB ID",
			"milb.com player ID",
			"Minor League Baseball ID",
			"Minor League Baseball player ID"
		]
	},
	{
		description: "identifier for a player on the Major League Lacrosse website",
		datatype: "external-id",
		id: "P3948",
		label: "MLL player ID",
		example: [
			24259938,
			4962342
		],
		types: [
		],
		aliases: [
			"Major League Lacrosse player ID"
		]
	},
	{
		description: "identifier for soccer player profile on MLSsoccer.com, website of Major League Soccer",
		datatype: "external-id",
		id: "P2398",
		label: "MLS player ID",
		example: [
			3805624,
			459830
		],
		types: [
		],
		aliases: [
			"Major League Soccer player ID",
			"MLSsoccer.com player ID"
		]
	},
	{
		description: "identifier in the Biographical Dictionary of Mintmasters, Wardens, Coin Engravers and Medallists",
		datatype: "external-id",
		id: "P6240",
		label: "MMLO ID",
		example: [
			59484238,
			59484408,
			59479469
		],
		types: [
		],
		aliases: [
			"Biographisches Lexikon der Münzmeister, Wardeine, Stempelschneider und Medailleure ID"
		]
	},
	{
		description: "Maritime Mobile Service Identity of a ship station. Format 8 or 9 digits",
		datatype: "external-id",
		id: "P587",
		label: "MMSI",
		example: [
			4037895,
			191888
		],
		types: [
		],
		aliases: [
			"Maritime Mobile Service Identity",
			"MarineTraffic ID",
			"MarineTraffic Ship ID",
			"MMSI Number",
			"MMSI number"
		]
	},
	{
		description: "identifier for an artwork on the website of the collections of the Musée national d'Art moderne, in Paris",
		datatype: "external-id",
		id: "P6355",
		label: "MNAM artwork ID",
		example: [
			60428580,
			3213326,
			15981037
		],
		types: [
		],
		aliases: [
			"Musée national d'Art moderne artwork ID"
		]
	},
	{
		description: "identifier assigned to an artist by the National Museum of Visual Arts of Uruguay",
		datatype: "external-id",
		id: "P6156",
		label: "MNAV artist ID",
		example: [
			5043401,
			42388324
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier assigned to an artwork by the National Museum of Visual Arts of Uruguay",
		datatype: "external-id",
		id: "P5268",
		label: "MNAV work ID",
		example: [
			54006414
		],
		types: [
		],
		aliases: [
			"National Museum of Visual Arts of Uruguay work identifier",
			"National Museum of Visual Arts work identifier"
		]
	},
	{
		description: "unique identifier for an artist in the Musée national des beaux-arts du Québec",
		datatype: "external-id",
		id: "P8336",
		label: "MNBAQ artist ID",
		example: [
			3335933,
			975848,
			708544
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person in the MNCARS (Museo Nacional Centro de Arte Reina Sofía) database",
		datatype: "external-id",
		id: "P4439",
		label: "MNCARS artist ID",
		example: [
			450236
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon on the Muséum national d'histoire naturelle website",
		datatype: "external-id",
		id: "P6046",
		label: "MNHN taxon ID",
		example: [
			5053838,
			161128,
			2579310
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a subject in the online encyclopedia MNopedia, which covers Minnesota",
		datatype: "external-id",
		id: "P6283",
		label: "MNopedia ID",
		example: [
			5415121,
			1937387,
			59847670,
			497482
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the database of the Museum of Computer Adventure Game History",
		datatype: "external-id",
		id: "P7899",
		label: "MOCAGH ID",
		example: [
			456065,
			47495873,
			7762601
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Museum of Computer Adventure Game History ID"
		]
	},
	{
		description: "ID of hospital registered under Ministry of Health and Welfare (Taiwan)",
		datatype: "external-id",
		id: "P7468",
		label: "MOHW HospID",
		example: [
			11411924,
			30262812,
			55696219
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a lepidoptera species, in the Hodges List (i.e. the 'Check List of the Lepidoptera of America North of Mexico', with subsequent revisions)",
		datatype: "external-id",
		id: "P4758",
		label: "MONA ID",
		example: [
			7616647,
			7616676,
			4761674,
			5610683
		],
		types: [
		],
		aliases: [
			"Hodges number"
		]
	},
	{
		description: "ID of an artist at the Israeli music website MOOMA",
		datatype: "external-id",
		id: "P3733",
		label: "MOOMA artist ID",
		example: [
			966848
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "US film classification administered by the Motion Picture Association of America",
		datatype: "wikibase-item",
		id: "P1657",
		label: "MPAA film rating",
		example: [
			17738,
			190525
		],
		types: [
		],
		aliases: [
			"Motion Picture Association of America film rating"
		]
	},
	{
		description: "identifier for an expert researcher or an institution in the database of the Max-Planck-Gesellschaft",
		datatype: "external-id",
		id: "P7027",
		label: "MPG ID",
		example: [
			15823700,
			21258944,
			15834499,
			91659,
			339759
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "link to a film's entry at the MPPDA Digital Archive",
		datatype: "external-id",
		id: "P7631",
		label: "MPPDA Digital Archive film ID",
		example: [
			546829,
			272599,
			1809883,
			866120
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "link to an organisation's records at the MPPDA Digital Archive",
		datatype: "external-id",
		id: "P7632",
		label: "MPPDA Digital Archive organisation ID",
		example: [
			212329,
			2756484,
			9684,
			13974
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"MPPDA Digital Archive organization ID"
		]
	},
	{
		description: "link to a person's records at the MPPDA Digital Archive",
		datatype: "external-id",
		id: "P7633",
		label: "MPPDA Digital Archive person ID",
		example: [
			2094258,
			202878,
			315202,
			365218,
			16863904
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Mathematical Reviews ID in MathSciNet",
		datatype: "external-id",
		id: "P4955",
		label: "MR Author ID",
		example: [
			41585,
			470471,
			16018157
		],
		types: [
		],
		aliases: [
			"Mathematical Reviews Author ID",
			"MathSciNet Author ID",
			"MathSciNet Author profile ID"
		]
	},
	{
		description: "identifier of a person, in the Mapping the Practice and Profession of Sculpture in Britain and Ireland database",
		datatype: "external-id",
		id: "P2914",
		label: "MSBI person ID",
		example: [
			151097,
			506566
		],
		types: [
		],
		aliases: [
			"Mapping the Practice and Profession of Sculpture in Britain and Ireland 1851-1951 ID"
		]
	},
	{
		description: "identifier for an artwork from the collection of the Museum of Fine Arts, Ghent",
		datatype: "external-id",
		id: "P2511",
		label: "MSK Gent work PID",
		example: [
			21011370,
			21178779
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier from Mammal Species of the World: a database that claims to provide an authoritative and comprehensive list of names of mammals (but the ICZN does not agree)",
		datatype: "external-id",
		id: "P959",
		label: "MSW ID",
		example: [
			192930
		],
		types: [
		],
		aliases: [
			"MSW identifier"
		]
	},
	{
		description: "identifier of a video game in MSX Games World",
		datatype: "external-id",
		id: "P6797",
		label: "MSX Games World ID",
		example: [
			598908,
			6552947,
			1288651,
			7389524
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "author's identifier in the Hungarian Scientific Bibliography",
		datatype: "external-id",
		id: "P2492",
		label: "MTMT author ID",
		example: [
			957435,
			357918
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a station in Hong Kong issued by MTR",
		datatype: "external-id",
		id: "P1377",
		label: "MTR station code",
		example: [
			838876
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on MTV Germany site",
		datatype: "external-id",
		id: "P7641",
		label: "MTV Germany artist ID",
		example: [
			383541,
			313453,
			200577,
			207177
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on MTV Polska site",
		datatype: "external-id",
		id: "P7216",
		label: "MTV Polska artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on MTV UK site",
		datatype: "external-id",
		id: "P7217",
		label: "MTV UK artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film at MUBI",
		datatype: "external-id",
		id: "P7299",
		label: "MUBI film ID",
		example: [
			475693,
			470375,
			582979
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person at MUBI",
		datatype: "external-id",
		id: "P7300",
		label: "MUBI person ID",
		example: [
			51545,
			106418,
			44131
		],
		types: [
		],
		aliases: [
			"MUBI cast ID"
		]
	},
	{
		description: "identifier for a scholarly article in the Project MUSE bibliographic database",
		datatype: "external-id",
		id: "P8101",
		label: "MUSE article ID",
		example: [
			61833913,
			33452055,
			58151482
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an academic journal in the Project MUSE",
		datatype: "external-id",
		id: "P5559",
		label: "MUSE journal ID",
		example: [
			2584927,
			6431926,
			9068473
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "url in the database of the Museum With No Frontiers (MWNF) virtual museum for the transmission of knowledge",
		datatype: "url",
		id: "P7375",
		label: "MWNF URL",
		example: [
			2389665,
			4702618,
			2145603,
			29385183
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an actor in MYmovies.it",
		datatype: "external-id",
		id: "P4779",
		label: "MYmovies actor ID",
		example: [
			4573,
			357387
		],
		types: [
		],
		aliases: [
			"MYmovies.it actor ID"
		]
	},
	{
		description: "identifier for a director in MYmovies.it",
		datatype: "external-id",
		id: "P4781",
		label: "MYmovies director ID",
		example: [
			53026
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film in MYmovies.it",
		datatype: "external-id",
		id: "P4780",
		label: "MYmovies movie ID",
		example: [
			185658
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for producer, cinematographer, screenwriter and company in MYmovies.it",
		datatype: "external-id",
		id: "P4785",
		label: "MYmovies name ID",
		example: [
			370765,
			296796
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "code used formerly by Mac OS to identify file types and programs",
		datatype: "string",
		id: "P7126",
		label: "Mac OS type code",
		example: [
			2141903,
			260180,
			83570
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of the person's biography in the MacTutor History of Mathematics archive",
		datatype: "external-id",
		id: "P1563",
		label: "MacTutor biography ID",
		example: [
			548080,
			315414
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Macdonald Dictionary",
		datatype: "external-id",
		id: "P8067",
		label: "Macdonald Dictionary ID",
		example: [
			89477473,
			6218121,
			4722435
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of Macedonian cadastral municipalities",
		datatype: "external-id",
		id: "P8542",
		label: "Macedonian cadastral municipality ID",
		example: [
			98104040,
			3136902
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the Macintosh Garden database",
		datatype: "external-id",
		id: "P7811",
		label: "Macintosh Garden game ID",
		example: [
			7608028,
			1619246,
			210552,
			741716,
			1742194
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the Macintosh Repository database",
		datatype: "external-id",
		id: "P7812",
		label: "Macintosh Repository ID",
		example: [
			7608028,
			1619246,
			210552,
			741244,
			1742194,
			6546411
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID for an association football (soccer) player in the Turkish Mackolik.com database",
		datatype: "external-id",
		id: "P2458",
		label: "Mackolik.com player ID",
		example: [
			446506,
			201900
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "film ID in the Mafab.hu movie database",
		datatype: "external-id",
		id: "P7204",
		label: "Mafab.hu film ID",
		example: [
			160618,
			53481,
			244971
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "biographical article about people from the Magdeburg area",
		datatype: "external-id",
		id: "P2277",
		label: "Magdeburger Biographisches Lexikon",
		example: [
			60193
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a trail on the Maine Trail Finder website",
		datatype: "external-id",
		id: "P7310",
		label: "Maine Trail Finder ID",
		example: [
			67195471,
			67195434,
			67195388
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an entry on the Maine: An Encyclopedia website",
		datatype: "external-id",
		id: "P7697",
		label: "Maine: An Encyclopedia ID",
		example: [
			100948,
			5048261,
			31874734,
			507256
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "ID for a place adhering to the Federation of Writer's Houses and Literary Heritage",
		datatype: "external-id",
		id: "P4881",
		label: "Maison d'écrivain ID",
		example: [
			21559211
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the online version of Le Maitron, a biographical dictionary of the French labour movement",
		datatype: "external-id",
		id: "P4724",
		label: "Maitron ID",
		example: [
			3158545,
			47008584
		],
		types: [
		],
		aliases: [
			"Maitron person ID",
			"Le Maitron ID",
			"Le Maitron person ID",
			"Dictionnaire biographique, mouvement ouvrier, mouvement social ID"
		]
	},
	{
		description: "identifier for a person on the Maitron des fusillés",
		datatype: "external-id",
		id: "P8510",
		label: "Maitron des fusillés ID",
		example: [
			156585,
			680881
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Malacards database of diseases",
		datatype: "external-id",
		id: "P1583",
		label: "MalaCards ID",
		example: [
			190564
		],
		types: [
			"representing a unique identifier",
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "identifier for companies in Malaysia",
		datatype: "external-id",
		id: "P6843",
		label: "Malaysia company number",
		example: [
			1364018,
			221692,
			3279613,
			1640639,
			7825344
		],
		types: [
		],
		aliases: [
			"Malaysia company ID"
		]
	},
	{
		description: "identifier in the National Inventory of Cultural Property of the Maltese Islands",
		datatype: "external-id",
		id: "P1799",
		label: "Maltese Islands National Inventory of Cultural Property ID",
		example: [
			216862,
			3979901,
			343053
		],
		types: [
		],
		aliases: [
			"NICPMI ID",
			"Maltese Islands National Inventory of Cultural Property identifier",
			"Maltese Cultural Property ID"
		]
	},
	{
		description: "identifier for a mangaka on the MangaSeek website",
		datatype: "external-id",
		id: "P6921",
		label: "MangaSeek person ID",
		example: [
			11256504,
			193300,
			219948,
			11265371
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for albums listed in the Maniadb database",
		datatype: "external-id",
		id: "P8663",
		label: "Maniadb album ID",
		example: [
			23838469,
			10854802
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "unique identifier for artists listed in the Maniadb database",
		datatype: "external-id",
		id: "P8415",
		label: "Maniadb artist ID",
		example: [
			23772001,
			44506198
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a book on the website of the Manioc digital library for the Caribbean, the Amazon and the Guyane",
		datatype: "external-id",
		id: "P8522",
		label: "Manioc book ID",
		example: [
			28867707,
			90148496,
			91914634,
			94643972
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete on the Manitoba Sports Hall of Fame",
		datatype: "external-id",
		id: "P4413",
		label: "Manitoba Sports Hall of Fame athlete ID",
		example: [
			27063443,
			5108388
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon on the Mantodea Species File website",
		datatype: "external-id",
		id: "P6055",
		label: "Mantodea Species File ID",
		example: [
			3363672,
			10644768,
			1552005
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a brand or manufacturer, in the Manuals Lib library of instruction manuals",
		datatype: "external-id",
		id: "P6422",
		label: "ManualsLib brand ID",
		example: [
			796924,
			234021,
			790020
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a manuscript held by an Italian library",
		datatype: "external-id",
		id: "P4752",
		label: "Manus Online ID",
		example: [
			1106332
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon on the Map of Life website",
		datatype: "external-id",
		id: "P6092",
		label: "Map of Life ID",
		example: [
			2382425,
			1316048,
			157540
		],
		types: [
		],
		aliases: [
			"MOL ID"
		]
	},
	{
		description: "identifier for a place, in the Mapa database of places in Israel",
		datatype: "external-id",
		id: "P3806",
		label: "Mapa place ID",
		example: [
			28914207
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID for a photo on Mapillary, a service for crowdsourcing map photos",
		datatype: "external-id",
		id: "P1947",
		label: "Mapillary ID",
		example: [
			19368857
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Mapillary Image key"
		]
	},
	{
		description: "identifier for place in Mappy",
		datatype: "external-id",
		id: "P4388",
		label: "Mappy place ID",
		example: [
			19675
		],
		types: [
			"to indicate a location"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a professor, in the Marburger Professorenkatalog of professors at the Philipps-Universität Marburg, Germany",
		datatype: "external-id",
		id: "P3187",
		label: "Marburger Professorenkatalog ID",
		example: [
			106208
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for marine geographic objects, in the marineregions.org database",
		datatype: "external-id",
		id: "P3006",
		label: "Marine Regions Geographic ID",
		example: [
			97,
			4927148,
			25263,
			4058447
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"MRG ID",
			"MRGID"
		]
	},
	{
		description: "unique ID created to help name and locate geographical features by the Marine Regions website",
		datatype: "external-id",
		id: "P7322",
		label: "Marine Regions Geographic IDentifier (MRGID)",
		example: [
			29058818,
			29619707,
			3322238
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a lighthouse or light beacon in the MarineTraffic database",
		datatype: "external-id",
		id: "P3601",
		label: "MarineTraffic Lighthouse ID",
		example: [
			7625316
		],
		types: [
		],
		aliases: [
			"Lighthouse ID"
		]
	},
	{
		description: "identifier for a port assigned by the MarineTraffic database",
		datatype: "external-id",
		id: "P1624",
		label: "MarineTraffic Port ID",
		example: [
			7232468
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of someone in MarketScreener",
		datatype: "external-id",
		id: "P7845",
		label: "MarketScreener business leaders ID",
		example: [
			8984833,
			67202213,
			9309748
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "profile of a person at Martindale-Hubbell",
		datatype: "external-id",
		id: "P6650",
		label: "Martindale-Hubbell profile",
		example: [
			3133399,
			6272866,
			4849090
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for artists and writers at Marvel.com",
		datatype: "external-id",
		id: "P7950",
		label: "Marvel Comics creators ID",
		example: [
			311607,
			181900,
			1341343,
			311253
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a character on the Marvel.com website",
		datatype: "external-id",
		id: "P5621",
		label: "Marvel character ID",
		example: [
			81787,
			2339552,
			1170251
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "numerical identifier for a structure or a building listed in the National Register of Historic Places in the Maryland's National Register Properties database",
		datatype: "external-id",
		id: "P8165",
		label: "Maryland's National Register Properties ID",
		example: [
			5053820,
			6182147,
			7793675
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifer for a person affiliated with Masaryk University (staff, alumnus, student…)",
		datatype: "external-id",
		id: "P1803",
		label: "Masaryk University person ID",
		example: [
			11909522
		],
		types: [
		],
		aliases: [
			"Masaryk University učo"
		]
	},
	{
		description: "accession number for entries in the MassBank database (records of mass spectrometry)",
		datatype: "external-id",
		id: "P6689",
		label: "MassBank accession ID",
		example: [
			60235,
			27094615,
			57055
		],
		types: [
			"related to chemistry"
		],
		aliases: [
			"MassBank accession number",
			"MassBank ID"
		]
	},
	{
		description: "address on the Mastodon decentralized social network. The form is: 'user@server.domain' there is no leading '@' as sometimes written to distinguish Mastodon addresses from email addresses.",
		datatype: "external-id",
		id: "P4033",
		label: "Mastodon address",
		example: [
			3190732,
			10135
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier for entries in MathWorld, online mathematics reference work",
		datatype: "external-id",
		id: "P2812",
		label: "MathWorld identifier",
		example: [
			9300316,
			203586,
			1807042,
			1445491
		],
		types: [
		],
		aliases: [
			"Wolfram MathWorld identifier"
		]
	},
	{
		description: "identifier in Mathematical Reviews, a journal and online database",
		datatype: "external-id",
		id: "P889",
		label: "Mathematical Reviews ID",
		example: [
			18198935,
			21707170
		],
		types: [
		],
		aliases: [
			"Mathematical Reviews identifier",
			"MathSciNet bibliographic ID",
			"MR bibliographic ID"
		]
	},
	{
		description: "number of a journal in Mathematical Reviews website",
		datatype: "external-id",
		id: "P5867",
		label: "Mathematical Reviews journal ID",
		example: [
			5282038,
			14293970,
			3050606
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for mathematicians and computer scientists at the Mathematics Genealogy Project",
		datatype: "external-id",
		id: "P549",
		label: "Mathematics Genealogy Project ID",
		example: [
			7604,
			471777
		],
		types: [
		],
		aliases: [
			"MGP ID",
			"Mathematics Genealogy Project identifier",
			"MathGenealogy ID",
			"Math Genealogy ID",
			"Genealogy of Mathematics"
		]
	},
	{
		description: "identifier of the same topic in the Mathematics Subject Classification (2010)",
		datatype: "external-id",
		id: "P3285",
		label: "Mathematics Subject Classification ID",
		example: [
			1502341
		],
		types: [
		],
		aliases: [
			"MSC ID",
			"MSC2010"
		]
	},
	{
		description: "identifier for an article in McClintock and Strong Biblical Cyclopedia",
		datatype: "external-id",
		id: "P8636",
		label: "McClintock and Strong Biblical Cyclopedia ID",
		example: [
			3413967,
			9077
		],
		types: [
		],
		aliases: [
			"Biblical Cyclopedia ID"
		]
	},
	{
		description: "romanization system for Korean",
		datatype: "string",
		id: "P1942",
		label: "McCune-Reischauer romanization",
		example: [
			138048
		],
		types: [
			"for romanization system",
			"with datatype string that is not an external identifier",
			"Wikidata qualifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a Medical Subject Headings concept",
		datatype: "external-id",
		id: "P6694",
		label: "MeSH concept ID",
		example: [
			58356,
			57055,
			1216998
		],
		types: [
			"related to medicine",
			"related to chemistry",
			"multi-source external identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for Descriptor or Supplementary concept in the Medical Subject Headings controlled vocabulary",
		datatype: "external-id",
		id: "P486",
		label: "MeSH descriptor ID",
		example: [
			1485,
			77,
			5205953
		],
		types: [
			"related to medicine",
			"representing a unique identifier"
		],
		aliases: [
			"MeSH Unique ID",
			"UI",
			"MeSH ID"
		]
	},
	{
		description: "identifier of a \"MeSH term\" (Medical Subject Headings) of National Library of Medecine (National Institutes of Health - U.S. Department of Health)",
		datatype: "external-id",
		id: "P6680",
		label: "MeSH term ID",
		example: [
			58356,
			57055,
			1216998,
			14864940
		],
		types: [
			"related to medicine",
			"related to chemistry",
			"multi-source external identifier"
		],
		aliases: [
		]
	},
	{
		description: "Medical Subject Headings (MeSH) codes are an index and thesaurus for the life sciences (≠ MeSH ID, P486)",
		datatype: "external-id",
		id: "P672",
		label: "MeSH tree code",
		example: [
			3999,
			11068,
			101004,
			190564
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"MeSH Tree Number",
			"MeSH code",
			"MeSH hierarchical code"
		]
	},
	{
		description: "identifier for nature and landscape protected areas in Mecklenburg-Vorpommern (Germany), issued by the Ministerium für Landwirtschaft und Umwelt Mecklenburg-Vorpommern",
		datatype: "external-id",
		id: "P6478",
		label: "Mecklenburg-Vorpommern protected area ID",
		example: [
			1246038,
			23719464,
			1971184
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for the Media Arts Database created by the Japanese government department Bunkacho",
		datatype: "external-id",
		id: "P7886",
		label: "Media Arts Database ID",
		example: [
			247935,
			431930,
			542682,
			235311,
			43371394,
			710324,
			24825987,
			7881578
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"mediaarts-db.bunka.go.jp ID"
		]
	},
	{
		description: "identifier for an anime in the Media Art database created by the Japanese government department Bunkacho (obsolete, use P7886 for new identifier with 'C/M' prefix)",
		datatype: "external-id",
		id: "P6368",
		label: "Media Arts Database anime ID (obsolete)",
		example: [
			11291096,
			724048,
			664927
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Bunkacho Media Art Database anime ID"
		]
	},
	{
		description: "identifier for an author in the Media Art database created by the Japanese government department Bunkacho (obsolete, use P7886 for new identifier with 'C' prefix)",
		datatype: "external-id",
		id: "P3231",
		label: "Media Arts Database author ID (obsolete)",
		example: [
			54867672,
			11333298,
			18054678,
			542682
		],
		types: [
			"obsolete Wikidata property"
		],
		aliases: [
			"Bunkacho Media Art Database mangaka ID"
		]
	},
	{
		description: "identifier for a console game in the Media Art database created by the Japanese government department Bunkacho (obsolete, use P7886 for new identifier with 'C/M' prefix)",
		datatype: "external-id",
		id: "P7117",
		label: "Media Arts Database console games ID (obsolete)",
		example: [
			1166232,
			247935,
			7712517
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a manga in the Media Art database created by the Japanese government department Bunkacho (obsolete, use P7886 for new identifier with 'C/M' prefix)",
		datatype: "external-id",
		id: "P6369",
		label: "Media Arts Database manga ID (obsolete)",
		example: [
			235311,
			18225473,
			11673784
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Bunkacho Media Art Database manga ID"
		]
	},
	{
		description: "MediaWiki hooks used by this extension",
		datatype: "wikibase-item",
		id: "P2377",
		label: "MediaWiki hooks used",
		example: [
			27887618
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P6813",
		label: "Mediapart tag ID",
		example: [
			57751,
			16666184,
			2976160
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P8244",
		label: "Mediaqueer.ca artist ID",
		example: [
			27781208,
			20859710,
			55218820
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P8245",
		label: "Mediaqueer.ca movie ID",
		example: [
			2354576,
			3520498,
			1197742
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Medical Dictionary for Regulatory Activities",
		datatype: "external-id",
		id: "P3201",
		label: "Medical Dictionary for Regulatory Activities ID",
		example: [
			21484295
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"MEDDRA ID"
		]
	},
	{
		description: "identifier for an author in the Medicina database",
		datatype: "external-id",
		id: "P5376",
		label: "Medicina author ID",
		example: [
			47004588,
			42393325,
			3103622
		],
		types: [
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "Rating of a film in the Danish movie content rating system",
		datatype: "wikibase-item",
		id: "P5970",
		label: "Medierådet rating",
		example: [
			23006268,
			39060366,
			28811584,
			187266
		],
		types: [
		],
		aliases: [
			"Medieradet"
		]
	},
	{
		description: "identifier for books known to have been in British libraries during the Middle Ages",
		datatype: "external-id",
		id: "P3768",
		label: "Medieval Libraries of Great Britain ID",
		example: [
			2598466
		],
		types: [
		],
		aliases: [
			"MLGB3 ID"
		]
	},
	{
		description: "username of the Medium account of a person or an organization",
		datatype: "external-id",
		id: "P3899",
		label: "Medium username",
		example: [
			3052772,
			3852080
		],
		types: [
			"for items about people",
			"for items about organizations"
		],
		aliases: [
			"Medium.com username",
			"Medium ID",
			"Medium.com ID"
		]
	},
	{
		description: "health information from U.S. government agencies, and health-related organizations",
		datatype: "external-id",
		id: "P604",
		label: "MedlinePlus ID",
		example: [
			12152
		],
		types: [
			"representing a unique identifier",
			"related to medicine"
		],
		aliases: [
			"A.D.A.M. Medical Encyclopedia ID"
		]
	},
	{
		description: "numerical identifier for a Maryland structure or building listed in the National Register of Historic Places in the Medusa database",
		datatype: "external-id",
		id: "P8282",
		label: "Medusa NRHP ID",
		example: [
			5178935,
			14692364,
			7874823
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an ancient site on The Megalithic Portal",
		datatype: "external-id",
		id: "P4356",
		label: "Megalithic Portal ID",
		example: [
			22247325,
			6629738
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for the film in the database Megogo",
		datatype: "external-id",
		id: "P2826",
		label: "Megogo ID",
		example: [
			16692754,
			4066557
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a music album on Melon",
		datatype: "external-id",
		id: "P4518",
		label: "Melon album ID",
		example: [
			31204466,
			30922084
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on Melon",
		datatype: "external-id",
		id: "P4473",
		label: "Melon artist ID",
		example: [
			18733030,
			17466114,
			12605358
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a song on Melon",
		datatype: "external-id",
		id: "P5197",
		label: "Melon song ID",
		example: [
			44954579,
			720620,
			184259
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "an identifier for members, or former members, of the national parliament of Greece",
		datatype: "external-id",
		id: "P2278",
		label: "Member of the Hellenic Parliament ID",
		example: [
			2628736,
			20995447
		],
		types: [
		],
		aliases: [
			"Greek parliament id",
			"Hellenic parliament id"
		]
	},
	{
		description: "identifier for the Memorial Book Bundesarchiv",
		datatype: "external-id",
		id: "P7571",
		label: "Memorial Book Bundesarchiv ID",
		example: [
			2039401,
			91170,
			68204
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for pages on the history of Brazilian TV network Rede Globo, researched by a team of journalists, historians and anthropologists",
		datatype: "external-id",
		id: "P4400",
		label: "Memória Globo",
		example: [
			335455,
			1247837,
			18317,
			10356012,
			3080983
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for people who were killed or went missing during the Brazilian military dictatorship (1964-1985)",
		datatype: "external-id",
		id: "P6673",
		label: "Memórias da Ditadura ID",
		example: [
			4313901,
			18237983,
			17413797
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author of scholarly works, at mendeley.com (for numeric ID, see P1153)",
		datatype: "external-id",
		id: "P3835",
		label: "Mendeley person ID",
		example: [
			1085273,
			6153583,
			1866722
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a scientific publication on the Mendeley.com website",
		datatype: "external-id",
		id: "P7916",
		label: "Mendeley publication ID",
		example: [
			84322515,
			84322311,
			18507561
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "measurement of the intensity of an earthquake",
		datatype: "wikibase-item",
		id: "P2784",
		label: "Mercalli intensity scale",
		example: [
			36204,
			22662663
		],
		types: [
			"for physical quantities"
		],
		aliases: [
		]
	},
	{
		description: "four-digit number used to classify businesses by the type of goods or services it provides.",
		datatype: "string",
		id: "P4573",
		label: "Merchant Category Code",
		example: [
			32396,
			205495,
			188920
		],
		types: [
		],
		aliases: [
			"MCC"
		]
	},
	{
		description: "URL stem of page in The Merck Index Online",
		datatype: "external-id",
		id: "P1738",
		label: "Merck Index monograph",
		example: [
			179271
		],
		types: [
			"representing a unique identifier",
			"related to chemistry"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a chemical reaction, in the Merck Index",
		datatype: "external-id",
		id: "P3378",
		label: "Merck Index reaction ID",
		example: [
			2273953
		],
		types: [
			"related to chemistry",
			"representing a unique identifier"
		],
		aliases: [
			"Merck Index reaction",
			"Merck Index reaction identifier"
		]
	},
	{
		description: "identifier for the geneological record of a person in the database of the Merkelstiftung",
		datatype: "external-id",
		id: "P4620",
		label: "Merkelstiftung person ID",
		example: [
			1036943,
			5984965,
			19278833,
			1736189
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifiers for compound entries in the MetaboLights databases.",
		datatype: "external-id",
		id: "P3890",
		label: "MetaboLights Compound ID",
		example: [
			408022
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for Metacritic",
		datatype: "external-id",
		id: "P1712",
		label: "Metacritic ID",
		example: [
			47703,
			3468641,
			274897,
			1990678,
			23628,
			1299,
			193559
		],
		types: [
		],
		aliases: [
			"Metacritic",
			"MC ID"
		]
	},
	{
		description: "identifier for a meteorite in the database of the Meteoritical Society",
		datatype: "external-id",
		id: "P824",
		label: "Meteoritical Bulletin Database ID",
		example: [
			2596468,
			45058760
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "7 digit number assigned by the Meteorological Service of Canada to a site where official weather observations are taken, and serves as a permanent, unique identifier",
		datatype: "external-id",
		id: "P6242",
		label: "Meteorological Service of Canada climate site ID",
		example: [
			59495897,
			60059365,
			501744
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"MSC ID"
		]
	},
	{
		description: "identifier for an topic on Metro site",
		datatype: "external-id",
		id: "P6922",
		label: "Metro topic ID",
		example: [
			383541,
			200577,
			355
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a song or artist at the MetroLyrics website",
		datatype: "external-id",
		id: "P2624",
		label: "MetroLyrics ID",
		example: [
			17099452,
			16028874,
			383541
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a restaurant in the Michelin Restaurants website",
		datatype: "external-id",
		id: "P4160",
		label: "Michelin Restaurants ID",
		example: [
			3226046
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a place in the website Michelin Voyages",
		datatype: "external-id",
		id: "P4161",
		label: "Michelin Voyages ID",
		example: [
			46,
			1142,
			148959,
			243
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a species on the Michigan Flora website",
		datatype: "external-id",
		id: "P6103",
		label: "Michigan Flora ID",
		example: [
			163445,
			58068868,
			158944
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an object in the Microsoft Academic Graph",
		datatype: "external-id",
		id: "P6366",
		label: "Microsoft Academic ID",
		example: [
			58420606,
			58622482,
			6049597,
			19859634,
			503424,
			50662,
			49108,
			37156,
			58132177,
			180445
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"MAG ID",
			"MAG",
			"Microsoft Academic Graph id",
			"MS Academic ID",
			"Microsoft Academic Author ID",
			"Microsoft Academic Source ID",
			"Microsoft Academic Institution ID",
			"Microsoft Academic Work ID",
			"Academic ID"
		]
	},
	{
		description: "identifier for a application in Microsoft Store",
		datatype: "external-id",
		id: "P5885",
		label: "Microsoft Store product ID",
		example: [
			2117484,
			857640,
			3884,
			30900894,
			66712874,
			18168774,
			23999306
		],
		types: [
			"for software"
		],
		aliases: [
			"Windows Store app ID",
			"Microsoft Store app identifier",
			"package, Microsoft Store",
			"package, Windows Store",
			"Microsoft Xbox Store app ID",
			"Xbox Store app ID",
			"Microsoft Store app ID"
		]
	},
	{
		description: "identifier for a taxon on the Microworld website",
		datatype: "external-id",
		id: "P7743",
		label: "Microworld ID",
		example: [
			79003696,
			5168941,
			9368192
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of entry in Middelnederlandsch Woordenboek on Geïntegreerde Taalbank",
		datatype: "external-id",
		label: "Middelnederlandsch Woordenboek GTB ID",
		id: "P5939",
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a scientist in the project Mille Anni di Scienza in Italia",
		datatype: "external-id",
		id: "P7744",
		label: "Mille Anni di Scienza in Italia ID",
		example: [
			3942499,
			39599,
			3934443,
			945443
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of the minerals locality in MinDat database",
		datatype: "external-id",
		id: "P6265",
		label: "MinDat Locality ID",
		example: [
			408,
			3224,
			4795869,
			2213648
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a mineral or related material (rock, mixture) in the MinDat database",
		datatype: "external-id",
		id: "P6263",
		label: "MinDat mineral ID",
		example: [
			413498,
			182344,
			1934730
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the Ming Qing Archive Name Authority Database",
		datatype: "external-id",
		id: "P6705",
		label: "Ming Qing Archive ID",
		example: [
			230200,
			17790,
			197344
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID number (Rol Base de Datos, RBD, in Spanish, meaning database role) of all schools (high, middle, primary) in Chile, as registered by the Ministry of Education of Chile",
		datatype: "external-id",
		id: "P1919",
		label: "Ministry of Education of Chile school ID",
		example: [
			752516
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a politician in the Italian Ministry of the Interior's database",
		datatype: "external-id",
		id: "P8648",
		label: "Ministry of the Interior of Italy ID",
		example: [
			23766020,
			3830393
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "access code of a service on the Minitel Videotex",
		datatype: "external-id",
		id: "P2878",
		label: "Minitel code",
		example: [
			642627
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a movie in the Russian Ministry of culture's public register of films",
		datatype: "external-id",
		id: "P2636",
		label: "Minkultury film ID",
		example: [
			6074
		],
		types: [
		],
		aliases: [
			"Film ID in Russian public register of films",
			"mkrf.ru",
			"mkrf"
		]
	},
	{
		description: "identifier for an artwork or other object on the Minneapolis Institute of Art website",
		datatype: "external-id",
		id: "P4712",
		label: "Minneapolis Institute of Art artwork ID",
		example: [
			5108848,
			2736720
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier assigned to a person or organization by the Minneapolis Institute of Art",
		datatype: "external-id",
		id: "P3603",
		label: "Minneapolis Institute of Art constituent ID",
		example: [
			1383354
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "official identifier for a Minnesota legislator",
		datatype: "external-id",
		id: "P3160",
		label: "Minnesota legislator ID",
		example: [
			862272
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an astronomical body in the Minor Planet Center database",
		datatype: "external-id",
		id: "P5736",
		label: "Minor Planet Center body ID",
		example: [
			15611,
			4541996,
			7470234
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "observational data for minor planets (asteroids) and comets",
		datatype: "external-id",
		id: "P717",
		label: "Minor Planet Center observatory code",
		example: [
			944482
		],
		types: [
		],
		aliases: [
			"IAU code"
		]
	},
	{
		description: "identifier for a journal in the Mir@bel database",
		datatype: "external-id",
		id: "P4730",
		label: "Mir@bel journal ID",
		example: [
			2986195,
			1234182
		],
		types: [
		],
		aliases: [
			"Mirabel ID",
			"Mir@bel ID",
			"Mirabel journal ID"
		]
	},
	{
		description: "identifier for medieval Latin writers",
		datatype: "external-id",
		id: "P7986",
		label: "Mirabile author ID",
		example: [
			369366,
			8018,
			102851
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for medieval manuscripts",
		datatype: "external-id",
		id: "P7989",
		label: "Mirabile manuscript ID",
		example: [
			1531846,
			2567818,
			62052158,
			152962
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for Christian saints",
		datatype: "external-id",
		id: "P7990",
		label: "Mirabile saint ID",
		example: [
			43399,
			33923,
			31966,
			128538,
			771956
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for medieval written works",
		datatype: "external-id",
		id: "P7991",
		label: "Mirabile title ID",
		example: [
			649642,
			738262,
			861927,
			372941
		],
		types: [
		],
		aliases: [
			"Mirabile work ID"
		]
	},
	{
		description: "identifier in the missionary archives of VID Specialized University",
		datatype: "external-id",
		id: "P3981",
		label: "Misjonsarkiv person ID",
		example: [
			17119608
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an entry on the Mississippi Encyclopedia website",
		datatype: "external-id",
		id: "P7688",
		label: "Mississippi Encyclopedia ID",
		example: [
			56469858,
			6819351,
			2122306,
			484643
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete on the Mississippi Sports Hall of Fame website",
		datatype: "external-id",
		id: "P4368",
		label: "Mississippi Sports Hall of Fame ID",
		example: [
			435765,
			6267489
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an athlete on the Missouri Sports Hall of Fame website",
		datatype: "external-id",
		id: "P4385",
		label: "Missouri Sports Hall of Fame ID",
		example: [
			14322398,
			1989517
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a video game on the Mixer live streaming video platform",
		datatype: "external-id",
		id: "P7335",
		label: "Mixer game ID [OBSOLETE]",
		example: [
			349375,
			62565771,
			27870279,
			2357719,
			61478103,
			28937399,
			55128278,
			54893555,
			49740,
			64083878
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Mixer game identifier"
		]
	},
	{
		description: "identifier for a historic bridge in the database of the Minnesota Department of Transportation",
		datatype: "external-id",
		id: "P8650",
		label: "MnDOT Historic Bridges ID",
		example: [
			30590134,
			16896017,
			99398814
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID for a place, person, organisation, or work at the Map of Early Modern London project of the University of Victoria, Canada",
		datatype: "external-id",
		id: "P6060",
		label: "MoEML ID",
		example: [
			404351,
			1230454,
			1094147,
			1243205
		],
		types: [
		],
		aliases: [
			"Map of Early Modern London ID"
		]
	},
	{
		description: "identifier for a company at MobyGames",
		datatype: "external-id",
		id: "P4773",
		label: "MobyGames company ID",
		example: [
			684425,
			782028
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of a developer at MobyGames",
		datatype: "external-id",
		id: "P3913",
		label: "MobyGames developer ID",
		example: [
			1082789,
			12382
		],
		types: [
		],
		aliases: [
			"mobygames.com developer ID"
		]
	},
	{
		description: "identifier for MobyGames",
		datatype: "external-id",
		id: "P1933",
		label: "MobyGames game ID",
		example: [
			893422,
			19419
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game genre in the MobyGames database",
		datatype: "external-id",
		id: "P7326",
		label: "MobyGames genre ID",
		example: [
			828322,
			1610017,
			744038
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a group in the MobyGames database",
		datatype: "external-id",
		id: "P5360",
		label: "MobyGames group ID",
		example: [
			188196,
			420292
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a platform in MobyGames",
		datatype: "external-id",
		id: "P5868",
		label: "MobyGames platform ID",
		example: [
			184198,
			627302,
			94
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a mod on Mod D",
		datatype: "external-id",
		id: "P8267",
		label: "Mod DB mod ID",
		example: [
			4038937,
			16740993,
			11692505
		],
		types: [
		],
		aliases: [
			"Mod DB mod"
		]
	},
	{
		description: "identifier of a video game on moddb.com",
		datatype: "external-id",
		id: "P6774",
		label: "Mod DB video game ID",
		example: [
			1755927,
			10493813,
			17452,
			193581
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"ModDB game ID"
		]
	},
	{
		description: "identifier for a fashion model in the 'New York' magazine database",
		datatype: "external-id",
		id: "P3379",
		label: "Model Manual ID",
		example: [
			265782,
			7931889
		],
		types: [
		],
		aliases: [
			"New York magazine fashion model ID"
		]
	},
	{
		description: "ID of chemical compound in ModelSEED",
		datatype: "external-id",
		id: "P8120",
		label: "ModelSEED compound ID",
		example: [
			283,
			161210,
			14982
		],
		types: [
			"related to chemistry",
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a performer on Modelhub",
		datatype: "external-id",
		id: "P8280",
		label: "Modelhub ID",
		example: [
			15576453,
			3916703,
			10368473
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a client in models.com",
		datatype: "external-id",
		id: "P2782",
		label: "Models.com client ID",
		example: [
			188326,
			36008
		],
		types: [
		],
		aliases: [
			"Models.com"
		]
	},
	{
		description: "identifier of a person in the Models.com website",
		datatype: "external-id",
		id: "P2471",
		label: "Models.com person ID",
		example: [
			151859,
			3946364
		],
		types: [
		],
		aliases: [
			"Models.com"
		]
	},
	{
		description: "Link to entry of Chinese articles on Moegirlpedia",
		datatype: "external-id",
		id: "P5737",
		label: "Moegirlpedia ID (Chinese)",
		example: [
			14785138,
			550596,
			844664,
			11233151
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "qualitative ordinal scale characterizing scratch resistance of various minerals",
		datatype: "quantity",
		id: "P1088",
		label: "Mohs' hardness",
		example: [
			43010,
			5283,
			134583
		],
		types: [
		],
		aliases: [
			"hardness",
			"Mohs hardness",
			"mineral hardness",
			"hardness of mineral"
		]
	},
	{
		description: "external identifiers for artists whose arts are sold through Mojarto",
		datatype: "external-id",
		id: "P7134",
		label: "Mojarto artist ID",
		example: [
			3635732,
			558522,
			3105774
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of former/disappeared mills in the Netherlands at the Molendatabase verdwenen molens",
		datatype: "external-id",
		id: "P2903",
		label: "Molendatabase verdwenen molens ID",
		example: [
			2236961,
			1825312
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of mills in Molenecho's, a database on windmills and watermills in Belgium",
		datatype: "external-id",
		id: "P2867",
		label: "Molenecho's ID",
		example: [
			1832030,
			2238673
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a disease in the Monarch Disease Ontology",
		datatype: "external-id",
		id: "P5270",
		label: "MonDO ID",
		example: [
			8277
		],
		types: [
			"representing a unique identifier",
			"related to medicine"
		],
		aliases: [
			"Monarch Disease Ontology ID"
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P8323",
		label: "Monasteries in the Netherlands until 1800 ID",
		example: [
			2290305,
			19288062
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "number given to each elementary particle",
		datatype: "string",
		id: "P1360",
		label: "Monte Carlo Particle Number",
		example: [
			3198,
			2225,
			3229
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a concert in the Montreux Jazz Festival database",
		datatype: "external-id",
		id: "P8300",
		label: "Montreux Jazz Festival concert ID",
		example: [
			94996551,
			94996810
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person in the Montreux Jazz Festival database",
		datatype: "external-id",
		id: "P8301",
		label: "Montreux Jazz Festival person ID",
		example: [
			190576,
			1708504
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a song performed during the Montreux Jazz Festival",
		datatype: "external-id",
		id: "P8302",
		label: "Montreux Jazz Festival song ID",
		example: [
			2725356,
			374156
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a memorial in the University of Lille database",
		datatype: "external-id",
		id: "P6238",
		label: "Monument aux morts ID",
		example: [
			59362584,
			20021757,
			59359658
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a protected monument in the Monumentbrowser database",
		datatype: "external-id",
		id: "P8543",
		label: "Monumentbrowser ID",
		example: [
			2560286,
			17985839,
			376571,
			921416
		],
		types: [
			"multi-source external identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a monument in São Paulo city, Brazil, on the Monumentos de São Paulo website",
		datatype: "external-id",
		id: "P4360",
		label: "Monumentos de São Paulo ID",
		example: [
			10332148,
			2916105
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a taxon in the Moose Deutschland database",
		datatype: "external-id",
		id: "P7255",
		label: "Moose Deutschland ID",
		example: [
			17199955,
			17267949,
			15580464
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on Moov music site",
		datatype: "external-id",
		id: "P6923",
		label: "Moov artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the Moravian Lives database",
		datatype: "external-id",
		id: "P8139",
		label: "Moravian Lives ID",
		example: [
			76336,
			4888851,
			7496562
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a work listed in the Mormon Literature and Creative Arts Database",
		datatype: "external-id",
		id: "P5495",
		label: "Mormon Literature and Creative Arts Database Works ID",
		example: [
			816016,
			189378
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person listed in the Mormon Literature and Creative Arts Database",
		datatype: "external-id",
		id: "P5469",
		label: "Mormon Literature and Creative Arts Database artist ID",
		example: [
			189642,
			3160911
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier used for cultural patrimoine in Morocco",
		datatype: "external-id",
		id: "P5694",
		label: "Moroccan cultural heritage ID",
		example: [
			391215,
			38769071,
			12246208
		],
		types: [
		],
		aliases: [
			"Inventaire et Documentation du Patrimoine Culturel du Maroc ID",
			"IDPCM ID"
		]
	},
	{
		description: "identifier for moths found in India maintained by the 'Moths of India' database",
		datatype: "external-id",
		id: "P7538",
		label: "Moths of India ID",
		example: [
			13456651,
			3539150,
			134724
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a motorcycle racer on the MotoGP website",
		datatype: "external-id",
		id: "P3928",
		label: "MotoGP racer ID",
		example: [
			61380,
			301842
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Mini biographies of the inductees to the Motorsports Hall of Fame of America",
		datatype: "external-id",
		id: "P6682",
		label: "Motorsports Hall of Fame of America ID",
		example: [
			6104895,
			888441,
			946583,
			6208342
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an inductee on the Mountain Bike Hall of Fame website",
		datatype: "external-id",
		id: "P4468",
		label: "Mountain Bike Hall of Fame inductee ID",
		example: [
			3106964,
			923510
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a climbing area or route on the 'Mountain Project' website",
		datatype: "external-id",
		id: "P4592",
		label: "Mountain Project ID",
		example: [
			7450337,
			1143382,
			735202,
			2413145
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a gene in the Mouse Genome Informatics database",
		datatype: "external-id",
		id: "P671",
		label: "Mouse Genome Informatics ID",
		example: [
			192642,
			227241,
			170617
		],
		types: [
		],
		aliases: [
			"MGI",
			"MGI ID",
			"Mouse Genome Informatics"
		]
	},
	{
		description: "identifier for a movie on the Movie Review Query Engine website",
		datatype: "external-id",
		id: "P8033",
		label: "Movie Review Query Engine ID",
		example: [
			106428,
			47703,
			60501923
		],
		types: [
		],
		aliases: [
			"MRQE ID"
		]
	},
	{
		description: "identifier of a film in the Movie Walker Database. Format: \"mv\" followed by digits",
		datatype: "external-id",
		id: "P2509",
		label: "Movie Walker film ID",
		example: [
			189540,
			860461,
			155653
		],
		types: [
		],
		aliases: [
			"Movie Walker film identifier"
		]
	},
	{
		description: "identifier of person on Movie Walker database",
		datatype: "external-id",
		id: "P7745",
		label: "Movie Walker person ID",
		example: [
			191917,
			55400,
			1196972
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the movie.ge site",
		datatype: "external-id",
		id: "P7653",
		label: "MovieGe person ID",
		example: [
			106443,
			717487,
			295592,
			2299195
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the MovieMeter film database",
		datatype: "external-id",
		id: "P1969",
		label: "MovieMeter director ID",
		example: [
			129079
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film on the website MovieMeter",
		datatype: "external-id",
		id: "P1970",
		label: "MovieMeter film ID",
		example: [
			166960,
			1540328
		],
		types: [
		],
		aliases: [
			"MovieMeter movie identifier"
		]
	},
	{
		description: "identifier for films on Moviepilot.de",
		datatype: "external-id",
		id: "P5786",
		label: "Moviepilot.de film ID",
		example: [
			2201,
			104123,
			190050
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for TV series on Moviepilot.de",
		datatype: "external-id",
		id: "P5925",
		label: "Moviepilot.de series ID",
		example: [
			25104078,
			728553,
			1079
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for TV-series in movieplayer.it",
		datatype: "external-id",
		id: "P4784",
		label: "Movieplayer TV-series ID",
		example: [
			2947967
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for film in movieplayer.it",
		datatype: "external-id",
		id: "P4783",
		label: "Movieplayer film ID",
		example: [
			209538,
			59084
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a character in movieplayer.it",
		datatype: "external-id",
		id: "P4782",
		label: "Movieplayer person ID",
		example: [
			172140,
			16590208,
			13909
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a film on the Movies Anywhere service",
		datatype: "external-id",
		id: "P5990",
		label: "Movies Anywhere ID",
		example: [
			181795,
			83495,
			483815,
			24815,
			24832112,
			131074
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "article that describes the item on Mozilla Developer Network website",
		datatype: "external-id",
		id: "P8205",
		label: "Mozilla Developer Network article",
		example: [
			64728505,
			947284,
			657954
		],
		types: [
		],
		aliases: [
			"MDN ID"
		]
	},
	{
		description: "identifier for a movie/film at the website Mtime",
		datatype: "external-id",
		id: "P6458",
		label: "Mtime movie ID",
		example: [
			1074043,
			25431158,
			1339165
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a movie/film maker at the website Mtime",
		datatype: "external-id",
		id: "P6464",
		label: "Mtime people ID",
		example: [
			5236475,
			80046,
			15069836
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a sculpture in Brazil, in the MuBE database",
		datatype: "external-id",
		id: "P4721",
		label: "MuBE Virtual ID",
		example: [
			44993196,
			44495392
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a collection in the Estonian museum database MuIS",
		datatype: "external-id",
		id: "P5656",
		label: "MuIS collection ID",
		example: [
			55986654,
			55986655,
			55986738
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an object in the Estonian museum database MuIS",
		datatype: "external-id",
		id: "P4525",
		label: "MuIS object ID",
		example: [
			21257452
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person or group in the Estonian museum database MuIS",
		datatype: "external-id",
		id: "P4889",
		label: "MuIS person or group ID",
		example: [
			6305078,
			12376420
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a journalist at the website Muck Rack",
		datatype: "external-id",
		id: "P6005",
		label: "Muck Rack journalist ID",
		example: [
			50874725,
			55615343,
			16513975
		],
		types: [
		],
		aliases: [
			"MuckRack journalist ID",
			"MuckRack ID",
			"Muck Rack  ID"
		]
	},
	{
		description: "identifier of a video game from the website Multiplayer.it",
		datatype: "external-id",
		id: "P6267",
		label: "Multiplayer ID",
		example: [
			717600,
			717600
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a person, in the biographical website of the Royal College of Physicians, London",
		datatype: "external-id",
		id: "P2941",
		label: "Munk's Roll ID",
		example: [
			93128
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"Munks Roll ID",
			"The Roll of the Royal College of Physicians of London ID",
			"Inspiring Physicians ID"
		]
	},
	{
		description: "identifier on the Munzinger Archiv",
		datatype: "external-id",
		id: "P1286",
		label: "Munzinger Pop ID",
		example: [
			272203
		],
		types: [
		],
		aliases: [
			"Munzinger Pop",
			"Munzinger Pop identifier"
		]
	},
	{
		description: "identifer on the Munzinger Archiv",
		datatype: "external-id",
		id: "P1285",
		label: "Munzinger Sport number",
		example: [
			74909
		],
		types: [
			"related to sport"
		],
		aliases: [
		]
	},
	{
		description: "identifier on the Munzinger Archiv",
		datatype: "external-id",
		id: "P1284",
		label: "Munzinger person ID",
		example: [
			1684721,
			1932603
		],
		types: [
		],
		aliases: [
			"Munzinger IBA",
			"Munzinger Personen – Internationales Biographisches Archiv ID",
			"Internationales Biographisches Archiv ID"
		]
	},
	{
		description: "identifier for an artist on Murfie music site",
		datatype: "external-id",
		id: "P6924",
		label: "Murfie artist ID",
		example: [
			383541,
			200577,
			637865
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the MuseScore database",
		datatype: "external-id",
		id: "P4097",
		label: "MuseScore ID",
		example: [
			212776
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on MuseScore",
		datatype: "external-id",
		id: "P8334",
		label: "MuseScore artist ID",
		example: [
			1339,
			383541,
			636
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of persons and organisations on Museen der Stadt Dresden",
		datatype: "external-id",
		id: "P8653",
		label: "Museen Dresden article ID",
		example: [
			1719717,
			347567
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork on the website of the Association des Conservateurs des Musées des Hauts-de-France",
		datatype: "external-id",
		id: "P6565",
		label: "Musenor artwork ID",
		example: [
			15874380,
			61877628,
			17495289
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an artist in the Museo del Prado web page",
		datatype: "external-id",
		id: "P5321",
		label: "Museo del Prado artist ID",
		example: [
			5432
		],
		types: [
		],
		aliases: [
			"El Prado artist ID",
			"Prado museum artist ID",
			"Prado artist ID"
		]
	},
	{
		description: "identifer for a museum in the Museofile database of the French ministry of culture",
		datatype: "external-id",
		id: "P539",
		label: "Museofile",
		example: [
			19675,
			3329099,
			3329647
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "online catalog ID for Museu Nacional",
		datatype: "external-id",
		id: "P5954",
		label: "Museu Nacional ID",
		example: [
			56810437,
			56810439,
			4035016
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for the Memes Museum of the Brazilian Fluminense Federal University",
		datatype: "external-id",
		id: "P7946",
		label: "Museu de Memes ID",
		example: [
			48893113,
			4606965,
			7714263
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "IMLS identifier for a museum, in the United States' 'Museum Universe Data File' (MUDF)",
		datatype: "external-id",
		id: "P6006",
		label: "Museum Universe Data File ID",
		example: [
			48844756,
			30258019,
			5168062
		],
		types: [
		],
		aliases: [
			"MUDF",
			"MUDFID",
			"MUDF ID",
			"IMLS MUDF"
		]
	},
	{
		description: "database of entities found in the Museum of Family History",
		datatype: "external-id",
		id: "P8358",
		label: "Museum of Family History ID",
		example: [
			76178004,
			7171316
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork or other object on the Museum of Fine Arts, Boston website",
		datatype: "external-id",
		id: "P4625",
		label: "Museum of Fine Arts, Boston object ID",
		example: [
			219344,
			890678
		],
		types: [
		],
		aliases: [
			"MFAID",
			"MFA ID",
			"MFABID",
			"MFA Boston object ID",
			"MFA object ID"
		]
	},
	{
		description: "identifier for an artwork or other object on the Museum of Fine Arts, Houston website",
		datatype: "external-id",
		id: "P4673",
		label: "Museum of Fine Arts, Houston object ID",
		example: [
			28043172,
			28093985
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier assigned to an artist by the Museum of Modern Art",
		datatype: "external-id",
		id: "P2174",
		label: "Museum of Modern Art artist ID",
		example: [
			602999,
			5451020
		],
		types: [
		],
		aliases: [
			"MoMA artist ID"
		]
	},
	{
		description: "online exhibition identifier for a Museum of Modern Art or MoMA PS1 exhibition",
		datatype: "external-id",
		id: "P7778",
		label: "Museum of Modern Art online exhibition ID",
		example: [
			52593763,
			70438039
		],
		types: [
		],
		aliases: [
			"MoMA exhibition id"
		]
	},
	{
		description: "identifier for a work held at the Museum of Modern Art (MoMA)",
		datatype: "external-id",
		id: "P2014",
		label: "Museum of Modern Art work ID",
		example: [
			19888950
		],
		types: [
		],
		aliases: [
			"MoMA work ID"
		]
	},
	{
		description: "Registration Code from the association of museums in Autria",
		datatype: "external-id",
		id: "P7917",
		label: "Museums in Austria Code",
		example: [
			95569,
			2809471,
			1454512
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of a taxon name at Mushroom Observer",
		datatype: "external-id",
		id: "P6101",
		label: "Mushroom Observer ID",
		example: [
			49601608,
			10560228,
			174698,
			1124575
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on Music Canada music site",
		datatype: "external-id",
		id: "P6970",
		label: "Music Canada artist ID",
		example: [
			313453,
			200577,
			682030
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an area in the MusicBrainz open music database",
		datatype: "external-id",
		id: "P982",
		label: "MusicBrainz area ID",
		example: [
			64,
			56149
		],
		types: [
		],
		aliases: [
			"area MBID",
			"MBID area",
			"MBarea"
		]
	},
	{
		description: "identifier for an artist in the MusicBrainz open music encyclopedia",
		datatype: "external-id",
		id: "P434",
		label: "MusicBrainz artist ID",
		example: [
			1299,
			2599,
			383541
		],
		types: [
		],
		aliases: [
			"artist MBID",
			"MBID artist",
			"artist ID",
			"MusicBrainz person ID",
			"MBA",
			"MB artist ID",
			"BBC Music artist ID"
		]
	},
	{
		description: "identifier for an event in the MusicBrainz open music encyclopedia",
		datatype: "external-id",
		id: "P6423",
		label: "MusicBrainz event ID",
		example: [
			171784,
			211942,
			10157,
			25408640
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"event MBID",
			"MBID event",
			"event ID",
			"MBE",
			"MB event ID"
		]
	},
	{
		description: "identifier for a genre on the MusicBrainz open music encyclopedia",
		datatype: "external-id",
		id: "P8052",
		label: "MusicBrainz genre ID",
		example: [
			1754592,
			11401,
			11365
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"MB genre ID"
		]
	},
	{
		description: "identifier for an instrument on the music encyclopedia MusicBrainz",
		datatype: "external-id",
		id: "P1330",
		label: "MusicBrainz instrument ID",
		example: [
			79838
		],
		types: [
		],
		aliases: [
			"instrument MBID",
			"MBID instrument",
			"MBinst"
		]
	},
	{
		description: "identifier for a label in the MusicBrainz open music encyclopedia",
		datatype: "external-id",
		id: "P966",
		label: "MusicBrainz label ID",
		example: [
			1132897,
			10398667
		],
		types: [
		],
		aliases: [
			"Label MBID",
			"MusicBrainz Record Label ID",
			"MB label",
			"MBID label",
			"label ID",
			"MB label ID",
			"MBL"
		]
	},
	{
		description: "Identifier for a place in the MusicBrainz open music encyclopedia",
		datatype: "external-id",
		id: "P1004",
		label: "MusicBrainz place ID",
		example: [
			209651
		],
		types: [
		],
		aliases: [
			"place MBID",
			"MB place id",
			"place ID",
			"MBID place",
			"MBP"
		]
	},
	{
		description: "identifier for a recording in the MusicBrainz open music encyclopedia",
		datatype: "external-id",
		id: "P4404",
		label: "MusicBrainz recording ID",
		example: [
			56070931
		],
		types: [
		],
		aliases: [
			"MB recording ID",
			"MBrec",
			"recording MBID",
			"recording ID (MusicBrainz)",
			"track ID (MusicBrainz)",
			"MusicBrainz track ID"
		]
	},
	{
		description: "identifier for a release in the MusicBrainz open music encyclopedia (edition)",
		datatype: "external-id",
		id: "P5813",
		label: "MusicBrainz release ID",
		example: [
			56055356,
			54641059,
			54641193
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"MB release ID",
			"MBR",
			"release MBID",
			"release ID (MusicBrainz)"
		]
	},
	{
		description: "identifier for a release group per the MusicBrainz open music encyclopedia (album, single, etc.)",
		datatype: "external-id",
		id: "P436",
		label: "MusicBrainz release group ID",
		example: [
			193477
		],
		types: [
		],
		aliases: [
			"release group MBID",
			"album MBID",
			"single MBID",
			"EP MBID",
			"MusicBrainz album",
			"MBID release group",
			"MB release group ID",
			"MBRG",
			"album ID (MusicBrainz)",
			"release group ID (MusicBrainz)",
			"single ID (MusicBrainz)",
			"EP ID (MusicBrainz)",
			"MusicBrainz master ID",
			"master ID (MusicBrainz)"
		]
	},
	{
		description: "identifier for a series per the MusicBrainz open music encyclopedia",
		datatype: "external-id",
		id: "P1407",
		label: "MusicBrainz series ID",
		example: [
			214203
		],
		types: [
		],
		aliases: [
			"Series MBID",
			"Series ID",
			"MB series ID",
			"MBS"
		]
	},
	{
		description: "identifier for a work per the MusicBrainz open music encyclopedia",
		datatype: "external-id",
		id: "P435",
		label: "MusicBrainz work ID",
		example: [
			55777670,
			59297929
		],
		types: [
		],
		aliases: [
			"work MBID",
			"song MBID",
			"MusicBrainz work MBID",
			"MBID work",
			"MB work ID",
			"MBW",
			"work ID (MusicBrainz)",
			"song ID (MusicBrainz)",
			"MusicBrainz song ID",
			"MusicBrainz composition ID",
			"composition ID (MusicBrainz)"
		]
	},
	{
		description: "identifier for a product in the MusicNotes store",
		datatype: "external-id",
		id: "P6111",
		label: "MusicNotes product ID",
		example: [
			56085788,
			57782115,
			55975144
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a composition in MusicNotes",
		datatype: "external-id",
		id: "P6122",
		label: "MusicNotes song ID",
		example: [
			1886329,
			57897076,
			57903096
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a composer in the Musicalics database",
		datatype: "external-id",
		id: "P6925",
		label: "Musicalics composer ID",
		example: [
			321510,
			524152,
			361622,
			254
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on Musiikkituottajat music site",
		datatype: "external-id",
		id: "P6964",
		label: "Musiikkituottajat artist (certyfication) ID",
		example: [
			383541,
			637865,
			913395
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on Musiikkituottajat music site",
		datatype: "external-id",
		id: "P7672",
		label: "Musiikkituottajat artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the Swedish Musikverket database of the performing arts",
		datatype: "external-id",
		id: "P4357",
		label: "Musikverket person ID",
		example: [
			4945718
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author in the Musisque Deoque digital library",
		datatype: "external-id",
		id: "P6999",
		label: "Musisque Deoque author ID",
		example: [
			1398,
			352684,
			714798
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a work in the Musisque Deoque digital library",
		datatype: "external-id",
		id: "P8312",
		label: "Musisque Deoque work ID",
		example: [
			546203,
			1684171
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on Musixmatch",
		datatype: "external-id",
		id: "P6874",
		label: "Musixmatch artist ID",
		example: [
			292265,
			58785,
			1881284
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a song on Musixmatch",
		datatype: "external-id",
		id: "P6742",
		label: "Musixmatch track ID",
		example: [
			16690331,
			29469380,
			890
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for writers/authors in Musixmatch database",
		datatype: "external-id",
		id: "P7070",
		label: "Musixmatch writer ID",
		example: [
			1976093,
			219631,
			21808729
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a composer in the musopen.org database",
		datatype: "external-id",
		id: "P2338",
		label: "Musopen composer ID",
		example: [
			254
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork on the website of the Musée Picasso, in Paris",
		datatype: "external-id",
		id: "P6358",
		label: "Musée Picasso artwork ID",
		example: [
			3209745,
			2872713,
			3337122
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "numeric ID for an artist in the Répertoire des artistes documentation database of the Orsay Museum",
		datatype: "external-id",
		id: "P2268",
		label: "Musée d'Orsay artist ID",
		example: [
			296,
			113144
		],
		types: [
		],
		aliases: [
			"Orsay Museum artist ID"
		]
	},
	{
		description: "identifier for an artwork or other object on the Musée d'Orsay website",
		datatype: "external-id",
		id: "P4659",
		label: "Musée d'Orsay artwork ID",
		example: [
			1451508,
			3178029
		],
		types: [
		],
		aliases: [
			"Orsay Museum artwork ID",
			"Musee d'Orsay artwork ID"
		]
	},
	{
		description: "identifier for a person on the online Musée de la Résistance",
		datatype: "external-id",
		id: "P7698",
		label: "Musée de la Résistance ID",
		example: [
			271991,
			312026,
			871444
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork or other object on the Musée des Augustins website",
		datatype: "external-id",
		id: "P4739",
		label: "Musée des Augustins artwork ID",
		example: [
			3346686,
			16652033
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a work on the Muséosphère website",
		datatype: "external-id",
		id: "P6310",
		label: "Muséosphère work ID",
		example: [
			18927291,
			20087570,
			60054511
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a composer at Mutopia Project",
		datatype: "external-id",
		id: "P3674",
		label: "Mutopia composer ID",
		example: [
			1340
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist in the MutualArt database",
		datatype: "external-id",
		id: "P6578",
		label: "MutualArt artist ID",
		example: [
			61927321,
			188385
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a performer, composer or band at Muziekweb",
		datatype: "external-id",
		id: "P5882",
		label: "Muziekweb performer ID",
		example: [
			13462155,
			2328971,
			2734773,
			13909
		],
		types: [
		],
		aliases: [
			"Muziekweb artist ID",
			"Muziekweb band ID"
		]
	},
	{
		description: "identifier for an anime on MyAnimeList",
		datatype: "external-id",
		id: "P4086",
		label: "MyAnimeList anime ID",
		example: [
			4277,
			232246
		],
		types: [
		],
		aliases: [
			"MAL anime ID"
		]
	},
	{
		description: "identifier for a fictional character on MyAnimeList",
		datatype: "external-id",
		id: "P4085",
		label: "MyAnimeList character ID",
		example: [
			696766,
			2570349
		],
		types: [
		],
		aliases: [
			"MAL character ID"
		]
	},
	{
		description: "identifier for a manga on MyAnimeList",
		datatype: "external-id",
		id: "P4087",
		label: "MyAnimeList manga ID",
		example: [
			1195326
		],
		types: [
		],
		aliases: [
			"MAL manga ID",
			"Manga ID MAL"
		]
	},
	{
		description: "identifier for a person or group of people on MyAnimeList",
		datatype: "external-id",
		id: "P4084",
		label: "MyAnimeList people ID",
		example: [
			55400,
			334471,
			1051860,
			519821,
			692
		],
		types: [
		],
		aliases: [
			"MAL people ID",
			"MyAnimeList person ID",
			"MAL person ID"
		]
	},
	{
		description: "identifier for a person in the MyDramaList database",
		datatype: "external-id",
		id: "P3862",
		label: "MyDramaList name ID",
		example: [
			487962,
			464645
		],
		types: [
		],
		aliases: [
			"My Drama List name ID"
		]
	},
	{
		description: "identifier for a Film and TV Series in the MyDramaList database",
		datatype: "external-id",
		id: "P3868",
		label: "MyDramaList title ID",
		example: [
			15635278,
			39946
		],
		types: [
		],
		aliases: [
			"My Drama List title ID"
		]
	},
	{
		description: "string identifying a surname (family name) at the MyHeritage genealogy website",
		datatype: "external-id",
		id: "P5452",
		label: "MyHeritage Surname ID",
		example: [
			1397060,
			16802302,
			19861038,
			1158446
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "external identifier to link data about Indian political parties",
		datatype: "external-id",
		id: "P6716",
		label: "MyNeta.info political party ID",
		example: [
			10225,
			837159,
			129844
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier per MycoBank - a database that provides an authoritative and comprehensive list of names of fungi",
		datatype: "external-id",
		id: "P962",
		label: "MycoBank taxon name ID",
		example: [
			28951,
			10515802
		],
		types: [
		],
		aliases: [
			"MycoBank taxon name identifier",
			"MycoBank ID"
		]
	},
	{
		description: "identifier for a person or organisation, at Myspace",
		datatype: "external-id",
		id: "P3265",
		label: "Myspace ID",
		example: [
			2906956,
			383541,
			1738018
		],
		types: [
			"for items about people",
			"for items about organizations"
		],
		aliases: [
			"Myspace"
		]
	},
	{
		description: "identifier for a 19th century French journalist on the Médias 19 website",
		datatype: "external-id",
		id: "P7918",
		label: "Médias 19 ID",
		example: [
			15407080,
			54153739,
			960277
		],
		types: [
		],
		aliases: [
			"Medias 19 ID"
		]
	},
	{
		description: "identifier for a doctor in the Médicos históricos database of the Complutense University of Madrid",
		datatype: "external-id",
		id: "P5496",
		label: "Médicos históricos doctor ID",
		example: [
			22813795,
			55405060,
			12392895
		],
		types: [
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "French government database indexing all french soldier war casualties",
		datatype: "external-id",
		id: "P2071",
		label: "Mémoire des hommes ID",
		example: [
			19841814
		],
		types: [
		],
		aliases: [
			"memoire des hommes"
		]
	},
	{
		description: "identifier for a person on the Mémoire du cyclisme website",
		datatype: "external-id",
		id: "P4516",
		label: "Mémoire du cyclisme cyclist ID",
		example: [
			13484,
			1310342
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of a monument (war memorial) on MémorialGenWeb database",
		datatype: "external-id",
		id: "P8157",
		label: "MémorialGenWeb monument ID",
		example: [
			66693868,
			33191733,
			90157033
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a monument in the Mérimée database of French cultural heritage",
		datatype: "external-id",
		id: "P380",
		label: "Mérimée ID",
		example: [
			184407,
			757180
		],
		types: [
		],
		aliases: [
			"Mérimée identifier"
		]
	},
	{
		description: "transliteration system of the Manchu alphabet",
		datatype: "string",
		id: "P5139",
		label: "Möllendorff transliteration",
		example: [
			8733
		],
		types: [
			"for romanization system"
		],
		aliases: [
			"Möllendorff system",
			"Moellendorff system",
			"Moellendorff transliteration"
		]
	},
	{
		description: "identifier for articles at muenchenwiki.de",
		datatype: "external-id",
		id: "P7140",
		label: "München Wiki article ID",
		example: [
			154568,
			707679,
			70487,
			383313,
			41262461
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"München Wiki ID",
			"München Wiki article",
			"muenchenwiki.de ID"
		]
	},
	{
		description: "code in the statistical classification of economic activities in the European Community (NACE)",
		datatype: "string",
		id: "P4496",
		label: "NACE code",
		example: [
			29584963,
			29584349
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "the topographic database at the Swedish National Archive",
		datatype: "external-id",
		id: "P7434",
		label: "NAD place ID",
		example: [
			10688470,
			62469,
			10671819
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "classification in the North American Industry Classification System",
		datatype: "external-id",
		id: "P3224",
		label: "NAICS code",
		example: [
			746369
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "integer code assigned by NASA's Navigation and Ancillary Information Facility to solar system objects, reference frames, and instruments that it tracks",
		datatype: "external-id",
		id: "P2956",
		label: "NAIF ID",
		example: [
			111,
			1349030,
			205747,
			618630
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the subject categories of the Agricultural Thesaurus of United States National Agricultural Library",
		datatype: "external-id",
		id: "P2004",
		label: "NALT ID",
		example: [
			72313,
			629
		],
		types: [
		],
		aliases: [
			"USDA NALT ID"
		]
	},
	{
		description: "official identifier of a person elected to the National Assembly of Quebec (NAQ) or one of its predecessors",
		datatype: "external-id",
		id: "P3055",
		label: "NAQ elected person ID",
		example: [
			3435013,
			513514,
			3242479
		],
		types: [
		],
		aliases: [
			"National Assembly of Quebec ID",
			"Quebec MNA ID"
		]
	},
	{
		description: "the unique identifier assigned to a National Archives and Records Administration collection",
		datatype: "external-id",
		id: "P6761",
		label: "NARA collection identifier",
		example: [
			59480206,
			59480207,
			59480209,
			59493042
		],
		types: [
			"multi-source external identifier"
		],
		aliases: [
		]
	},
	{
		description: "the unique number assigned to a National Archives and Records Administration record group in United States",
		datatype: "external-id",
		id: "P6759",
		label: "NARA record group number",
		example: [
			59296199,
			59405223,
			59405143,
			59408145
		],
		types: [
			"multi-source external identifier"
		],
		aliases: [
		]
	},
	{
		description: "Dutch researchers with information about publications",
		datatype: "external-id",
		id: "P7449",
		label: "NARCIS researcher ID",
		example: [
			710978,
			63254197,
			2789119
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a species in the Nonindigenous Aquatic Species database, on the U.S. Geological Survey website",
		datatype: "external-id",
		id: "P6163",
		label: "NAS ID",
		example: [
			1594865,
			1142975,
			674891
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an exoplanet on the NASA Exoplanet Archive website",
		datatype: "external-id",
		id: "P5667",
		label: "NASA Exoplanet Archive exoplanet ID",
		example: [
			55392192,
			53616218,
			55392188
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P8102",
		label: "NASA active astronaut ID - DO NOT USE",
		example: [
			318934,
			13500192,
			3197699
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier used by NASA for an astronaut or cosmonaut",
		datatype: "external-id",
		id: "P2030",
		label: "NASA biographical ID",
		example: [
			1615,
			1345924
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "13-digit numeric code identifying an object used by NATO member country armed forces",
		datatype: "external-id",
		id: "P5581",
		label: "NATO Stock Number",
		example: [
			1064858,
			42177,
			55236915,
			173684,
			223318,
			223318,
			180285,
			17519093,
			890185,
			387188,
			387188,
			816695
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"NSN"
		]
	},
	{
		description: "NATO Code for Grades of Military Personnel",
		datatype: "wikibase-item",
		id: "P1611",
		label: "NATO code for grade",
		example: [
			1331037
		],
		types: [
			"for items about people"
		],
		aliases: [
		]
	},
	{
		description: "official reporting name assigned by the ASCC for NATO use",
		datatype: "string",
		id: "P561",
		label: "NATO reporting name",
		example: [
			150609
		],
		types: [
		],
		aliases: [
			"ASCC reporting name",
			"NATO code name"
		]
	},
	{
		description: "identifier of a work, in the National Audiovisual Archive of Hungary",
		datatype: "external-id",
		id: "P2475",
		label: "NAVA ID",
		example: [
			987167
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a basketball player on the National Basketball Association's website",
		datatype: "external-id",
		id: "P3647",
		label: "NBA.com player ID",
		example: [
			17306022,
			23541220,
			41421
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifіer for crop pests found in India",
		datatype: "external-id",
		id: "P7539",
		label: "NBAIR pest ID",
		example: [
			14830104,
			10579809,
			10724187
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a taxon in the National Biodiversity Network (UK)",
		datatype: "external-id",
		id: "P3240",
		label: "NBN System Key",
		example: [
			165145
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an American college sports team on the National Collegiate Athletic Association's website",
		datatype: "external-id",
		id: "P3692",
		label: "NCAA sports team ID",
		example: [
			3503744,
			691912
		],
		types: [
		],
		aliases: [
			"National Collegiate Athletic Association sports team ID"
		]
	},
	{
		description: "unique gene identifier that can be used for any species of organism",
		datatype: "external-id",
		id: "P2393",
		label: "NCBI locus tag",
		example: [
			21279562
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifer for a taxon in the Taxonomy Database by the National Center for Biotechnology Information",
		datatype: "external-id",
		id: "P685",
		label: "NCBI taxonomy ID",
		example: [
			5
		],
		types: [
		],
		aliases: [
			"ncbi",
			"NCBI"
		]
	},
	{
		description: "identifier for a school district or education agency in the United States",
		datatype: "external-id",
		id: "P2483",
		label: "NCES District ID",
		example: [
			1320340,
			599573
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"district ID (NCES)",
			"school district ID (NCES)",
			"LEAID",
			"local education agency ID",
			"state education agency ID",
			"SEAID",
			"regional education agency ID"
		]
	},
	{
		description: "identifier for a school in the United States",
		datatype: "external-id",
		id: "P2484",
		label: "NCES School ID",
		example: [
			5592543,
			7135405,
			2592847
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the United States National Cancer Institute Thesaurus, vocabulary for clinical care, translational and basic research, etc",
		datatype: "string",
		id: "P1748",
		label: "NCI Thesaurus ID",
		example: [
			1133289
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"NCIt",
			"NCIT ID"
		]
	},
	{
		description: "identifier for authority control issued by the National Central Library in Taiwan",
		datatype: "external-id",
		id: "P1048",
		label: "NCL ID",
		example: [
			228889,
			264517
		],
		types: [
		],
		aliases: [
			"NCL identifier",
			"National Central Library identifier"
		]
	},
	{
		description: "identifier of a missing or unidentified person at the United States' National Center for Missing & Exploited Children",
		datatype: "external-id",
		id: "P3718",
		label: "NCMEC person ID",
		example: [
			6266778
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a subject in the online encyclopedia NCpedia, that covers North Carolina",
		datatype: "external-id",
		id: "P6284",
		label: "NCpedia ID",
		example: [
			7442013,
			7076608,
			26013,
			507587
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "NDB identifier for airport beacons",
		datatype: "external-id",
		id: "P5762",
		label: "NDB identifier for airport beacons",
		example: [
			1430810,
			619845,
			1370380
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for the National Drug File Reference Terminology",
		datatype: "external-id",
		id: "P2115",
		label: "NDF-RT ID",
		example: [
			423111
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Japanese National Bibliography Number of the National Diet Library",
		datatype: "external-id",
		id: "P2687",
		label: "NDL JPNO",
		example: [
			15231929
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an edition in the National Diet Library",
		datatype: "external-id",
		id: "P1054",
		label: "NDL bib ID",
		example: [
			15231929
		],
		types: [
		],
		aliases: [
			"NDL catalog ID"
		]
	},
	{
		description: "identifier in the NDL (National Diet Library) Japanese Law Index",
		datatype: "external-id",
		id: "P8635",
		label: "NDL law ID",
		example: [
			10372494,
			11404606
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of article on the Swedish Nationalencyklopedin (NE.se) site",
		datatype: "external-id",
		id: "P3222",
		label: "NE.se ID",
		example: [
			30547,
			16961425,
			9391
		],
		types: [
		],
		aliases: [
			"Nationalencyklopedin Online ID",
			"NE.se",
			"NE ID",
			"Nationalencyklopedin ID"
		]
	},
	{
		description: "identifier in the NEC Retro wiki",
		datatype: "external-id",
		id: "P7669",
		label: "NEC Retro ID",
		example: [
			1053093,
			7853786,
			64584688,
			930222
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier of a video game in the NES Cart Database",
		datatype: "external-id",
		id: "P7747",
		label: "NES Cart Database ID",
		example: [
			11168,
			639619,
			1026656
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for person's profile at fotball.no, the official website of the Norwegian Football Federation",
		datatype: "external-id",
		id: "P3936",
		label: "NFF person ID",
		example: [
			167240,
			26054
		],
		types: [
		],
		aliases: [
			"Fotball.no person ID",
			"Football Association of Norway person ID",
			"Norges Fotballforbund person ID",
			"Norwegian Football Federation person ID"
		]
	},
	{
		description: "identifier for American football players at NFL.com",
		datatype: "external-id",
		id: "P3539",
		label: "NFL.com ID",
		example: [
			313381,
			505423
		],
		types: [
		],
		aliases: [
			"National Football League player ID",
			"NFL ID"
		]
	},
	{
		description: "NFPA rating for a chemical's flammability (red quadrant in fire diamond)",
		datatype: "string",
		id: "P994",
		label: "NFPA Fire",
		example: [
			1904422,
			283
		],
		types: [
			"with datatype string that is not an external identifier",
			"related to chemistry"
		],
		aliases: [
			"NFPA Flammability"
		]
	},
	{
		description: "NFPA rating for a chemical's hazard to health (blue quadrant in fire diamond)",
		datatype: "string",
		id: "P993",
		label: "NFPA Health",
		example: [
			1904422,
			283
		],
		types: [
			"with datatype string that is not an external identifier",
			"related to chemistry"
		],
		aliases: [
		]
	},
	{
		description: "NFPA rating for chemical or physical reactivity (yellow quadrant in fire diamond)",
		datatype: "string",
		id: "P995",
		label: "NFPA Instability",
		example: [
			1904422,
			283
		],
		types: [
			"with datatype string that is not an external identifier",
			"related to chemistry"
		],
		aliases: [
			"NFPA Reactivity"
		]
	},
	{
		description: "NFPA code for a chemical's other hazards in white (bottom) quadrant",
		datatype: "string",
		id: "P877",
		label: "NFPA Special",
		example: [
			1904422,
			283
		],
		types: [
			"with datatype string that is not an external identifier",
			"related to chemistry"
		],
		aliases: [
			"NFPA Other"
		]
	},
	{
		description: "identifier of a lighthouse in the USA's National Geospatial-Intelligence Agency database",
		datatype: "external-id",
		id: "P3563",
		label: "NGA Lighthouse ID",
		example: [
			7625316
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID for every publication in the United States Geological Survey's National Geologic Map Database (NGMDb)",
		datatype: "external-id",
		id: "P6693",
		label: "NGMDb Prod ID",
		example: [
			61824392,
			61037142,
			58297138,
			61823480,
			60182382,
			57844427
		],
		types: [
			"multi-source external identifier",
			"for places"
		],
		aliases: [
			"Map Db"
		]
	},
	{
		description: "identifier for a pumping station described on the website of the Nederlandse Gemalen Stichting",
		datatype: "external-id",
		id: "P3304",
		label: "NGS pumping station ID",
		example: [
			27169804
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a player on the Norwegian Handball Federation (NHF) website",
		datatype: "external-id",
		id: "P3700",
		label: "NHF player ID",
		example: [
			139283,
			15303059
		],
		types: [
		],
		aliases: [
			"Norwegian Handball Federation player ID"
		]
	},
	{
		description: "identifier for a person on the NHK Archives Portal website",
		datatype: "external-id",
		id: "P8580",
		label: "NHK Archives Portal person ID",
		example: [
			253882,
			1389817,
			11279609
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an ice hockey player at NHL.com",
		datatype: "external-id",
		id: "P3522",
		label: "NHL.com player ID",
		example: [
			1282969
		],
		types: [
		],
		aliases: [
			"NHL.com ID"
		]
	},
	{
		description: "identifier for a health condition in the NHS Health A to Z",
		datatype: "external-id",
		id: "P7995",
		label: "NHS Health A to Z ID",
		example: [
			11072,
			201989,
			1427032
		],
		types: [
			"representing a unique identifier",
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: "ID in NIAID ChemDB",
		datatype: "external-id",
		id: "P2065",
		label: "NIAID ChemDB ID",
		example: [
			707939
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for listed buildings in Northern Ireland",
		datatype: "external-id",
		id: "P1460",
		label: "NIEA building ID",
		example: [
			565078
		],
		types: [
		],
		aliases: [
			"Northern Ireland Environment Agency ID"
		]
	},
	{
		description: "identifier for an official publication of the U.S. National Institute of Safety and Health (NIOSH)",
		datatype: "external-id",
		id: "P4596",
		label: "NIOSH Numbered Publication ID",
		example: [
			26378920,
			26368849,
			29009979
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"DHHS Publication Number",
			"NIOSH Publication ID",
			"NIOSH Publication No",
			"NIOSH Number",
			"NIOSH Publication Number"
		]
	},
	{
		description: "Identifier for a chemical in the NIOSH Pocket Guide to Chemical Hazards",
		datatype: "string",
		id: "P1931",
		label: "NIOSH Pocket Guide ID",
		example: [
			49546
		],
		types: [
		],
		aliases: [
			"PGCH ID",
			"NPG ID"
		]
	},
	{
		description: "identifier in the NIOSHTIC-2 database run by National Institute for Occupational Safety and Health (part of US CDC)",
		datatype: "external-id",
		id: "P2880",
		label: "NIOSHTIC-2 ID",
		example: [
			23923328
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author publishing or editor at the NIPS/NeurIPS conference",
		datatype: "external-id",
		id: "P7748",
		label: "NIPS Proceedings author ID",
		example: [
			2405291,
			42950740,
			18686107
		],
		types: [
		],
		aliases: [
			"NeurIPs proceedings author ID"
		]
	},
	{
		description: "Belgian municipality codes maintained by Statistics Belgium",
		datatype: "external-id",
		id: "P1567",
		label: "NIS/INS code",
		example: [
			1114,
			1296
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an inductee in its Hall of Fame on the Niedersächsisches Institut für Sportgeschichte website",
		datatype: "external-id",
		id: "P3715",
		label: "NISH Hall of Fame ID",
		example: [
			831529,
			15818869
		],
		types: [
		],
		aliases: [
			"Niedersächsisches Institut für Sportgeschichte"
		]
	},
	{
		description: "identifier for a physical constant",
		datatype: "external-id",
		id: "P1645",
		label: "NIST/CODATA ID",
		example: [
			2111
		],
		types: [
		],
		aliases: [
			"CODATA ID"
		]
	},
	{
		description: "identifier for an entry in the Notable Kentucky African Americans Database",
		datatype: "external-id",
		id: "P8156",
		label: "NKAA ID",
		example: [
			19094834,
			84323317,
			89668482
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"Notable Kentucky African Americans Database ID"
		]
	},
	{
		description: "identifier in the Czech National Authority Database (National Library of Czech Republic)",
		datatype: "external-id",
		id: "P691",
		label: "NKCR AUT ID",
		example: [
			57434,
			9065647,
			383541
		],
		types: [
		],
		aliases: [
			"NKC identifier",
			"Czech National Authority Database",
			"NK ČR AUT",
			"NK CR AUT",
			"NKC ID"
		]
	},
	{
		description: "identifier for people per National Library of Australia (see also P409 for the older Libraries Australia identifier). Format: 5 to 7 digits.",
		datatype: "external-id",
		id: "P1315",
		label: "NLA Trove ID",
		example: [
			436699,
			15994254,
			1117048
		],
		types: [
		],
		aliases: [
			"NLA party ID",
			"People Australia identifier",
			"People Australia ID",
			"Trove ID",
			"Trove person ID",
			"Trove party ID",
			"NLA Persistent Identifier",
			"NLA ID",
			"National Library of Australia ID"
		]
	},
	{
		description: "identifier for a player on the Negro League Baseball Players Association website",
		datatype: "external-id",
		id: "P4405",
		label: "NLBPA ID",
		example: [
			4908365,
			6794992
		],
		types: [
		],
		aliases: [
			"Negro League Baseball Players Association ID"
		]
	},
	{
		description: "identifier for a person per National Library of China",
		datatype: "external-id",
		id: "P1213",
		label: "NLC authorities",
		example: [
			228889,
			71874
		],
		types: [
		],
		aliases: [
			"NLC"
		]
	},
	{
		description: "identifier for a player on the National Lacrosse League website",
		datatype: "external-id",
		id: "P3955",
		label: "NLL player ID",
		example: [
			6374142,
			19599027
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the catalog of the National Library of Medicine",
		datatype: "external-id",
		id: "P1055",
		label: "NLM Unique ID",
		example: [
			1470970,
			2126419
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"NLM ID",
			"NLMUID"
		]
	},
	{
		description: "former National Library of Poland unique identifier. Format: \"A\", 7 digits, \"X\" or another digit. For the newer 16-digit format, use \"NLP ID (PLWABN record)\" (P7293)",
		datatype: "external-id",
		id: "P1695",
		label: "NLP ID (unique)",
		example: [
			12904,
			559409,
			940601
		],
		types: [
		],
		aliases: [
			"NLP identifier",
			"National Library of Poland ID",
			"Polish National Library ID"
		]
	},
	{
		description: "National Land Survey of Finland Geographic Names Register Named Place ID",
		datatype: "external-id",
		id: "P4119",
		label: "NLS Geographic Names Place ID",
		example: [
			986322
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "National Land Survey of Finland Geographic Name ID",
		datatype: "external-id",
		label: "NLS-FI Geographic Name ID",
		id: "P4118",
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on NME site",
		datatype: "external-id",
		id: "P6927",
		label: "NME artist ID",
		example: [
			383541,
			200577,
			19198
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "rating of a film in the Hungarian film rating system",
		datatype: "wikibase-item",
		id: "P2363",
		label: "NMHH film rating",
		example: [
			14488725
		],
		types: [
		],
		aliases: [
			"NMHH movie rating"
		]
	},
	{
		description: "authority control for artists' collections at the National Maritime Museum website",
		datatype: "external-id",
		id: "P7332",
		label: "NMM artist ID",
		example: [
			9283413,
			282922,
			545944
		],
		types: [
		],
		aliases: [
			"National Maritime Museum artist ID",
			"RMG Collections ID",
			"Royal Museum Greenwich Collections ID"
		]
	},
	{
		description: "identifier for antiquities of India which are documented by National Mission on Monuments and Antiquities",
		datatype: "external-id",
		label: "NMMA antiquities ID",
		id: "P8220",
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for heritage sites of India which are documented by National Mission on Monuments and Antiquities",
		datatype: "external-id",
		id: "P8221",
		label: "NMMA built heritage ID",
		example: [
			6933681,
			118278,
			5071385
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the State Register of Cultural Properties assigned by the New Mexico Historic Preservation Division",
		datatype: "external-id",
		id: "P6473",
		label: "NMSRCP reference number",
		example: [
			52515315,
			19842077,
			252814,
			7083377,
			60742441
		],
		types: [
		],
		aliases: [
			"New Mexico State Register of Cultural Properties reference number",
			"New Mexico State Register of Cultural Properties ID"
		]
	},
	{
		description: "identifier for persons and organisations at the Dutch museum of world cultures",
		datatype: "external-id",
		id: "P7831",
		label: "NMVW id",
		example: [
			43139179,
			731829,
			317616
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Notable Names Database, a biographical database: only for people entries",
		datatype: "external-id",
		id: "P1263",
		label: "NNDB people ID",
		example: [
			377822,
			982133
		],
		types: [
		],
		aliases: [
			"NNDB ID",
			"Notable Names Database ID",
			"Notable Names Database people ID"
		]
	},
	{
		description: "ID for a record in the National Library of Israel (NLI) Online Catalog (NNL)",
		datatype: "external-id",
		id: "P3959",
		label: "NNL work ID",
		example: [
			25950010
		],
		types: [
		],
		aliases: [
			"NNL"
		]
	},
	{
		description: "identifier for a species on the NOAA Fisheries website",
		datatype: "external-id",
		id: "P6049",
		label: "NOAA Fisheries Species Directory ID",
		example: [
			798471,
			207744,
			27855
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "NOC/CNP Code for a given occupation in Canada and Québec",
		datatype: "external-id",
		id: "P918",
		label: "NOC Occupation Code",
		example: [
			465501,
			182436
		],
		types: [
		],
		aliases: [
			"Code CNP",
			"NOC Code"
		]
	},
	{
		description: "identifier for French official texts",
		datatype: "external-id",
		id: "P464",
		label: "NOR",
		example: [
			11680174
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "reference of a Notice to Airmen (NOTAM) issued by the FAA in the United States",
		datatype: "external-id",
		id: "P7144",
		label: "NOTAM (FAA)",
		example: [
			4735638,
			10806,
			27824398
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a player on the Nippon Professional Baseball website",
		datatype: "external-id",
		id: "P4260",
		label: "NPB player ID",
		example: [
			493180,
			16232029
		],
		types: [
		],
		aliases: [
			"Nippon Professional Baseball player ID"
		]
	},
	{
		description: "identifier for a protected area on the US National Parks Conservation Association's website",
		datatype: "external-id",
		id: "P3515",
		label: "NPCA ID",
		example: [
			180402,
			28336825
		],
		types: [
		],
		aliases: [
			"National Parks Conservation Association ID"
		]
	},
	{
		description: "identifier for digital records in the National Portal and Digital Repository for Museums of India",
		datatype: "external-id",
		id: "P7868",
		label: "NPDRMI record ID",
		example: [
			4901133,
			54352239,
			28840284
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a podcast on National Public Radio (NPR)",
		datatype: "external-id",
		id: "P5840",
		label: "NPR podcast ID",
		example: [
			56542667,
			7201129,
			5502930
		],
		types: [
		],
		aliases: [
			"National Public Radio podcast ID"
		]
	},
	{
		description: "identifier for a National Public Radio member station",
		datatype: "external-id",
		id: "P8561",
		label: "NPR station ID",
		example: [
			7957077,
			24204255,
			7956618
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for a school in Indonesia",
		datatype: "external-id",
		id: "P4128",
		label: "NPSN Indonesian school ID",
		example: [
			31783380
		],
		types: [
		],
		aliases: [
			"Nomor pokok sekolah nasional"
		]
	},
	{
		description: "identifier in the National Register of Historic Places assigned by the National Park Service of the USA",
		datatype: "external-id",
		id: "P649",
		label: "NRHP reference number",
		example: [
			172822,
			9188,
			33053063
		],
		types: [
		],
		aliases: [
			"National Register of Historic Places ID",
			"NRHP",
			"NRHP ID",
			"National Register of Historic Places number",
			"NRHP number",
			"National Register of Historic Places reference number"
		]
	},
	{
		description: "identifier for an artist on the French NRJ website",
		datatype: "external-id",
		id: "P5292",
		label: "NRJ artist ID",
		example: [
			37150,
			18613182,
			313453
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "numeric identifier for substances submitted to the National Cancer Institute (NCI) for testing and evaluation",
		datatype: "external-id",
		id: "P2840",
		label: "NSC number",
		example: [
			10851798
		],
		types: [
			"related to medicine"
		],
		aliases: [
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P2298",
		label: "NSDAP membership number (1925–1945)",
		example: [
			1512896,
			352
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an item in the National and University Library in Zagreb (including leading zeroes)",
		datatype: "external-id",
		id: "P1375",
		label: "NSK ID",
		example: [
			336571,
			77177
		],
		types: [
		],
		aliases: [
			"identificador de NSK",
			"Biblioteca Nacional y la Universidad de Zagreb ID"
		]
	},
	{
		description: "identifier for people in the NSW Capital Convictions Database",
		datatype: "external-id",
		id: "P6726",
		label: "NSW Capital Conviction ID",
		example: [
			63185030,
			19668669,
			18350521
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a plant taxon, in the NSW Flora Online",
		datatype: "external-id",
		id: "P3130",
		label: "NSW Flora ID",
		example: [
			2711460
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a place with recognised heritage value, in Australia's NSW heritage database",
		datatype: "external-id",
		id: "P3449",
		label: "NSW Heritage database ID",
		example: [
			54495
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for current and historic government agencies in New South Wales, Australia,  allocated by the State Records Authority",
		datatype: "external-id",
		id: "P6190",
		label: "NSW State Archives and Records Authority Agency ID",
		example: [
			609120,
			5260271,
			28152872,
			7603489
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier from the authority file of the National Széchényi Library, Hungary used only by VIAF",
		datatype: "external-id",
		id: "P951",
		label: "NSZL (VIAF) ID",
		example: [
			763890,
			20479300
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "ID of a person or organisation in the \"Integral Information System of the National Library\" (NEKTÁR) in Hungary",
		datatype: "external-id",
		id: "P3133",
		label: "NSZL name authority ID",
		example: [
			570810,
			20479300
		],
		types: [
		],
		aliases: [
			"NEKTÁR"
		]
	},
	{
		description: "identifier for a plant taxon, in the Northern Territory (Australia) 'NT Flora' database",
		datatype: "external-id",
		id: "P5953",
		label: "NT Flora ID",
		example: [
			15532018,
			17580119,
			857220
		],
		types: [
		],
		aliases: [
			"Northern Territory Flora ID",
			"Northern Territory Flora identification number"
		]
	},
	{
		description: "identifier for a person or a theatrical production on the National Theatre Bucharest website",
		datatype: "external-id",
		id: "P8315",
		label: "NTB ID",
		example: [
			76125092,
			90890307,
			92270086
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the U.S. National Technical Information Service database",
		datatype: "external-id",
		id: "P7791",
		label: "NTIS accession number",
		example: [
			66475689,
			26379122,
			26375972
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artist on the NTS Radio website",
		datatype: "external-id",
		id: "P7353",
		label: "NTS Radio artist ID",
		example: [
			5931116,
			247237,
			6671262,
			365243,
			321762
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for authority control in the Center of Warsaw University Library catalog",
		datatype: "external-id",
		id: "P1207",
		label: "NUKAT ID",
		example: [
			42552,
			79822,
			191479,
			55069871,
			63723973,
			483941,
			11794558
		],
		types: [
		],
		aliases: [
			"NUKAT (WarsawU) authorities ID"
		]
	},
	{
		description: "identifier for a region per NUTS",
		datatype: "external-id",
		id: "P605",
		label: "NUTS code",
		example: [
			104891
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "Identifier of a food within the Nutrient Tables for use in Australia (NUTTAB) which is managed by Food Standards Australia New Zealand (FSANZ)",
		datatype: "external-id",
		id: "P2760",
		label: "NUTTAB food ID",
		example: [
			1375049
		],
		types: [
		],
		aliases: [
			"NUTTAB ID",
			"NUTTAB Food Identifier"
		]
	},
	{
		description: "identifier for water system areas in Norway by the Norwegian Water Resources and Energy Directorate",
		datatype: "external-id",
		id: "P4528",
		label: "NVE Drainage Basin (REGINE) ID",
		example: [
			19370970
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"REGINE water system number"
		]
	},
	{
		description: "national identifying number given by NVE for every lake in Norway with a minimum size of 2500 m²",
		datatype: "external-id",
		id: "P5079",
		label: "NVE Lake Database ID",
		example: [
			4979630,
			7361716
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "unique identifier for rivers and tributaries in NVE River Network",
		datatype: "external-id",
		id: "P8348",
		label: "NVE River Network (ELVIS) ID",
		example: [
			214535,
			829748
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "serial number for a hydroelectric powerplant in  Norwegian Water Resources and Energy Directorate's Hydroelectric database",
		datatype: "external-id",
		id: "P7626",
		label: "NVE powerplant ID",
		example: [
			11960189,
			11971496,
			56405908
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "Authority ID in the spatial classification of the North Rhine-Westphalian Bibliography (NWBib)",
		datatype: "external-id",
		id: "P6814",
		label: "NWBib ID",
		example: [
			1198,
			7927,
			769380,
			884315,
			365
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "record for a publication held by the New York Art Resources Consortium (NYARC) in New York City",
		datatype: "external-id",
		id: "P8574",
		label: "NYARC Discovery ID",
		example: [
			97386443,
			97383527,
			97941155
		],
		types: [
		],
		aliases: [
			"NYARC Arcade ID",
			"Arcade ID"
		]
	},
	{
		description: "unique ID used by the City of New York to identify a building",
		datatype: "external-id",
		id: "P6082",
		label: "NYC Building Identification Number (BIN)",
		example: [
			47159435,
			45327808,
			1319147
		],
		types: [
		],
		aliases: [
			"NYC BIN",
			"NYC Building Identification Number"
		]
	},
	{
		description: "identifier for a contributor on the New York Review of Books website",
		datatype: "external-id",
		id: "P5419",
		label: "NYRB contributor ID",
		example: [
			743424,
			26691381,
			470758
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person in the NZ On Screen database",
		datatype: "external-id",
		id: "P6548",
		label: "NZ On Screen person ID",
		example: [
			315118,
			6257761,
			1741571
		],
		types: [
		],
		aliases: [
			"New Zealand On Screen person ID",
			"NZOnScreen person ID",
			"nzonscreen.com person ID"
		]
	},
	{
		description: "identifier for a film, video or TV show in the NZ On Screen database",
		datatype: "external-id",
		id: "P6549",
		label: "NZ On Screen work ID",
		example: [
			919579,
			3524732,
			3005440
		],
		types: [
		],
		aliases: [
			"New Zealand On Screen work ID"
		]
	},
	{
		description: "ID of a plant taxon held by the New Zealand Plant Conservation Network",
		datatype: "external-id",
		id: "P7496",
		label: "NZPCN ID",
		example: [
			17479806,
			311632,
			849381,
			61717253,
			10457286
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier on the Naismith Memorial Basketball Hall of Fame website",
		datatype: "external-id",
		id: "P3646",
		label: "Naismith Memorial Basketball Hall of Fame ID",
		example: [
			439621,
			5222515,
			506754
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier in the Archival Resource Key registry",
		datatype: "external-id",
		id: "P1870",
		label: "Name Assigning Authority Number",
		example: [
			131252
		],
		types: [
		],
		aliases: [
			"NAAN",
			"ARK NAAN"
		]
	},
	{
		description: "identifier for an artist on Napster music site",
		datatype: "external-id",
		id: "P6972",
		label: "Napster artist ID",
		example: [
			383541,
			313453,
			200577
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier used by the Nasjonalbiblioteket (Norwegian National Library) for photographers",
		datatype: "external-id",
		id: "P1847",
		label: "Nasjonalbiblioteket photographer ID",
		example: [
			11394810
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier of an educational institution in the Nasjonalt skoleregister (National School Registry) from the Norwegian Directorate for Education and Training",
		datatype: "external-id",
		id: "P8545",
		label: "Nasjonalt skoleregister ID",
		example: [
			11980737,
			12009496,
			31079726
		],
		types: [
		],
		aliases: [
			"NSR number",
			"NSR ID"
		]
	},
	{
		description: {
		},
		datatype: "external-id",
		id: "P3956",
		label: "National Academy of Medicine (France) Member ID",
		example: [
			42985,
			2897801
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"ANMF memberID"
		]
	},
	{
		description: "identifier for a member or foreign associate on the American National Academy of Sciences website",
		datatype: "external-id",
		id: "P5380",
		label: "National Academy of Sciences member ID",
		example: [
			6370341,
			241155,
			27942292
		],
		types: [
		],
		aliases: [
			"NAS member ID"
		]
	},
	{
		description: "identifier for a person on the National Assembly of Nigeria website, both for Representatives and Senators",
		datatype: "external-id",
		id: "P4139",
		label: "National Assembly of Nigeria ID",
		example: [
			13140687
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a person on the National Aviation Hall of Fame website",
		datatype: "external-id",
		id: "P7898",
		label: "National Aviation Hall of Fame ID",
		example: [
			76703,
			254352,
			5927704
		],
		types: [
		],
		aliases: [
			"NAHF person ID"
		]
	},
	{
		description: "identifier for a player on the United States' National Baseball Hall of Fame and Museum website",
		datatype: "external-id",
		id: "P4164",
		label: "National Baseball Hall of Fame and Museum ID",
		example: [
			425884,
			1329352
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an author on the website of the National Book Foundation",
		datatype: "external-id",
		id: "P6579",
		label: "National Book Foundation author ID",
		example: [
			128771,
			38392,
			38093438
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a book on the website of the National Book Foundation",
		datatype: "external-id",
		id: "P6580",
		label: "National Book Foundation book ID",
		example: [
			20669329,
			960840,
			42530254
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifer of a bridge, in the USA's National Bridge Inventory",
		datatype: "external-id",
		id: "P3676",
		label: "National Bridge Inventory Number",
		example: [
			3396470
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier at www.cancer.gov",
		datatype: "external-id",
		id: "P1395",
		label: "National Cancer Institute ID",
		example: [
			128581,
			47912,
			1908194
		],
		types: [
			"related to medicine",
			"representing a unique identifier"
		],
		aliases: [
			"NCI ID",
			"cancer.gov"
		]
	},
	{
		description: "member identifier on the National Cartoonists Society on website",
		datatype: "external-id",
		id: "P5622",
		label: "National Cartoonists Society member ID",
		example: [
			56061980,
			5566446,
			3742726
		],
		types: [
		],
		aliases: [
			"NCS member ID"
		]
	},
	{
		description: "identifier for a person on the National Collegiate Basketball Hall of Fame website",
		datatype: "external-id",
		id: "P4560",
		label: "National Collegiate Basketball Hall of Fame ID",
		example: [
			1166588,
			363246
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a publication, report, article or audiovisual product, in the United States' National Criminal Justice Reference Service database",
		datatype: "external-id",
		id: "P4221",
		label: "National Criminal Justice ID",
		example: [
			28798208
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
			"NCJ ID"
		]
	},
	{
		description: "identifier for authority control per the National Diet Library of Japan",
		datatype: "external-id",
		id: "P349",
		label: "National Diet Library ID",
		example: [
			877,
			982133
		],
		types: [
		],
		aliases: [
			"NDL Authorities",
			"ndl",
			"NDL identifier",
			"NDL ID",
			"NDLA identifier",
			"NDLA ID",
			"National Diet Library of Japan ID",
			"National Diet Library ID",
			"National Diet Library of Japan authority control ID",
			"NDL Auth ID",
			"National Diet Library Auth ID"
		]
	},
	{
		description: "artist or music group identity code on the National Discography of Italian Song  website",
		datatype: "external-id",
		id: "P2510",
		label: "National Discography of Italian Song artist/group ID",
		example: [
			988867,
			132682
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for a musical work in National Discography of Italian Song website",
		datatype: "external-id",
		id: "P4027",
		label: "National Discography of Italian Song work ID",
		example: [
			3877426
		],
		types: [
		],
		aliases: [
			"DNCI musical work ID",
			"DNCI ID for works",
			"Discography of Italian Song ID",
			"DNCI work ID"
		]
	},
	{
		description: "A pharmaceutical code issued by the Food and Drug Administration for every drug product (formulation) on the U.S. market. Includes a labeler code, product code and package code, unique for every drug product.",
		datatype: "external-id",
		id: "P3640",
		label: "National Drug Code",
		example: [
			423111
		],
		types: [
			"related to medicine"
		],
		aliases: [
			"NDC"
		]
	},
	{
		description: "unique identifier for an organisation supplying electrical equipment listed in the Australian National Equipment Registration System",
		datatype: "external-id",
		id: "P7273",
		label: "National Equipment Registration System Supplier Number",
		example: [
			312,
			160120,
			162345
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "director identifier used by the National Film Board of Canada website",
		datatype: "external-id",
		id: "P6891",
		label: "National Film Board of Canada director identifier",
		example: [
			716552,
			7493474,
			3122584,
			2924955
		],
		types: [
		],
		aliases: [
			"NFB director ID"
		]
	},
	{
		description: "film identifier used by the National Film Board of Canada website",
		datatype: "external-id",
		id: "P4606",
		label: "National Film Board of Canada film ID",
		example: [
			888922,
			888922
		],
		types: [
		],
		aliases: [
			"NFB film ID",
			"NFB movie ID",
			"National Film Board of Canada movie ID"
		]
	},
	{
		description: "identifier for an association football (soccer) match in the National Football Teams.com database",
		datatype: "external-id",
		id: "P8319",
		label: "National Football Teams.com match ID",
		example: [
			48804003,
			1067311
		],
		types: [
			"representing a unique identifier"
		],
		aliases: [
		]
	},
	{
		description: "identifier for an American national forest on the National Forest Foundation website",
		datatype: "external-id",
		id: "P4154",
		label: "National Forest Foundation ID",
		example: [
			5210039,
			3079128
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an artwork, in the National Gallery of Armenia database",
		datatype: "external-id",
		id: "P5210",
		label: "National Gallery of Armenia work ID",
		example: [
			53865454
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier assigned to an artist by the National Gallery of Art in Washington, DC",
		datatype: "external-id",
		id: "P2252",
		label: "National Gallery of Art artist ID",
		example: [
			335927,
			156889
		],
		types: [
		],
		aliases: [
			"National Gallery of Art artist identifier",
			"NGA artist identifier",
			"National Gallery of Art artist ID",
			"NGA artist ID"
		]
	},
	{
		description: "identifier for an artwork or other object on the United States' National Gallery of Art website",
		datatype: "external-id",
		id: "P4683",
		label: "National Gallery of Art artwork ID",
		example: [
			3769182,
			3828409
		],
		types: [
		],
		aliases: [
			"NGA artwork ID"
		]
	},
	{
		description: "identifier of an artist at the National Gallery of Canada's web site",
		datatype: "external-id",
		id: "P5368",
		label: "National Gallery of Canada artist ID",
		example: [
			289624,
			2847305
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier assigned to an artist by the National Gallery of Victoria in Australia",
		datatype: "external-id",
		id: "P2041",
		label: "National Gallery of Victoria artist ID",
		example: [
			60809,
			274172
		],
		types: [
		],
		aliases: [
			"NGV artist id",
			"National Gallery of Victoria artist identifier"
		]
	},
	{
		description: "identifier for an artwork or other object on the National Gallery of Victoria website",
		datatype: "external-id",
		id: "P4684",
		label: "National Gallery of Victoria artwork ID",
		example: [
			17566770,
			20422159
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "biographical entry in the website of the National Governors Association",
		datatype: "url",
		id: "P4997",
		label: "National Governors Association biography URL",
		example: [
			436902,
			878535
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for hospitals in India maintained by the 'National Health Portal'",
		datatype: "external-id",
		id: "P7547",
		label: "National Health Portal hospital ID",
		example: [
			15177600,
			5102433,
			61454034
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "number on the National Heritage List for England",
		datatype: "external-id",
		id: "P1216",
		label: "National Heritage List for England number",
		example: [
			622206,
			17641401
		],
		types: [
		],
		aliases: [
			"EH list number",
			"English Heritage list number",
			"NHLE number",
			"HE list number",
			"Historic England list number",
			"listed building number, England"
		]
	},
	{
		description: "identifier for a fire lookout on the National Historic Lookout Register",
		datatype: "external-id",
		id: "P7942",
		label: "National Historic Lookout Register ID",
		example: [
			5751273,
			65091555,
			86120559
		],
		types: [
		],
		aliases: [
			"NHLR ID"
		]
	},
	{
		description: "certificate number for a vessel, as found on the National Historic Ships website",
		datatype: "external-id",
		id: "P4750",
		label: "National Historic Ships certificate number",
		example: [
			4667044,
			213958
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "the unique identificator of a National Historic Sites of Canada on the Directory of Federal Heritage Designations",
		datatype: "external-id",
		id: "P2526",
		label: "National Historic Sites of Canada ID",
		example: [
			651323
		],
		types: [
		],
		aliases: [
			"NHSC"
		]
	},
	{
		description: "identifier for a National Humanities Medal winner on the National Endowment for the Humanities website",
		datatype: "external-id",
		id: "P5657",
		label: "National Humanities Medal winner ID",
		example: [
			3492117,
			351815,
			4742987
		],
		types: [
		],
		aliases: [
		]
	},
	{
		description: "identifier for an inductee in the United States National Inventors Hall of Fame",
		datatype: "external-id",
		id: "P3468",
		label: "National Inventors Hall of Fame ID",
		example: [
			4273363
		],
		types: [
		],
		aliases: [
		]
	},
	{
		id: "P4591",
		],