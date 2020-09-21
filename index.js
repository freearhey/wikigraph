'use strict';

var express = require('express');
var expressGraphql = require('express-graphql');
var graphql = require('graphql');
var diacritics = require('diacritics');
var DataLoader = require('dataloader');
var wdk = require('wikidata-sdk');
var axios = require('axios');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var DataLoader__default = /*#__PURE__*/_interopDefaultLegacy(DataLoader);
var wdk__default = /*#__PURE__*/_interopDefaultLegacy(wdk);
var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

var property = [
	{
		property: "P359",
		label: "Rijksmonument ID",
		datatype: "ExternalId"
	},
	{
		property: "P360",
		label: "is a list of",
		datatype: "WikibaseItem"
	},
	{
		property: "P361",
		label: "part of",
		datatype: "WikibaseItem"
	},
	{
		property: "P364",
		label: "original language of work",
		datatype: "WikibaseItem"
	},
	{
		property: "P366",
		label: "use",
		datatype: "WikibaseItem"
	},
	{
		property: "P367",
		label: "astronomic symbol image",
		datatype: "CommonsMedia"
	},
	{
		property: "P368",
		label: "Sandbox-CommonsMediaFile",
		datatype: "CommonsMedia"
	},
	{
		property: "P369",
		label: "Sandbox-Item",
		datatype: "WikibaseItem"
	},
	{
		property: "P370",
		label: "Sandbox-String",
		datatype: "String"
	},
	{
		property: "P371",
		label: "presenter",
		datatype: "WikibaseItem"
	},
	{
		property: "P373",
		label: "Commons category",
		datatype: "String"
	},
	{
		property: "P374",
		label: "INSEE municipality code",
		datatype: "ExternalId"
	},
	{
		property: "P375",
		label: "space launch vehicle",
		datatype: "WikibaseItem"
	},
	{
		property: "P376",
		label: "located on astronomical body",
		datatype: "WikibaseItem"
	},
	{
		property: "P377",
		label: "SCN",
		datatype: "ExternalId"
	},
	{
		property: "P380",
		label: "Mérimée ID",
		datatype: "ExternalId"
	},
	{
		property: "P381",
		label: "PCP reference number",
		datatype: "ExternalId"
	},
	{
		property: "P382",
		label: "CBS municipality code",
		datatype: "ExternalId"
	},
	{
		property: "P393",
		label: "edition number",
		datatype: "String"
	},
	{
		property: "P395",
		label: "licence plate code",
		datatype: "String"
	},
	{
		property: "P396",
		label: "SBN ID",
		datatype: "ExternalId"
	},
	{
		property: "P397",
		label: "parent astronomical body",
		datatype: "WikibaseItem"
	},
	{
		property: "P398",
		label: "child astronomical body",
		datatype: "WikibaseItem"
	},
	{
		property: "P399",
		label: "companion of",
		datatype: "WikibaseItem"
	},
	{
		property: "P400",
		label: "platform",
		datatype: "WikibaseItem"
	},
	{
		property: "P402",
		label: "OpenStreetMap Relation identifier",
		datatype: "ExternalId"
	},
	{
		property: "P403",
		label: "mouth of the watercourse",
		datatype: "WikibaseItem"
	},
	{
		property: "P404",
		label: "game mode",
		datatype: "WikibaseItem"
	},
	{
		property: "P405",
		label: "taxon author",
		datatype: "WikibaseItem"
	},
	{
		property: "P406",
		label: "soundtrack album",
		datatype: "WikibaseItem"
	},
	{
		property: "P407",
		label: "language of work or name",
		datatype: "WikibaseItem"
	},
	{
		property: "P408",
		label: "software engine",
		datatype: "WikibaseItem"
	},
	{
		property: "P409",
		label: "NLA (Australia) ID",
		datatype: "ExternalId"
	},
	{
		property: "P410",
		label: "military rank",
		datatype: "WikibaseItem"
	},
	{
		property: "P411",
		label: "canonization status",
		datatype: "WikibaseItem"
	},
	{
		property: "P412",
		label: "voice type",
		datatype: "WikibaseItem"
	},
	{
		property: "P413",
		label: "position played on team / speciality",
		datatype: "WikibaseItem"
	},
	{
		property: "P414",
		label: "stock exchange",
		datatype: "WikibaseItem"
	},
	{
		property: "P415",
		label: "radio format",
		datatype: "WikibaseItem"
	},
	{
		property: "P416",
		label: "quantity symbol",
		datatype: "String"
	},
	{
		property: "P417",
		label: "patron saint",
		datatype: "WikibaseItem"
	},
	{
		property: "P418",
		label: "seal description",
		datatype: "WikibaseItem"
	},
	{
		property: "P421",
		label: "located in time zone",
		datatype: "WikibaseItem"
	},
	{
		property: "P423",
		label: "shooting handedness",
		datatype: "WikibaseItem"
	},
	{
		property: "P424",
		label: "Wikimedia language code",
		datatype: "String"
	},
	{
		property: "P425",
		label: "field of this occupation",
		datatype: "WikibaseItem"
	},
	{
		property: "P426",
		label: "aircraft registration",
		datatype: "String"
	},
	{
		property: "P427",
		label: "taxonomic type",
		datatype: "WikibaseItem"
	},
	{
		property: "P428",
		label: "botanist author abbreviation",
		datatype: "ExternalId"
	},
	{
		property: "P429",
		label: "dantai code",
		datatype: "ExternalId"
	},
	{
		property: "P432",
		label: "callsign of airline",
		datatype: "ExternalId"
	},
	{
		property: "P433",
		label: "issue",
		datatype: "String"
	},
	{
		property: "P434",
		label: "MusicBrainz artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P435",
		label: "MusicBrainz work ID",
		datatype: "ExternalId"
	},
	{
		property: "P436",
		label: "MusicBrainz release group ID",
		datatype: "ExternalId"
	},
	{
		property: "P437",
		label: "distribution",
		datatype: "WikibaseItem"
	},
	{
		property: "P439",
		label: "German municipality key",
		datatype: "ExternalId"
	},
	{
		property: "P440",
		label: "German district key",
		datatype: "ExternalId"
	},
	{
		property: "P442",
		label: "China administrative division code",
		datatype: "ExternalId"
	},
	{
		property: "P443",
		label: "pronunciation audio",
		datatype: "CommonsMedia"
	},
	{
		property: "P444",
		label: "review score",
		datatype: "String"
	},
	{
		property: "P447",
		label: "score by",
		datatype: "WikibaseItem"
	},
	{
		property: "P449",
		label: "original network",
		datatype: "WikibaseItem"
	},
	{
		property: "P450",
		label: "astronaut mission",
		datatype: "WikibaseItem"
	},
	{
		property: "P451",
		label: "unmarried partner",
		datatype: "WikibaseItem"
	},
	{
		property: "P452",
		label: "industry",
		datatype: "WikibaseItem"
	},
	{
		property: "P453",
		label: "character role",
		datatype: "WikibaseItem"
	},
	{
		property: "P454",
		label: "Structurae ID (structure)",
		datatype: "ExternalId"
	},
	{
		property: "P455",
		label: "Emporis building ID",
		datatype: "ExternalId"
	},
	{
		property: "P457",
		label: "foundational text",
		datatype: "WikibaseItem"
	},
	{
		property: "P458",
		label: "IMO ship number",
		datatype: "ExternalId"
	},
	{
		property: "P459",
		label: "determination method",
		datatype: "WikibaseItem"
	},
	{
		property: "P460",
		label: "said to be the same as",
		datatype: "WikibaseItem"
	},
	{
		property: "P461",
		label: "opposite of",
		datatype: "WikibaseItem"
	},
	{
		property: "P462",
		label: "color",
		datatype: "WikibaseItem"
	},
	{
		property: "P463",
		label: "member of",
		datatype: "WikibaseItem"
	},
	{
		property: "P464",
		label: "NOR",
		datatype: "ExternalId"
	},
	{
		property: "P465",
		label: "sRGB color hex triplet",
		datatype: "String"
	},
	{
		property: "P466",
		label: "occupant",
		datatype: "WikibaseItem"
	},
	{
		property: "P467",
		label: "legislated by",
		datatype: "WikibaseItem"
	},
	{
		property: "P468",
		label: "dan/kyu rank",
		datatype: "WikibaseItem"
	},
	{
		property: "P469",
		label: "lakes on river",
		datatype: "WikibaseItem"
	},
	{
		property: "P470",
		label: "Eight Banner register",
		datatype: "WikibaseItem"
	},
	{
		property: "P473",
		label: "local dialing code",
		datatype: "String"
	},
	{
		property: "P474",
		label: "country calling code",
		datatype: "String"
	},
	{
		property: "P476",
		label: "CELEX number",
		datatype: "ExternalId"
	},
	{
		property: "P477",
		label: "Canadian Register of Historic Places ID",
		datatype: "ExternalId"
	},
	{
		property: "P478",
		label: "volume",
		datatype: "String"
	},
	{
		property: "P479",
		label: "input method",
		datatype: "WikibaseItem"
	},
	{
		property: "P480",
		label: "FilmAffinity ID",
		datatype: "ExternalId"
	},
	{
		property: "P481",
		label: "Palissy ID",
		datatype: "ExternalId"
	},
	{
		property: "P483",
		label: "recorded at",
		datatype: "WikibaseItem"
	},
	{
		property: "P484",
		label: "IMA Number, broad sense",
		datatype: "ExternalId"
	},
	{
		property: "P485",
		label: "archives at",
		datatype: "WikibaseItem"
	},
	{
		property: "P486",
		label: "MeSH ID",
		datatype: "ExternalId"
	},
	{
		property: "P487",
		label: "Unicode character",
		datatype: "String"
	},
	{
		property: "P488",
		label: "chairperson",
		datatype: "WikibaseItem"
	},
	{
		property: "P489",
		label: "currency symbol description",
		datatype: "WikibaseItem"
	},
	{
		property: "P490",
		label: "provisional designation",
		datatype: "String"
	},
	{
		property: "P491",
		label: "orbit diagram",
		datatype: "CommonsMedia"
	},
	{
		property: "P6",
		label: "head of government",
		datatype: "WikibaseItem"
	},
	{
		property: "P10",
		label: "video",
		datatype: "CommonsMedia"
	},
	{
		property: "P14",
		label: "graphic symbol of thoroughfare",
		datatype: "CommonsMedia"
	},
	{
		property: "P15",
		label: "route map",
		datatype: "CommonsMedia"
	},
	{
		property: "P16",
		label: "highway system",
		datatype: "WikibaseItem"
	},
	{
		property: "P17",
		label: "country",
		datatype: "WikibaseItem"
	},
	{
		property: "P18",
		label: "image",
		datatype: "CommonsMedia"
	},
	{
		property: "P19",
		label: "place of birth",
		datatype: "WikibaseItem"
	},
	{
		property: "P20",
		label: "place of death",
		datatype: "WikibaseItem"
	},
	{
		property: "P21",
		label: "sex or gender",
		datatype: "WikibaseItem"
	},
	{
		property: "P22",
		label: "father",
		datatype: "WikibaseItem"
	},
	{
		property: "P25",
		label: "mother",
		datatype: "WikibaseItem"
	},
	{
		property: "P26",
		label: "spouse",
		datatype: "WikibaseItem"
	},
	{
		property: "P27",
		label: "country of citizenship",
		datatype: "WikibaseItem"
	},
	{
		property: "P30",
		label: "continent",
		datatype: "WikibaseItem"
	},
	{
		property: "P31",
		label: "instance of",
		datatype: "WikibaseItem"
	},
	{
		property: "P35",
		label: "head of state",
		datatype: "WikibaseItem"
	},
	{
		property: "P36",
		label: "capital",
		datatype: "WikibaseItem"
	},
	{
		property: "P37",
		label: "official language",
		datatype: "WikibaseItem"
	},
	{
		property: "P38",
		label: "currency",
		datatype: "WikibaseItem"
	},
	{
		property: "P39",
		label: "position held",
		datatype: "WikibaseItem"
	},
	{
		property: "P40",
		label: "child",
		datatype: "WikibaseItem"
	},
	{
		property: "P41",
		label: "flag image",
		datatype: "CommonsMedia"
	},
	{
		property: "P47",
		label: "shares border with",
		datatype: "WikibaseItem"
	},
	{
		property: "P50",
		label: "author",
		datatype: "WikibaseItem"
	},
	{
		property: "P51",
		label: "audio",
		datatype: "CommonsMedia"
	},
	{
		property: "P53",
		label: "noble family",
		datatype: "WikibaseItem"
	},
	{
		property: "P54",
		label: "member of sports team",
		datatype: "WikibaseItem"
	},
	{
		property: "P57",
		label: "director",
		datatype: "WikibaseItem"
	},
	{
		property: "P58",
		label: "screenwriter",
		datatype: "WikibaseItem"
	},
	{
		property: "P59",
		label: "constellation",
		datatype: "WikibaseItem"
	},
	{
		property: "P61",
		label: "discoverer or inventor",
		datatype: "WikibaseItem"
	},
	{
		property: "P65",
		label: "site of astronomical discovery",
		datatype: "WikibaseItem"
	},
	{
		property: "P66",
		label: "ancestral home",
		datatype: "WikibaseItem"
	},
	{
		property: "P69",
		label: "educated at",
		datatype: "WikibaseItem"
	},
	{
		property: "P78",
		label: "top-level internet domain",
		datatype: "WikibaseItem"
	},
	{
		property: "P81",
		label: "connecting line",
		datatype: "WikibaseItem"
	},
	{
		property: "P84",
		label: "architect",
		datatype: "WikibaseItem"
	},
	{
		property: "P85",
		label: "anthem",
		datatype: "WikibaseItem"
	},
	{
		property: "P86",
		label: "composer",
		datatype: "WikibaseItem"
	},
	{
		property: "P87",
		label: "librettist",
		datatype: "WikibaseItem"
	},
	{
		property: "P88",
		label: "commissioned by",
		datatype: "WikibaseItem"
	},
	{
		property: "P91",
		label: "sexual orientation",
		datatype: "WikibaseItem"
	},
	{
		property: "P92",
		label: "main regulatory text",
		datatype: "WikibaseItem"
	},
	{
		property: "P94",
		label: "coat of arms image",
		datatype: "CommonsMedia"
	},
	{
		property: "P97",
		label: "noble title",
		datatype: "WikibaseItem"
	},
	{
		property: "P98",
		label: "editor",
		datatype: "WikibaseItem"
	},
	{
		property: "P101",
		label: "field of work",
		datatype: "WikibaseItem"
	},
	{
		property: "P102",
		label: "member of political party",
		datatype: "WikibaseItem"
	},
	{
		property: "P103",
		label: "native language",
		datatype: "WikibaseItem"
	},
	{
		property: "P105",
		label: "taxon rank",
		datatype: "WikibaseItem"
	},
	{
		property: "P106",
		label: "occupation",
		datatype: "WikibaseItem"
	},
	{
		property: "P108",
		label: "employer",
		datatype: "WikibaseItem"
	},
	{
		property: "P109",
		label: "signature",
		datatype: "CommonsMedia"
	},
	{
		property: "P110",
		label: "illustrator",
		datatype: "WikibaseItem"
	},
	{
		property: "P111",
		label: "measured physical quantity",
		datatype: "WikibaseItem"
	},
	{
		property: "P112",
		label: "founded by",
		datatype: "WikibaseItem"
	},
	{
		property: "P113",
		label: "airline hub",
		datatype: "WikibaseItem"
	},
	{
		property: "P114",
		label: "airline alliance",
		datatype: "WikibaseItem"
	},
	{
		property: "P115",
		label: "home venue",
		datatype: "WikibaseItem"
	},
	{
		property: "P117",
		label: "chemical structure",
		datatype: "CommonsMedia"
	},
	{
		property: "P118",
		label: "league",
		datatype: "WikibaseItem"
	},
	{
		property: "P119",
		label: "place of interment",
		datatype: "WikibaseItem"
	},
	{
		property: "P121",
		label: "item operated",
		datatype: "WikibaseItem"
	},
	{
		property: "P122",
		label: "basic form of government",
		datatype: "WikibaseItem"
	},
	{
		property: "P123",
		label: "publisher",
		datatype: "WikibaseItem"
	},
	{
		property: "P126",
		label: "maintained by",
		datatype: "WikibaseItem"
	},
	{
		property: "P127",
		label: "owned by",
		datatype: "WikibaseItem"
	},
	{
		property: "P128",
		label: "regulates (molecular biology)",
		datatype: "WikibaseItem"
	},
	{
		property: "P129",
		label: "physically interacts with",
		datatype: "WikibaseItem"
	},
	{
		property: "P131",
		label: "located in the administrative territorial entity",
		datatype: "WikibaseItem"
	},
	{
		property: "P134",
		label: "has dialect",
		datatype: "WikibaseItem"
	},
	{
		property: "P135",
		label: "movement",
		datatype: "WikibaseItem"
	},
	{
		property: "P136",
		label: "genre",
		datatype: "WikibaseItem"
	},
	{
		property: "P137",
		label: "operator",
		datatype: "WikibaseItem"
	},
	{
		property: "P138",
		label: "named after",
		datatype: "WikibaseItem"
	},
	{
		property: "P140",
		label: "religion",
		datatype: "WikibaseItem"
	},
	{
		property: "P141",
		label: "IUCN conservation status",
		datatype: "WikibaseItem"
	},
	{
		property: "P143",
		label: "imported from",
		datatype: "WikibaseItem"
	},
	{
		property: "P144",
		label: "based on",
		datatype: "WikibaseItem"
	},
	{
		property: "P149",
		label: "architectural style",
		datatype: "WikibaseItem"
	},
	{
		property: "P150",
		label: "contains administrative territorial entity",
		datatype: "WikibaseItem"
	},
	{
		property: "P154",
		label: "logo image",
		datatype: "CommonsMedia"
	},
	{
		property: "P155",
		label: "follows",
		datatype: "WikibaseItem"
	},
	{
		property: "P156",
		label: "followed by",
		datatype: "WikibaseItem"
	},
	{
		property: "P157",
		label: "killed by",
		datatype: "WikibaseItem"
	},
	{
		property: "P158",
		label: "seal image",
		datatype: "CommonsMedia"
	},
	{
		property: "P159",
		label: "headquarters location",
		datatype: "WikibaseItem"
	},
	{
		property: "P161",
		label: "cast member",
		datatype: "WikibaseItem"
	},
	{
		property: "P162",
		label: "producer",
		datatype: "WikibaseItem"
	},
	{
		property: "P163",
		label: "flag",
		datatype: "WikibaseItem"
	},
	{
		property: "P166",
		label: "award received",
		datatype: "WikibaseItem"
	},
	{
		property: "P167",
		label: "structure replaced by",
		datatype: "WikibaseItem"
	},
	{
		property: "P169",
		label: "chief executive officer",
		datatype: "WikibaseItem"
	},
	{
		property: "P170",
		label: "creator",
		datatype: "WikibaseItem"
	},
	{
		property: "P171",
		label: "parent taxon",
		datatype: "WikibaseItem"
	},
	{
		property: "P172",
		label: "ethnic group",
		datatype: "WikibaseItem"
	},
	{
		property: "P175",
		label: "performer",
		datatype: "WikibaseItem"
	},
	{
		property: "P176",
		label: "manufacturer",
		datatype: "WikibaseItem"
	},
	{
		property: "P177",
		label: "crosses",
		datatype: "WikibaseItem"
	},
	{
		property: "P178",
		label: "developer",
		datatype: "WikibaseItem"
	},
	{
		property: "P179",
		label: "series",
		datatype: "WikibaseItem"
	},
	{
		property: "P180",
		label: "depicts",
		datatype: "WikibaseItem"
	},
	{
		property: "P181",
		label: "taxon range map image",
		datatype: "CommonsMedia"
	},
	{
		property: "P183",
		label: "endemic to",
		datatype: "WikibaseItem"
	},
	{
		property: "P184",
		label: "doctoral advisor",
		datatype: "WikibaseItem"
	},
	{
		property: "P185",
		label: "doctoral student",
		datatype: "WikibaseItem"
	},
	{
		property: "P186",
		label: "material used",
		datatype: "WikibaseItem"
	},
	{
		property: "P189",
		label: "location of discovery",
		datatype: "WikibaseItem"
	},
	{
		property: "P190",
		label: "sister city",
		datatype: "WikibaseItem"
	},
	{
		property: "P193",
		label: "main building contractor",
		datatype: "WikibaseItem"
	},
	{
		property: "P194",
		label: "legislative body",
		datatype: "WikibaseItem"
	},
	{
		property: "P195",
		label: "collection",
		datatype: "WikibaseItem"
	},
	{
		property: "P196",
		label: "minor planet group",
		datatype: "WikibaseItem"
	},
	{
		property: "P197",
		label: "adjacent station",
		datatype: "WikibaseItem"
	},
	{
		property: "P199",
		label: "business division",
		datatype: "WikibaseItem"
	},
	{
		property: "P200",
		label: "lake inflows",
		datatype: "WikibaseItem"
	},
	{
		property: "P201",
		label: "lake outflow",
		datatype: "WikibaseItem"
	},
	{
		property: "P205",
		label: "basin country",
		datatype: "WikibaseItem"
	},
	{
		property: "P206",
		label: "located next to body of water",
		datatype: "WikibaseItem"
	},
	{
		property: "P207",
		label: "bathymetry image",
		datatype: "CommonsMedia"
	},
	{
		property: "P208",
		label: "executive body",
		datatype: "WikibaseItem"
	},
	{
		property: "P209",
		label: "highest judicial authority",
		datatype: "WikibaseItem"
	},
	{
		property: "P210",
		label: "party chief representative",
		datatype: "WikibaseItem"
	},
	{
		property: "P212",
		label: "ISBN-13",
		datatype: "ExternalId"
	},
	{
		property: "P213",
		label: "ISNI",
		datatype: "ExternalId"
	},
	{
		property: "P214",
		label: "VIAF ID",
		datatype: "ExternalId"
	},
	{
		property: "P215",
		label: "spectral class",
		datatype: "String"
	},
	{
		property: "P217",
		label: "inventory number",
		datatype: "String"
	},
	{
		property: "P218",
		label: "ISO 639-1 code",
		datatype: "ExternalId"
	},
	{
		property: "P219",
		label: "ISO 639-2 code",
		datatype: "ExternalId"
	},
	{
		property: "P220",
		label: "ISO 639-3 code",
		datatype: "ExternalId"
	},
	{
		property: "P221",
		label: "ISO 639-6 code",
		datatype: "ExternalId"
	},
	{
		property: "P223",
		label: "galaxy morphological type",
		datatype: "String"
	},
	{
		property: "P225",
		label: "taxon name",
		datatype: "String"
	},
	{
		property: "P227",
		label: "GND ID",
		datatype: "ExternalId"
	},
	{
		property: "P229",
		label: "IATA airline designator",
		datatype: "String"
	},
	{
		property: "P230",
		label: "ICAO airline designator",
		datatype: "String"
	},
	{
		property: "P231",
		label: "CAS Registry Number",
		datatype: "ExternalId"
	},
	{
		property: "P232",
		label: "EC no.",
		datatype: "ExternalId"
	},
	{
		property: "P233",
		label: "canonical SMILES",
		datatype: "String"
	},
	{
		property: "P234",
		label: "InChI",
		datatype: "ExternalId"
	},
	{
		property: "P235",
		label: "InChIKey",
		datatype: "ExternalId"
	},
	{
		property: "P236",
		label: "ISSN",
		datatype: "ExternalId"
	},
	{
		property: "P237",
		label: "coat of arms",
		datatype: "WikibaseItem"
	},
	{
		property: "P238",
		label: "IATA airport code",
		datatype: "String"
	},
	{
		property: "P239",
		label: "ICAO airport code",
		datatype: "String"
	},
	{
		property: "P240",
		label: "FAA airport code",
		datatype: "String"
	},
	{
		property: "P241",
		label: "military branch",
		datatype: "WikibaseItem"
	},
	{
		property: "P242",
		label: "locator map image",
		datatype: "CommonsMedia"
	},
	{
		property: "P243",
		label: "OCLC control number",
		datatype: "ExternalId"
	},
	{
		property: "P244",
		label: "Library of Congress authority identifier",
		datatype: "ExternalId"
	},
	{
		property: "P245",
		label: "ULAN ID",
		datatype: "ExternalId"
	},
	{
		property: "P246",
		label: "element symbol",
		datatype: "String"
	},
	{
		property: "P247",
		label: "COSPAR ID",
		datatype: "ExternalId"
	},
	{
		property: "P248",
		label: "stated in",
		datatype: "WikibaseItem"
	},
	{
		property: "P249",
		label: "ticker symbol",
		datatype: "String"
	},
	{
		property: "P263",
		label: "official residence",
		datatype: "WikibaseItem"
	},
	{
		property: "P264",
		label: "record label",
		datatype: "WikibaseItem"
	},
	{
		property: "P267",
		label: "ATC code",
		datatype: "ExternalId"
	},
	{
		property: "P268",
		label: "BnF ID",
		datatype: "ExternalId"
	},
	{
		property: "P269",
		label: "SUDOC authorities",
		datatype: "ExternalId"
	},
	{
		property: "P270",
		label: "CALIS ID",
		datatype: "ExternalId"
	},
	{
		property: "P271",
		label: "CiNii author ID",
		datatype: "ExternalId"
	},
	{
		property: "P272",
		label: "production company",
		datatype: "WikibaseItem"
	},
	{
		property: "P274",
		label: "chemical formula",
		datatype: "String"
	},
	{
		property: "P275",
		label: "license",
		datatype: "WikibaseItem"
	},
	{
		property: "P276",
		label: "location",
		datatype: "WikibaseItem"
	},
	{
		property: "P277",
		label: "programming language",
		datatype: "WikibaseItem"
	},
	{
		property: "P278",
		label: "GOST 7.75-97 code",
		datatype: "ExternalId"
	},
	{
		property: "P279",
		label: "subclass of",
		datatype: "WikibaseItem"
	},
	{
		property: "P281",
		label: "postal code",
		datatype: "String"
	},
	{
		property: "P282",
		label: "writing system",
		datatype: "WikibaseItem"
	},
	{
		property: "P286",
		label: "head coach",
		datatype: "WikibaseItem"
	},
	{
		property: "P287",
		label: "designed by",
		datatype: "WikibaseItem"
	},
	{
		property: "P289",
		label: "vessel class",
		datatype: "WikibaseItem"
	},
	{
		property: "P291",
		label: "place of publication",
		datatype: "WikibaseItem"
	},
	{
		property: "P296",
		label: "station code",
		datatype: "String"
	},
	{
		property: "P297",
		label: "ISO 3166-1 alpha-2 code",
		datatype: "ExternalId"
	},
	{
		property: "P298",
		label: "ISO 3166-1 alpha-3 code",
		datatype: "ExternalId"
	},
	{
		property: "P299",
		label: "ISO 3166-1 numeric code",
		datatype: "ExternalId"
	},
	{
		property: "P300",
		label: "ISO 3166-2 code",
		datatype: "ExternalId"
	},
	{
		property: "P301",
		label: "category's main topic",
		datatype: "WikibaseItem"
	},
	{
		property: "P303",
		label: "EE breed number",
		datatype: "ExternalId"
	},
	{
		property: "P304",
		label: "page(s)",
		datatype: "String"
	},
	{
		property: "P305",
		label: "IETF language tag",
		datatype: "ExternalId"
	},
	{
		property: "P306",
		label: "operating system",
		datatype: "WikibaseItem"
	},
	{
		property: "P344",
		label: "director of photography",
		datatype: "WikibaseItem"
	},
	{
		property: "P345",
		label: "IMDb ID",
		datatype: "ExternalId"
	},
	{
		property: "P347",
		label: "Joconde ID",
		datatype: "ExternalId"
	},
	{
		property: "P348",
		label: "software version",
		datatype: "String"
	},
	{
		property: "P349",
		label: "NDL Auth ID",
		datatype: "ExternalId"
	},
	{
		property: "P350",
		label: "RKDimages",
		datatype: "ExternalId"
	},
	{
		property: "P351",
		label: "Entrez Gene ID",
		datatype: "ExternalId"
	},
	{
		property: "P352",
		label: "UniProt ID",
		datatype: "ExternalId"
	},
	{
		property: "P353",
		label: "HGNC gene symbol",
		datatype: "ExternalId"
	},
	{
		property: "P354",
		label: "HGNC ID",
		datatype: "ExternalId"
	},
	{
		property: "P355",
		label: "subsidiary",
		datatype: "WikibaseItem"
	},
	{
		property: "P356",
		label: "DOI",
		datatype: "ExternalId"
	},
	{
		property: "P358",
		label: "discography",
		datatype: "WikibaseItem"
	},
	{
		property: "P608",
		label: "exhibition history",
		datatype: "WikibaseItem"
	},
	{
		property: "P609",
		label: "terminus location",
		datatype: "WikibaseItem"
	},
	{
		property: "P610",
		label: "highest point",
		datatype: "WikibaseItem"
	},
	{
		property: "P611",
		label: "religious order",
		datatype: "WikibaseItem"
	},
	{
		property: "P612",
		label: "mother house",
		datatype: "WikibaseItem"
	},
	{
		property: "P613",
		label: "OS grid reference",
		datatype: "String"
	},
	{
		property: "P617",
		label: "yard number",
		datatype: "String"
	},
	{
		property: "P618",
		label: "source of energy",
		datatype: "WikibaseItem"
	},
	{
		property: "P619",
		label: "time of spacecraft launch",
		datatype: "Time"
	},
	{
		property: "P620",
		label: "time of spacecraft landing",
		datatype: "Time"
	},
	{
		property: "P621",
		label: "time of spacecraft orbit decay",
		datatype: "Time"
	},
	{
		property: "P622",
		label: "spacecraft docking/undocking date",
		datatype: "Time"
	},
	{
		property: "P624",
		label: "guidance system",
		datatype: "WikibaseItem"
	},
	{
		property: "P625",
		label: "coordinate location",
		datatype: "GlobeCoordinate"
	},
	{
		property: "P626",
		label: "Sandbox-GeoCoordinateValue",
		datatype: "GlobeCoordinate"
	},
	{
		property: "P627",
		label: "IUCN ID",
		datatype: "String"
	},
	{
		property: "P628",
		label: "E number",
		datatype: "ExternalId"
	},
	{
		property: "P629",
		label: "edition or translation of",
		datatype: "WikibaseItem"
	},
	{
		property: "P630",
		label: "Paris city digital code",
		datatype: "ExternalId"
	},
	{
		property: "P631",
		label: "structural engineer",
		datatype: "WikibaseItem"
	},
	{
		property: "P632",
		label: "cultural properties of Belarus reference number",
		datatype: "ExternalId"
	},
	{
		property: "P633",
		label: "Quebec cultural heritage directory ID",
		datatype: "ExternalId"
	},
	{
		property: "P634",
		label: "captain",
		datatype: "WikibaseItem"
	},
	{
		property: "P635",
		label: "ISTAT ID",
		datatype: "ExternalId"
	},
	{
		property: "P636",
		label: "route of administration",
		datatype: "WikibaseItem"
	},
	{
		property: "P637",
		label: "RefSeq Protein ID",
		datatype: "ExternalId"
	},
	{
		property: "P638",
		label: "PDB ID",
		datatype: "ExternalId"
	},
	{
		property: "P639",
		label: "RefSeq RNA ID",
		datatype: "ExternalId"
	},
	{
		property: "P640",
		label: "Léonore ID",
		datatype: "ExternalId"
	},
	{
		property: "P641",
		label: "sport",
		datatype: "WikibaseItem"
	},
	{
		property: "P642",
		label: "of",
		datatype: "WikibaseItem"
	},
	{
		property: "P644",
		label: "genomic start",
		datatype: "String"
	},
	{
		property: "P645",
		label: "genomic end",
		datatype: "String"
	},
	{
		property: "P646",
		label: "Freebase ID",
		datatype: "ExternalId"
	},
	{
		property: "P647",
		label: "drafted by",
		datatype: "WikibaseItem"
	},
	{
		property: "P648",
		label: "Open Library ID",
		datatype: "ExternalId"
	},
	{
		property: "P649",
		label: "NRHP reference number",
		datatype: "ExternalId"
	},
	{
		property: "P650",
		label: "RKDartists ID",
		datatype: "ExternalId"
	},
	{
		property: "P651",
		label: "Biografisch Portaal number",
		datatype: "ExternalId"
	},
	{
		property: "P652",
		label: "UNII",
		datatype: "ExternalId"
	},
	{
		property: "P653",
		label: "PubMed Health",
		datatype: "ExternalId"
	},
	{
		property: "P654",
		label: "direction relative to location",
		datatype: "WikibaseItem"
	},
	{
		property: "P655",
		label: "translator",
		datatype: "WikibaseItem"
	},
	{
		property: "P656",
		label: "RefSeq",
		datatype: "String"
	},
	{
		property: "P657",
		label: "RTECS number",
		datatype: "ExternalId"
	},
	{
		property: "P658",
		label: "tracklist",
		datatype: "WikibaseItem"
	},
	{
		property: "P659",
		label: "genomic assembly",
		datatype: "WikibaseItem"
	},
	{
		property: "P660",
		label: "EC classification",
		datatype: "WikibaseItem"
	},
	{
		property: "P661",
		label: "ChemSpider ID",
		datatype: "ExternalId"
	},
	{
		property: "P662",
		label: "PubChem CID",
		datatype: "ExternalId"
	},
	{
		property: "P663",
		label: "DSM-IV",
		datatype: "ExternalId"
	},
	{
		property: "P664",
		label: "organizer",
		datatype: "WikibaseItem"
	},
	{
		property: "P665",
		label: "KEGG ID",
		datatype: "ExternalId"
	},
	{
		property: "P667",
		label: "ICPC 2 ID",
		datatype: "String"
	},
	{
		property: "P668",
		label: "GeneReviews ID",
		datatype: "ExternalId"
	},
	{
		property: "P669",
		label: "located on street",
		datatype: "WikibaseItem"
	},
	{
		property: "P670",
		label: "street number",
		datatype: "String"
	},
	{
		property: "P671",
		label: "Mouse Genome Informatics ID",
		datatype: "ExternalId"
	},
	{
		property: "P672",
		label: "MeSH Code",
		datatype: "ExternalId"
	},
	{
		property: "P673",
		label: "eMedicine",
		datatype: "ExternalId"
	},
	{
		property: "P674",
		label: "characters",
		datatype: "WikibaseItem"
	},
	{
		property: "P675",
		label: "Google Books ID",
		datatype: "ExternalId"
	},
	{
		property: "P676",
		label: "lyrics by",
		datatype: "WikibaseItem"
	},
	{
		property: "P677",
		label: "ÚSOP code",
		datatype: "ExternalId"
	},
	{
		property: "P678",
		label: "incertae sedis",
		datatype: "WikibaseItem"
	},
	{
		property: "P679",
		label: "ZVG number",
		datatype: "ExternalId"
	},
	{
		property: "P680",
		label: "molecular function",
		datatype: "WikibaseItem"
	},
	{
		property: "P681",
		label: "cell component",
		datatype: "WikibaseItem"
	},
	{
		property: "P682",
		label: "biological process",
		datatype: "WikibaseItem"
	},
	{
		property: "P683",
		label: "ChEBI-ID",
		datatype: "ExternalId"
	},
	{
		property: "P684",
		label: "ortholog",
		datatype: "WikibaseItem"
	},
	{
		property: "P685",
		label: "NCBI Taxonomy ID",
		datatype: "ExternalId"
	},
	{
		property: "P686",
		label: "Gene Ontology ID",
		datatype: "ExternalId"
	},
	{
		property: "P687",
		label: "BHL Page ID",
		datatype: "ExternalId"
	},
	{
		property: "P688",
		label: "encodes",
		datatype: "WikibaseItem"
	},
	{
		property: "P689",
		label: "afflicts",
		datatype: "WikibaseItem"
	},
	{
		property: "P690",
		label: "space group",
		datatype: "WikibaseItem"
	},
	{
		property: "P691",
		label: "NKCR AUT ID",
		datatype: "ExternalId"
	},
	{
		property: "P692",
		label: "Gene Atlas Image",
		datatype: "CommonsMedia"
	},
	{
		property: "P693",
		label: "cleavage",
		datatype: "WikibaseItem"
	},
	{
		property: "P694",
		label: "replaced synonym (for nom. nov.)",
		datatype: "WikibaseItem"
	},
	{
		property: "P695",
		label: "UN number",
		datatype: "ExternalId"
	},
	{
		property: "P696",
		label: "Neurolex ID",
		datatype: "ExternalId"
	},
	{
		property: "P697",
		label: "ex taxon author",
		datatype: "WikibaseItem"
	},
	{
		property: "P698",
		label: "PubMed ID",
		datatype: "ExternalId"
	},
	{
		property: "P699",
		label: "Disease Ontology ID",
		datatype: "ExternalId"
	},
	{
		property: "P700",
		label: "Kemler code",
		datatype: "ExternalId"
	},
	{
		property: "P701",
		label: "Dodis",
		datatype: "ExternalId"
	},
	{
		property: "P702",
		label: "encoded by",
		datatype: "WikibaseItem"
	},
	{
		property: "P703",
		label: "found in taxon",
		datatype: "WikibaseItem"
	},
	{
		property: "P704",
		label: "Ensembl Transcript ID",
		datatype: "ExternalId"
	},
	{
		property: "P705",
		label: "Ensembl Protein ID",
		datatype: "ExternalId"
	},
	{
		property: "P706",
		label: "located on terrain feature",
		datatype: "WikibaseItem"
	},
	{
		property: "P707",
		label: "satellite bus",
		datatype: "WikibaseItem"
	},
	{
		property: "P708",
		label: "diocese",
		datatype: "WikibaseItem"
	},
	{
		property: "P709",
		label: "Historic Scotland ID",
		datatype: "ExternalId"
	},
	{
		property: "P710",
		label: "participant",
		datatype: "WikibaseItem"
	},
	{
		property: "P711",
		label: "Strunz 8th edition (series ID, updated)",
		datatype: "String"
	},
	{
		property: "P712",
		label: "Nickel-Strunz 9th edition (updated 2009)",
		datatype: "String"
	},
	{
		property: "P713",
		label: "Nickel-Strunz 10th (pending) edition",
		datatype: "String"
	},
	{
		property: "P492",
		label: "OMIM ID",
		datatype: "ExternalId"
	},
	{
		property: "P493",
		label: "ICD-9",
		datatype: "ExternalId"
	},
	{
		property: "P494",
		label: "ICD-10",
		datatype: "ExternalId"
	},
	{
		property: "P495",
		label: "country of origin",
		datatype: "WikibaseItem"
	},
	{
		property: "P496",
		label: "ORCID iD",
		datatype: "ExternalId"
	},
	{
		property: "P497",
		label: "CBDB ID",
		datatype: "ExternalId"
	},
	{
		property: "P498",
		label: "ISO 4217 code",
		datatype: "ExternalId"
	},
	{
		property: "P500",
		label: "exclave of",
		datatype: "WikibaseItem"
	},
	{
		property: "P501",
		label: "enclave within",
		datatype: "WikibaseItem"
	},
	{
		property: "P502",
		label: "HURDAT identifier",
		datatype: "String"
	},
	{
		property: "P503",
		label: "ISO standard",
		datatype: "ExternalId"
	},
	{
		property: "P504",
		label: "home port",
		datatype: "WikibaseItem"
	},
	{
		property: "P505",
		label: "general manager",
		datatype: "WikibaseItem"
	},
	{
		property: "P506",
		label: "ISO 15924 alpha-4 code",
		datatype: "ExternalId"
	},
	{
		property: "P507",
		label: "Swedish county code",
		datatype: "ExternalId"
	},
	{
		property: "P508",
		label: "BNCF Thesaurus",
		datatype: "ExternalId"
	},
	{
		property: "P509",
		label: "cause of death",
		datatype: "WikibaseItem"
	},
	{
		property: "P511",
		label: "honorific prefix",
		datatype: "WikibaseItem"
	},
	{
		property: "P512",
		label: "academic degree",
		datatype: "WikibaseItem"
	},
	{
		property: "P514",
		label: "interleaves with",
		datatype: "WikibaseItem"
	},
	{
		property: "P515",
		label: "phase of matter",
		datatype: "WikibaseItem"
	},
	{
		property: "P516",
		label: "powerplant",
		datatype: "WikibaseItem"
	},
	{
		property: "P517",
		label: "interaction",
		datatype: "WikibaseItem"
	},
	{
		property: "P518",
		label: "applies to part",
		datatype: "WikibaseItem"
	},
	{
		property: "P520",
		label: "armament",
		datatype: "WikibaseItem"
	},
	{
		property: "P521",
		label: "scheduled service destination",
		datatype: "WikibaseItem"
	},
	{
		property: "P522",
		label: "type of orbit",
		datatype: "WikibaseItem"
	},
	{
		property: "P523",
		label: "temporal range start",
		datatype: "WikibaseItem"
	},
	{
		property: "P524",
		label: "temporal range end",
		datatype: "WikibaseItem"
	},
	{
		property: "P525",
		label: "Swedish municipality code",
		datatype: "ExternalId"
	},
	{
		property: "P527",
		label: "has part",
		datatype: "WikibaseItem"
	},
	{
		property: "P528",
		label: "catalog code",
		datatype: "String"
	},
	{
		property: "P529",
		label: "runway",
		datatype: "String"
	},
	{
		property: "P530",
		label: "diplomatic relation",
		datatype: "WikibaseItem"
	},
	{
		property: "P531",
		label: "diplomatic mission sent",
		datatype: "WikibaseItem"
	},
	{
		property: "P532",
		label: "port of registry",
		datatype: "WikibaseItem"
	},
	{
		property: "P533",
		label: "target",
		datatype: "WikibaseItem"
	},
	{
		property: "P534",
		label: "streak color",
		datatype: "WikibaseItem"
	},
	{
		property: "P535",
		label: "Find a Grave grave ID",
		datatype: "ExternalId"
	},
	{
		property: "P536",
		label: "ATP player ID",
		datatype: "ExternalId"
	},
	{
		property: "P537",
		label: "twinning",
		datatype: "WikibaseItem"
	},
	{
		property: "P538",
		label: "fracturing",
		datatype: "WikibaseItem"
	},
	{
		property: "P539",
		label: "Museofile",
		datatype: "ExternalId"
	},
	{
		property: "P541",
		label: "office contested",
		datatype: "WikibaseItem"
	},
	{
		property: "P542",
		label: "officially opened by",
		datatype: "WikibaseItem"
	},
	{
		property: "P543",
		label: "oath made by",
		datatype: "WikibaseItem"
	},
	{
		property: "P545",
		label: "torch lit by",
		datatype: "WikibaseItem"
	},
	{
		property: "P546",
		label: "docking port",
		datatype: "WikibaseItem"
	},
	{
		property: "P547",
		label: "commemorates",
		datatype: "WikibaseItem"
	},
	{
		property: "P548",
		label: "version type",
		datatype: "WikibaseItem"
	},
	{
		property: "P549",
		label: "Mathematics Genealogy Project ID",
		datatype: "ExternalId"
	},
	{
		property: "P550",
		label: "chivalric order",
		datatype: "WikibaseItem"
	},
	{
		property: "P551",
		label: "residence",
		datatype: "WikibaseItem"
	},
	{
		property: "P552",
		label: "handedness",
		datatype: "WikibaseItem"
	},
	{
		property: "P553",
		label: "website account on",
		datatype: "WikibaseItem"
	},
	{
		property: "P554",
		label: "website username",
		datatype: "String"
	},
	{
		property: "P555",
		label: "doubles record",
		datatype: "String"
	},
	{
		property: "P556",
		label: "crystal system",
		datatype: "WikibaseItem"
	},
	{
		property: "P557",
		label: "DiseasesDB",
		datatype: "ExternalId"
	},
	{
		property: "P558",
		label: "unit symbol",
		datatype: "String"
	},
	{
		property: "P559",
		label: "terminus",
		datatype: "WikibaseItem"
	},
	{
		property: "P560",
		label: "direction",
		datatype: "WikibaseItem"
	},
	{
		property: "P561",
		label: "NATO reporting name",
		datatype: "String"
	},
	{
		property: "P562",
		label: "central bank/issuer",
		datatype: "WikibaseItem"
	},
	{
		property: "P563",
		label: "ICD-O",
		datatype: "ExternalId"
	},
	{
		property: "P564",
		label: "singles record",
		datatype: "String"
	},
	{
		property: "P565",
		label: "crystal habit",
		datatype: "WikibaseItem"
	},
	{
		property: "P566",
		label: "basionym",
		datatype: "WikibaseItem"
	},
	{
		property: "P567",
		label: "underlies",
		datatype: "WikibaseItem"
	},
	{
		property: "P568",
		label: "overlies",
		datatype: "WikibaseItem"
	},
	{
		property: "P569",
		label: "date of birth",
		datatype: "Time"
	},
	{
		property: "P570",
		label: "date of death",
		datatype: "Time"
	},
	{
		property: "P571",
		label: "inception",
		datatype: "Time"
	},
	{
		property: "P574",
		label: "date of taxon name publication",
		datatype: "Time"
	},
	{
		property: "P575",
		label: "time of discovery",
		datatype: "Time"
	},
	{
		property: "P576",
		label: "dissolved, abolished or demolished",
		datatype: "Time"
	},
	{
		property: "P577",
		label: "publication date",
		datatype: "Time"
	},
	{
		property: "P578",
		label: "Sandbox-TimeValue",
		datatype: "Time"
	},
	{
		property: "P579",
		label: "IMA status and/or rank",
		datatype: "WikibaseItem"
	},
	{
		property: "P580",
		label: "start time",
		datatype: "Time"
	},
	{
		property: "P582",
		label: "end time",
		datatype: "Time"
	},
	{
		property: "P585",
		label: "point in time",
		datatype: "Time"
	},
	{
		property: "P586",
		label: "IPNI author ID",
		datatype: "ExternalId"
	},
	{
		property: "P587",
		label: "MMSI",
		datatype: "ExternalId"
	},
	{
		property: "P588",
		label: "coolant",
		datatype: "WikibaseItem"
	},
	{
		property: "P589",
		label: "point group",
		datatype: "WikibaseItem"
	},
	{
		property: "P590",
		label: "GNIS ID",
		datatype: "ExternalId"
	},
	{
		property: "P591",
		label: "EC number",
		datatype: "String"
	},
	{
		property: "P592",
		label: "ChEMBL ID",
		datatype: "ExternalId"
	},
	{
		property: "P593",
		label: "HomoloGene ID",
		datatype: "String"
	},
	{
		property: "P594",
		label: "Ensembl Gene ID",
		datatype: "ExternalId"
	},
	{
		property: "P595",
		label: "Guide to Pharmacology Ligand ID",
		datatype: "ExternalId"
	},
	{
		property: "P597",
		label: "WTA player ID",
		datatype: "ExternalId"
	},
	{
		property: "P598",
		label: "commander of",
		datatype: "WikibaseItem"
	},
	{
		property: "P599",
		label: "ITF ID",
		datatype: "ExternalId"
	},
	{
		property: "P600",
		label: "Wine AppDB-ID",
		datatype: "ExternalId"
	},
	{
		property: "P604",
		label: "MedlinePlus ID",
		datatype: "ExternalId"
	},
	{
		property: "P605",
		label: "NUTS code",
		datatype: "ExternalId"
	},
	{
		property: "P606",
		label: "first flight",
		datatype: "Time"
	},
	{
		property: "P607",
		label: "conflict",
		datatype: "WikibaseItem"
	},
	{
		property: "P1776",
		label: "circle of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1777",
		label: "manner of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1778",
		label: "forgery after",
		datatype: "WikibaseItem"
	},
	{
		property: "P1779",
		label: "possible creator",
		datatype: "WikibaseItem"
	},
	{
		property: "P1780",
		label: "school of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1782",
		label: "courtesy name",
		datatype: "String"
	},
	{
		property: "P1785",
		label: "temple name",
		datatype: "String"
	},
	{
		property: "P1786",
		label: "posthumous name",
		datatype: "String"
	},
	{
		property: "P1787",
		label: "art-name",
		datatype: "String"
	},
	{
		property: "P1788",
		label: "DVN ID",
		datatype: "ExternalId"
	},
	{
		property: "P1789",
		label: "chief operating officer",
		datatype: "WikibaseItem"
	},
	{
		property: "P1791",
		label: "category of people buried here",
		datatype: "WikibaseItem"
	},
	{
		property: "P1792",
		label: "category of associated people",
		datatype: "WikibaseItem"
	},
	{
		property: "P1793",
		label: "format as a regular expression",
		datatype: "String"
	},
	{
		property: "P1794",
		label: "bureau du patrimoine de Seine-Saint-Denis ID",
		datatype: "ExternalId"
	},
	{
		property: "P1795",
		label: "Smithsonian American Art Museum: person/institution thesaurus ID",
		datatype: "ExternalId"
	},
	{
		property: "P1796",
		label: "International Standard Industrial Classification code Rev.4",
		datatype: "String"
	},
	{
		property: "P1798",
		label: "ISO 639-5 code",
		datatype: "ExternalId"
	},
	{
		property: "P1799",
		label: "Maltese Islands National Inventory of Cultural Property ID",
		datatype: "ExternalId"
	},
	{
		property: "P1800",
		label: "Wikimedia database name",
		datatype: "ExternalId"
	},
	{
		property: "P1801",
		label: "commemorative plaque image",
		datatype: "CommonsMedia"
	},
	{
		property: "P1802",
		label: "EMLO person ID",
		datatype: "ExternalId"
	},
	{
		property: "P1803",
		label: "Masaryk University person ID",
		datatype: "ExternalId"
	},
	{
		property: "P1804",
		label: "DNF film ID",
		datatype: "ExternalId"
	},
	{
		property: "P1806",
		label: "ABoK number",
		datatype: "ExternalId"
	},
	{
		property: "P1807",
		label: "Great Aragonese Encyclopedia ID",
		datatype: "ExternalId"
	},
	{
		property: "P1808",
		label: "senat.fr ID",
		datatype: "ExternalId"
	},
	{
		property: "P1809",
		label: "choreographer",
		datatype: "WikibaseItem"
	},
	{
		property: "P1810",
		label: "named as",
		datatype: "String"
	},
	{
		property: "P1811",
		label: "list of episodes",
		datatype: "WikibaseItem"
	},
	{
		property: "P1813",
		label: "short name",
		datatype: "Monolingualtext"
	},
	{
		property: "P1814",
		label: "name in kana",
		datatype: "String"
	},
	{
		property: "P1815",
		label: "RSL scanned book's identifier",
		datatype: "String"
	},
	{
		property: "P1816",
		label: "National Portrait Gallery (London) person ID",
		datatype: "ExternalId"
	},
	{
		property: "P1817",
		label: "addressee",
		datatype: "WikibaseItem"
	},
	{
		property: "P1818",
		label: "Kaiserhof ID",
		datatype: "ExternalId"
	},
	{
		property: "P1819",
		label: "genealogics.org person ID",
		datatype: "ExternalId"
	},
	{
		property: "P1820",
		label: "Open Food Facts food additive id",
		datatype: "String"
	},
	{
		property: "P1821",
		label: "Open Food Facts food category ID",
		datatype: "ExternalId"
	},
	{
		property: "P1822",
		label: "DSH object ID",
		datatype: "ExternalId"
	},
	{
		property: "P1823",
		label: "BAnQ work ID",
		datatype: "ExternalId"
	},
	{
		property: "P1824",
		label: "road number",
		datatype: "String"
	},
	{
		property: "P1825",
		label: "Baseball-Reference.com major league player ID",
		datatype: "ExternalId"
	},
	{
		property: "P1826",
		label: "Baseball-Reference.com minor league player ID",
		datatype: "ExternalId"
	},
	{
		property: "P1827",
		label: "ISWC",
		datatype: "ExternalId"
	},
	{
		property: "P1828",
		label: "IPI name number",
		datatype: "ExternalId"
	},
	{
		property: "P1829",
		label: "Roud Folk Song Index number",
		datatype: "ExternalId"
	},
	{
		property: "P1830",
		label: "owner of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1831",
		label: "electorate",
		datatype: "Quantity"
	},
	{
		property: "P1832",
		label: "GrassBase ID",
		datatype: "ExternalId"
	},
	{
		property: "P1833",
		label: "number of registered users/contributors",
		datatype: "Quantity"
	},
	{
		property: "P1836",
		label: "draft pick number",
		datatype: "String"
	},
	{
		property: "P1837",
		label: "Gaoloumi ID",
		datatype: "ExternalId"
	},
	{
		property: "P1838",
		label: "PSS-archi ID",
		datatype: "ExternalId"
	},
	{
		property: "P1839",
		label: "US Federal Election Commission ID",
		datatype: "ExternalId"
	},
	{
		property: "P1840",
		label: "investigated by",
		datatype: "WikibaseItem"
	},
	{
		property: "P1841",
		label: "Swedish district code",
		datatype: "ExternalId"
	},
	{
		property: "P1842",
		label: "Global Anabaptist Mennonite Encyclopedia Online ID",
		datatype: "ExternalId"
	},
	{
		property: "P1843",
		label: "taxon common name",
		datatype: "Monolingualtext"
	},
	{
		property: "P1844",
		label: "HathiTrust ID",
		datatype: "ExternalId"
	},
	{
		property: "P1845",
		label: "anti-virus alias",
		datatype: "String"
	},
	{
		property: "P1846",
		label: "distribution map",
		datatype: "CommonsMedia"
	},
	{
		property: "P1847",
		label: "Nasjonalbiblioteket photographer ID",
		datatype: "ExternalId"
	},
	{
		property: "P1848",
		label: "protected areas INPN Code",
		datatype: "ExternalId"
	},
	{
		property: "P1849",
		label: "SSR WrittenForm ID",
		datatype: "ExternalId"
	},
	{
		property: "P1850",
		label: "SSR place name number",
		datatype: "ExternalId"
	},
	{
		property: "P1851",
		label: "input set",
		datatype: "WikibaseItem"
	},
	{
		property: "P1852",
		label: "Perry Index",
		datatype: "ExternalId"
	},
	{
		property: "P1853",
		label: "blood type",
		datatype: "WikibaseItem"
	},
	{
		property: "P1854",
		label: "Kiev street code",
		datatype: "ExternalId"
	},
	{
		property: "P1855",
		label: "Wikidata property example",
		datatype: "WikibaseItem"
	},
	{
		property: "P1866",
		label: "Catholic Hierarchy diocese ID",
		datatype: "ExternalId"
	},
	{
		property: "P1867",
		label: "eligible voters",
		datatype: "Quantity"
	},
	{
		property: "P1868",
		label: "ballots cast",
		datatype: "Quantity"
	},
	{
		property: "P1869",
		label: "Hall of Valor ID",
		datatype: "ExternalId"
	},
	{
		property: "P1870",
		label: "Name Assigning Authority Number",
		datatype: "ExternalId"
	},
	{
		property: "P1871",
		label: "CERL ID",
		datatype: "ExternalId"
	},
	{
		property: "P1872",
		label: "minimum number of players",
		datatype: "Quantity"
	},
	{
		property: "P1873",
		label: "maximum number of players",
		datatype: "Quantity"
	},
	{
		property: "P1874",
		label: "Netflix ID",
		datatype: "ExternalId"
	},
	{
		property: "P1875",
		label: "represented by",
		datatype: "WikibaseItem"
	},
	{
		property: "P1876",
		label: "vessel",
		datatype: "WikibaseItem"
	},
	{
		property: "P1877",
		label: "after a work by",
		datatype: "WikibaseItem"
	},
	{
		property: "P1878",
		label: "Vox-ATypI classification",
		datatype: "WikibaseItem"
	},
	{
		property: "P1879",
		label: "income classification (Philippines)",
		datatype: "WikibaseItem"
	},
	{
		property: "P1880",
		label: "measured by",
		datatype: "WikibaseItem"
	},
	{
		property: "P1881",
		label: "list of characters",
		datatype: "WikibaseItem"
	},
	{
		property: "P1882",
		label: "Web Gallery of Art ID",
		datatype: "ExternalId"
	},
	{
		property: "P1883",
		label: "Declarator.org ID",
		datatype: "ExternalId"
	},
	{
		property: "P1884",
		label: "hair color",
		datatype: "WikibaseItem"
	},
	{
		property: "P1885",
		label: "cathedral",
		datatype: "WikibaseItem"
	},
	{
		property: "P1886",
		label: "Smithsonian volcano ID",
		datatype: "ExternalId"
	},
	{
		property: "P1887",
		label: "vice-county",
		datatype: "WikibaseItem"
	},
	{
		property: "P1888",
		label: "Dictionary of Medieval Names from European Sources entry",
		datatype: "ExternalId"
	},
	{
		property: "P1889",
		label: "different from",
		datatype: "WikibaseItem"
	},
	{
		property: "P1890",
		label: "BNC ID",
		datatype: "ExternalId"
	},
	{
		property: "P1891",
		label: "signatory",
		datatype: "WikibaseItem"
	},
	{
		property: "P1893",
		label: "OpenPlaques plaque ID",
		datatype: "ExternalId"
	},
	{
		property: "P1894",
		label: "Danish urban area code",
		datatype: "ExternalId"
	},
	{
		property: "P1895",
		label: "Fauna Europaea ID",
		datatype: "ExternalId"
	},
	{
		property: "P2322",
		label: "article ID",
		datatype: "String"
	},
	{
		property: "P2323",
		label: "Swedish Olympic Committee athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P2324",
		label: "quantity buried",
		datatype: "Quantity"
	},
	{
		property: "P2325",
		label: "mean anomaly",
		datatype: "Quantity"
	},
	{
		property: "P2326",
		label: "GNS Unique Feature ID",
		datatype: "ExternalId"
	},
	{
		property: "P2327",
		label: "ProCyclingStats race ID",
		datatype: "ExternalId"
	},
	{
		property: "P2328",
		label: "ProCyclingStats team ID",
		datatype: "ExternalId"
	},
	{
		property: "P2329",
		label: "antagonist muscle",
		datatype: "WikibaseItem"
	},
	{
		property: "P2330",
		label: "Cycling Archives race ID",
		datatype: "ExternalId"
	},
	{
		property: "P2331",
		label: "Cycling Archives team ID",
		datatype: "ExternalId"
	},
	{
		property: "P2332",
		label: "Dictionary of Art Historians ID",
		datatype: "ExternalId"
	},
	{
		property: "P2333",
		label: "Norwegian organization number",
		datatype: "ExternalId"
	},
	{
		property: "P2334",
		label: "Swedish Film Database film ID",
		datatype: "ExternalId"
	},
	{
		property: "P2335",
		label: "SFDb company ID",
		datatype: "ExternalId"
	},
	{
		property: "P2336",
		label: "SFDb soundtrack ID",
		datatype: "ExternalId"
	},
	{
		property: "P2337",
		label: "SFDb group ID",
		datatype: "ExternalId"
	},
	{
		property: "P2338",
		label: "Musopen composer ID",
		datatype: "ExternalId"
	},
	{
		property: "P2339",
		label: "BoardGameGeek ID",
		datatype: "ExternalId"
	},
	{
		property: "P2340",
		label: "CESAR person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2341",
		label: "indigenous to",
		datatype: "WikibaseItem"
	},
	{
		property: "P2342",
		label: "AGORHA person/institution ID",
		datatype: "ExternalId"
	},
	{
		property: "P2343",
		label: "playing range image",
		datatype: "CommonsMedia"
	},
	{
		property: "P2344",
		label: "AGORHA work ID",
		datatype: "ExternalId"
	},
	{
		property: "P2345",
		label: "AGORHA event identifier",
		datatype: "ExternalId"
	},
	{
		property: "P2346",
		label: "Elonet movie ID",
		datatype: "ExternalId"
	},
	{
		property: "P2347",
		label: "YSO ID",
		datatype: "ExternalId"
	},
	{
		property: "P2348",
		label: "period",
		datatype: "WikibaseItem"
	},
	{
		property: "P2349",
		label: "Stuttgart Database of Scientific Illustrators ID",
		datatype: "ExternalId"
	},
	{
		property: "P2350",
		label: "Speedskatingbase.eu ID",
		datatype: "ExternalId"
	},
	{
		property: "P2351",
		label: "number of graves",
		datatype: "Quantity"
	},
	{
		property: "P2352",
		label: "applies to taxon",
		datatype: "WikibaseItem"
	},
	{
		property: "P2353",
		label: "statistical unit",
		datatype: "WikibaseItem"
	},
	{
		property: "P2354",
		label: "has list",
		datatype: "WikibaseItem"
	},
	{
		property: "P2355",
		label: "UNESCO Atlas of the World's Languages in Danger ID",
		datatype: "ExternalId"
	},
	{
		property: "P2357",
		label: "Classification of Instructional Programs code",
		datatype: "String"
	},
	{
		property: "P2358",
		label: "Roman praenomen",
		datatype: "WikibaseItem"
	},
	{
		property: "P2359",
		label: "Roman nomen gentilicium",
		datatype: "WikibaseItem"
	},
	{
		property: "P2360",
		label: "intended public",
		datatype: "WikibaseItem"
	},
	{
		property: "P2361",
		label: "online service",
		datatype: "WikibaseItem"
	},
	{
		property: "P2362",
		label: "time to altitude",
		datatype: "Quantity"
	},
	{
		property: "P2363",
		label: "NMHH film rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P2364",
		label: "production code",
		datatype: "String"
	},
	{
		property: "P2365",
		label: "Roman cognomen",
		datatype: "WikibaseItem"
	},
	{
		property: "P2366",
		label: "Roman agnomen",
		datatype: "WikibaseItem"
	},
	{
		property: "P2367",
		label: "Australian Stratigraphic Units Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P2368",
		label: "Sandbox-Property",
		datatype: "WikibaseProperty"
	},
	{
		property: "P2369",
		label: "Soccerway player ID",
		datatype: "ExternalId"
	},
	{
		property: "P2370",
		label: "conversion to SI unit",
		datatype: "Quantity"
	},
	{
		property: "P2371",
		label: "FAO risk status",
		datatype: "WikibaseItem"
	},
	{
		property: "P2372",
		label: "ODIS ID",
		datatype: "ExternalId"
	},
	{
		property: "P2373",
		label: "Genius artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P2374",
		label: "natural abundance",
		datatype: "Quantity"
	},
	{
		property: "P2375",
		label: "has superpartner",
		datatype: "WikibaseItem"
	},
	{
		property: "P2376",
		label: "superpartner of",
		datatype: "WikibaseItem"
	},
	{
		property: "P2377",
		label: "MediaWiki hooks used",
		datatype: "WikibaseItem"
	},
	{
		property: "P2378",
		label: "issued by",
		datatype: "WikibaseItem"
	},
	{
		property: "P2379",
		label: "deprecated in version",
		datatype: "WikibaseItem"
	},
	{
		property: "P2380",
		label: "French Sculpture Census artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P2381",
		label: "Academic Tree ID",
		datatype: "ExternalId"
	},
	{
		property: "P2382",
		label: "Chemins de mémoire ID",
		datatype: "ExternalId"
	},
	{
		property: "P2383",
		label: "CTHS person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2384",
		label: "statement describes",
		datatype: "WikibaseItem"
	},
	{
		property: "P2385",
		label: "French diocesan architects ID",
		datatype: "ExternalId"
	},
	{
		property: "P2386",
		label: "diameter",
		datatype: "Quantity"
	},
	{
		property: "P2387",
		label: "Elonet person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2388",
		label: "office held by head of the organisation",
		datatype: "WikibaseItem"
	},
	{
		property: "P2389",
		label: "organisation directed from the office",
		datatype: "WikibaseItem"
	},
	{
		property: "P2390",
		label: "Ballotpedia ID",
		datatype: "ExternalId"
	},
	{
		property: "P2391",
		label: "OKPO ID",
		datatype: "ExternalId"
	},
	{
		property: "P2392",
		label: "teaching method",
		datatype: "WikibaseItem"
	},
	{
		property: "P2393",
		label: "NCBI Locus tag",
		datatype: "ExternalId"
	},
	{
		property: "P2394",
		label: "MGI Gene Symbol",
		datatype: "ExternalId"
	},
	{
		property: "P2396",
		label: "image of function",
		datatype: "WikibaseItem"
	},
	{
		property: "P2397",
		label: "YouTube channel ID",
		datatype: "ExternalId"
	},
	{
		property: "P2398",
		label: "MLS player ID",
		datatype: "ExternalId"
	},
	{
		property: "P2399",
		label: "British Council artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P2400",
		label: "JMDb film ID",
		datatype: "ExternalId"
	},
	{
		property: "P2401",
		label: "Six Degrees of Francis Bacon ID",
		datatype: "ExternalId"
	},
	{
		property: "P2402",
		label: "total expenditure",
		datatype: "Quantity"
	},
	{
		property: "P2403",
		label: "total assets",
		datatype: "Quantity"
	},
	{
		property: "P2404",
		label: "time-weighted average exposure limit",
		datatype: "Quantity"
	},
	{
		property: "P2405",
		label: "ceiling exposure limit",
		datatype: "Quantity"
	},
	{
		property: "P2406",
		label: "maximum peak exposure limit",
		datatype: "Quantity"
	},
	{
		property: "P2407",
		label: "short-term exposure limit",
		datatype: "Quantity"
	},
	{
		property: "P2408",
		label: "set in period",
		datatype: "WikibaseItem"
	},
	{
		property: "P2409",
		label: "CiNii article ID",
		datatype: "ExternalId"
	},
	{
		property: "P2410",
		label: "WikiPathways ID",
		datatype: "String"
	},
	{
		property: "P2411",
		label: "Artsy gene",
		datatype: "String"
	},
	{
		property: "P2412",
		label: "Fashion Model Directory designer ID",
		datatype: "ExternalId"
	},
	{
		property: "P2413",
		label: "Fashion Model Directory magazine ID",
		datatype: "ExternalId"
	},
	{
		property: "P2414",
		label: "substrate of",
		datatype: "WikibaseItem"
	},
	{
		property: "P2415",
		label: "personal best",
		datatype: "Quantity"
	},
	{
		property: "P2416",
		label: "sports discipline competed in",
		datatype: "WikibaseItem"
	},
	{
		property: "P2417",
		label: "stage classification",
		datatype: "WikibaseItem"
	},
	{
		property: "P2418",
		label: "Structurae person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2421",
		label: "Prosopographia Attica",
		datatype: "ExternalId"
	},
	{
		property: "P2422",
		label: "number of awards",
		datatype: "Quantity"
	},
	{
		property: "P2423",
		label: "FIE ID",
		datatype: "ExternalId"
	},
	{
		property: "P2424",
		label: "Berlin cultural heritage ID",
		datatype: "ExternalId"
	},
	{
		property: "P2425",
		label: "service ribbon image",
		datatype: "CommonsMedia"
	},
	{
		property: "P714",
		label: "Dana 8th edition",
		datatype: "ExternalId"
	},
	{
		property: "P715",
		label: "Drugbank ID",
		datatype: "ExternalId"
	},
	{
		property: "P716",
		label: "JPL Small-Body Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P717",
		label: "Minor Planet Center observatory code",
		datatype: "ExternalId"
	},
	{
		property: "P718",
		label: "Canmore ID",
		datatype: "ExternalId"
	},
	{
		property: "P720",
		label: "asteroid spectral type",
		datatype: "WikibaseItem"
	},
	{
		property: "P721",
		label: "OKATO ID",
		datatype: "ExternalId"
	},
	{
		property: "P722",
		label: "UIC station code",
		datatype: "ExternalId"
	},
	{
		property: "P723",
		label: "DBNL author ID",
		datatype: "ExternalId"
	},
	{
		property: "P724",
		label: "Internet Archive ID",
		datatype: "ExternalId"
	},
	{
		property: "P725",
		label: "voice actor",
		datatype: "WikibaseItem"
	},
	{
		property: "P726",
		label: "candidate",
		datatype: "WikibaseItem"
	},
	{
		property: "P727",
		label: "Europeana ID",
		datatype: "ExternalId"
	},
	{
		property: "P728",
		label: "GHS hazard statement",
		datatype: "String"
	},
	{
		property: "P729",
		label: "service entry",
		datatype: "Time"
	},
	{
		property: "P730",
		label: "service retirement",
		datatype: "Time"
	},
	{
		property: "P731",
		label: "Litholex ID",
		datatype: "ExternalId"
	},
	{
		property: "P732",
		label: "BGS Lexicon ID",
		datatype: "ExternalId"
	},
	{
		property: "P733",
		label: "DINOloket",
		datatype: "ExternalId"
	},
	{
		property: "P734",
		label: "family name",
		datatype: "WikibaseItem"
	},
	{
		property: "P735",
		label: "given name",
		datatype: "WikibaseItem"
	},
	{
		property: "P736",
		label: "cover artist",
		datatype: "WikibaseItem"
	},
	{
		property: "P737",
		label: "influenced by",
		datatype: "WikibaseItem"
	},
	{
		property: "P739",
		label: "ammunition",
		datatype: "WikibaseItem"
	},
	{
		property: "P740",
		label: "location of formation",
		datatype: "WikibaseItem"
	},
	{
		property: "P741",
		label: "playing hand",
		datatype: "WikibaseItem"
	},
	{
		property: "P742",
		label: "pseudonym",
		datatype: "String"
	},
	{
		property: "P744",
		label: "asteroid family",
		datatype: "WikibaseItem"
	},
	{
		property: "P745",
		label: "Low German Bibliography and Biography ID",
		datatype: "ExternalId"
	},
	{
		property: "P746",
		label: "date of disappearance",
		datatype: "Time"
	},
	{
		property: "P747",
		label: "edition(s)",
		datatype: "WikibaseItem"
	},
	{
		property: "P748",
		label: "appointed by",
		datatype: "WikibaseItem"
	},
	{
		property: "P749",
		label: "parent organization",
		datatype: "WikibaseItem"
	},
	{
		property: "P750",
		label: "distributor",
		datatype: "WikibaseItem"
	},
	{
		property: "P751",
		label: "introduced feature",
		datatype: "WikibaseItem"
	},
	{
		property: "P756",
		label: "removed feature",
		datatype: "WikibaseItem"
	},
	{
		property: "P757",
		label: "World Heritage Site ID",
		datatype: "ExternalId"
	},
	{
		property: "P758",
		label: "Kulturminne ID",
		datatype: "ExternalId"
	},
	{
		property: "P759",
		label: "Alberta Register of Historic Places ID",
		datatype: "ExternalId"
	},
	{
		property: "P760",
		label: "DPLA ID",
		datatype: "ExternalId"
	},
	{
		property: "P761",
		label: "Lake ID (Sweden)",
		datatype: "ExternalId"
	},
	{
		property: "P762",
		label: "Czech cultural heritage ID",
		datatype: "ExternalId"
	},
	{
		property: "P763",
		label: "PEI Register of Historic Places ID",
		datatype: "ExternalId"
	},
	{
		property: "P764",
		label: "OKTMO ID",
		datatype: "ExternalId"
	},
	{
		property: "P765",
		label: "surface played on",
		datatype: "WikibaseItem"
	},
	{
		property: "P767",
		label: "contributor(s) to the subject",
		datatype: "WikibaseItem"
	},
	{
		property: "P768",
		label: "electoral district",
		datatype: "WikibaseItem"
	},
	{
		property: "P769",
		label: "significant drug interaction",
		datatype: "WikibaseItem"
	},
	{
		property: "P770",
		label: "cause of destruction",
		datatype: "WikibaseItem"
	},
	{
		property: "P771",
		label: "Swiss municipality code",
		datatype: "ExternalId"
	},
	{
		property: "P772",
		label: "INE municipality code",
		datatype: "ExternalId"
	},
	{
		property: "P773",
		label: "ISO 3166-3",
		datatype: "ExternalId"
	},
	{
		property: "P774",
		label: "FIPS 55-3 (locations in the US)",
		datatype: "ExternalId"
	},
	{
		property: "P775",
		label: "Swedish urban area code",
		datatype: "ExternalId"
	},
	{
		property: "P776",
		label: "Swedish minor urban area code",
		datatype: "ExternalId"
	},
	{
		property: "P777",
		label: "Swedish civil parish code/ATA code",
		datatype: "ExternalId"
	},
	{
		property: "P778",
		label: "Church of Sweden parish code",
		datatype: "ExternalId"
	},
	{
		property: "P779",
		label: "Church of Sweden Pastoratskod",
		datatype: "ExternalId"
	},
	{
		property: "P780",
		label: "symptoms",
		datatype: "WikibaseItem"
	},
	{
		property: "P781",
		label: "Sikart",
		datatype: "ExternalId"
	},
	{
		property: "P782",
		label: "LAU",
		datatype: "ExternalId"
	},
	{
		property: "P783",
		label: "hymenium type",
		datatype: "WikibaseItem"
	},
	{
		property: "P784",
		label: "mushroom cap shape",
		datatype: "WikibaseItem"
	},
	{
		property: "P785",
		label: "hymenium attachment",
		datatype: "WikibaseItem"
	},
	{
		property: "P786",
		label: "stipe character",
		datatype: "WikibaseItem"
	},
	{
		property: "P787",
		label: "spore print color",
		datatype: "WikibaseItem"
	},
	{
		property: "P788",
		label: "mushroom ecological type",
		datatype: "WikibaseItem"
	},
	{
		property: "P789",
		label: "edibility",
		datatype: "WikibaseItem"
	},
	{
		property: "P790",
		label: "approved by",
		datatype: "WikibaseItem"
	},
	{
		property: "P791",
		label: "ISIL",
		datatype: "String"
	},
	{
		property: "P792",
		label: "chapter",
		datatype: "String"
	},
	{
		property: "P793",
		label: "significant event",
		datatype: "WikibaseItem"
	},
	{
		property: "P794",
		label: "as",
		datatype: "WikibaseItem"
	},
	{
		property: "P795",
		label: "located on linear feature",
		datatype: "WikibaseItem"
	},
	{
		property: "P796",
		label: "geo datum",
		datatype: "WikibaseItem"
	},
	{
		property: "P797",
		label: "authority",
		datatype: "WikibaseItem"
	},
	{
		property: "P798",
		label: "military designation",
		datatype: "String"
	},
	{
		property: "P799",
		label: "Air Ministry specification ID",
		datatype: "String"
	},
	{
		property: "P800",
		label: "notable work",
		datatype: "WikibaseItem"
	},
	{
		property: "P802",
		label: "student",
		datatype: "WikibaseItem"
	},
	{
		property: "P803",
		label: "professorship",
		datatype: "WikibaseItem"
	},
	{
		property: "P804",
		label: "GNIS Antarctica ID",
		datatype: "ExternalId"
	},
	{
		property: "P805",
		label: "subject of the statement",
		datatype: "WikibaseItem"
	},
	{
		property: "P806",
		label: "Italian cadastre code",
		datatype: "ExternalId"
	},
	{
		property: "P807",
		label: "separated from",
		datatype: "WikibaseItem"
	},
	{
		property: "P808",
		label: "code Bien de Interés Cultural",
		datatype: "ExternalId"
	},
	{
		property: "P809",
		label: "WDPA id",
		datatype: "ExternalId"
	},
	{
		property: "P811",
		label: "academic minor",
		datatype: "WikibaseItem"
	},
	{
		property: "P812",
		label: "academic major",
		datatype: "WikibaseItem"
	},
	{
		property: "P813",
		label: "retrieved",
		datatype: "Time"
	},
	{
		property: "P814",
		label: "IUCN protected areas category",
		datatype: "WikibaseItem"
	},
	{
		property: "P815",
		label: "ITIS TSN",
		datatype: "ExternalId"
	},
	{
		property: "P816",
		label: "decays to",
		datatype: "WikibaseItem"
	},
	{
		property: "P817",
		label: "decay mode",
		datatype: "WikibaseItem"
	},
	{
		property: "P818",
		label: "arXiv ID",
		datatype: "ExternalId"
	},
	{
		property: "P819",
		label: "ADS bibcode",
		datatype: "ExternalId"
	},
	{
		property: "P820",
		label: "arXiv classification",
		datatype: "String"
	},
	{
		property: "P821",
		label: "CGNDB Unique ID",
		datatype: "ExternalId"
	},
	{
		property: "P822",
		label: "mascot",
		datatype: "WikibaseItem"
	},
	{
		property: "P823",
		label: "speaker",
		datatype: "WikibaseItem"
	},
	{
		property: "P2004",
		label: "NALT ID",
		datatype: "ExternalId"
	},
	{
		property: "P2005",
		label: "Catalogus Professorum Halensis",
		datatype: "ExternalId"
	},
	{
		property: "P2006",
		label: "ZooBank author ID",
		datatype: "ExternalId"
	},
	{
		property: "P2007",
		label: "ZooBank publication ID",
		datatype: "ExternalId"
	},
	{
		property: "P2008",
		label: "IPNI publication ID",
		datatype: "ExternalId"
	},
	{
		property: "P2009",
		label: "Exif model",
		datatype: "String"
	},
	{
		property: "P2010",
		label: "Exif make",
		datatype: "String"
	},
	{
		property: "P2011",
		label: "Cooper-Hewitt Person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2012",
		label: "cuisine",
		datatype: "WikibaseItem"
	},
	{
		property: "P2013",
		label: "Facebook profile ID",
		datatype: "ExternalId"
	},
	{
		property: "P2014",
		label: "MoMA artwork id",
		datatype: "ExternalId"
	},
	{
		property: "P2015",
		label: "Hansard (1803–2005) ID",
		datatype: "ExternalId"
	},
	{
		property: "P2016",
		label: "Catalogus Professorum Academiae Groninganae id",
		datatype: "ExternalId"
	},
	{
		property: "P2017",
		label: "isomeric SMILES",
		datatype: "String"
	},
	{
		property: "P2018",
		label: "Teuchos ID",
		datatype: "ExternalId"
	},
	{
		property: "P2019",
		label: "AllMovie artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P2020",
		label: "WorldFootball.net ID",
		datatype: "ExternalId"
	},
	{
		property: "P2021",
		label: "Erdős number",
		datatype: "Quantity"
	},
	{
		property: "P2024",
		label: "German cattle breed ID",
		datatype: "ExternalId"
	},
	{
		property: "P2025",
		label: "Find A Grave cemetery ID",
		datatype: "ExternalId"
	},
	{
		property: "P2026",
		label: "Avibase ID",
		datatype: "ExternalId"
	},
	{
		property: "P2027",
		label: "Colour Index International constitution ID",
		datatype: "ExternalId"
	},
	{
		property: "P2028",
		label: "United States Armed Forces service number",
		datatype: "ExternalId"
	},
	{
		property: "P2029",
		label: "Dictionary of Ulster Biography ID",
		datatype: "ExternalId"
	},
	{
		property: "P2030",
		label: "NASA biographical ID",
		datatype: "ExternalId"
	},
	{
		property: "P2031",
		label: "work period (start)",
		datatype: "Time"
	},
	{
		property: "P2032",
		label: "work period (end)",
		datatype: "Time"
	},
	{
		property: "P2033",
		label: "Category for pictures taken with camera",
		datatype: "WikibaseItem"
	},
	{
		property: "P2034",
		label: "Project Gutenberg ebook ID",
		datatype: "ExternalId"
	},
	{
		property: "P2035",
		label: "LinkedIn personal profile URL",
		datatype: "Url"
	},
	{
		property: "P2036",
		label: "African Plant Database",
		datatype: "ExternalId"
	},
	{
		property: "P2037",
		label: "GitHub username",
		datatype: "ExternalId"
	},
	{
		property: "P2038",
		label: "ResearchGate person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2040",
		label: "CITES Species+ ID",
		datatype: "ExternalId"
	},
	{
		property: "P2041",
		label: "National Gallery of Victoria artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P2042",
		label: "Artsy artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P2043",
		label: "length",
		datatype: "Quantity"
	},
	{
		property: "P2044",
		label: "elevation above sea level",
		datatype: "Quantity"
	},
	{
		property: "P2045",
		label: "orbital inclination",
		datatype: "Quantity"
	},
	{
		property: "P2046",
		label: "area",
		datatype: "Quantity"
	},
	{
		property: "P2047",
		label: "duration",
		datatype: "Quantity"
	},
	{
		property: "P2048",
		label: "height",
		datatype: "Quantity"
	},
	{
		property: "P2049",
		label: "width",
		datatype: "Quantity"
	},
	{
		property: "P2050",
		label: "wingspan",
		datatype: "Quantity"
	},
	{
		property: "P2051",
		label: "M sin i",
		datatype: "Quantity"
	},
	{
		property: "P2052",
		label: "speed",
		datatype: "Quantity"
	},
	{
		property: "P2053",
		label: "watershed area",
		datatype: "Quantity"
	},
	{
		property: "P2054",
		label: "density",
		datatype: "Quantity"
	},
	{
		property: "P2055",
		label: "electrical conductivity",
		datatype: "Quantity"
	},
	{
		property: "P2056",
		label: "heat capacity",
		datatype: "Quantity"
	},
	{
		property: "P2057",
		label: "HMDB ID",
		datatype: "ExternalId"
	},
	{
		property: "P2058",
		label: "depositor",
		datatype: "WikibaseItem"
	},
	{
		property: "P2060",
		label: "luminosity",
		datatype: "Quantity"
	},
	{
		property: "P2061",
		label: "aspect ratio",
		datatype: "WikibaseItem"
	},
	{
		property: "P2062",
		label: "HSDB ID",
		datatype: "ExternalId"
	},
	{
		property: "P2063",
		label: "LIPID MAPS ID",
		datatype: "ExternalId"
	},
	{
		property: "P2064",
		label: "KNApSAcK ID",
		datatype: "ExternalId"
	},
	{
		property: "P2065",
		label: "NIAID ChemDB ID",
		datatype: "ExternalId"
	},
	{
		property: "P2066",
		label: "fusion enthalpy",
		datatype: "Quantity"
	},
	{
		property: "P2067",
		label: "mass",
		datatype: "Quantity"
	},
	{
		property: "P2068",
		label: "thermal conductivity",
		datatype: "Quantity"
	},
	{
		property: "P2069",
		label: "magnetic moment",
		datatype: "Quantity"
	},
	{
		property: "P2070",
		label: "Fellow of the Royal Society ID",
		datatype: "ExternalId"
	},
	{
		property: "P2071",
		label: "Mémoire des hommes ID",
		datatype: "ExternalId"
	},
	{
		property: "P2072",
		label: "CDB Chemical ID",
		datatype: "ExternalId"
	},
	{
		property: "P2073",
		label: "vehicle range",
		datatype: "Quantity"
	},
	{
		property: "P2074",
		label: "internetmedicin.se ID",
		datatype: "ExternalId"
	},
	{
		property: "P2075",
		label: "speed of sound",
		datatype: "Quantity"
	},
	{
		property: "P2076",
		label: "temperature",
		datatype: "Quantity"
	},
	{
		property: "P2077",
		label: "pressure",
		datatype: "Quantity"
	},
	{
		property: "P2078",
		label: "user manual link",
		datatype: "Url"
	},
	{
		property: "P2079",
		label: "fabrication method",
		datatype: "WikibaseItem"
	},
	{
		property: "P2080",
		label: "AcademiaNet",
		datatype: "ExternalId"
	},
	{
		property: "P2081",
		label: "BLDAM object ID",
		datatype: "ExternalId"
	},
	{
		property: "P2082",
		label: "M.49 code",
		datatype: "ExternalId"
	},
	{
		property: "P2083",
		label: "Leadscope ID",
		datatype: "ExternalId"
	},
	{
		property: "P2084",
		label: "ZINC ID",
		datatype: "ExternalId"
	},
	{
		property: "P2085",
		label: "Nikkaji",
		datatype: "ExternalId"
	},
	{
		property: "P2086",
		label: "CDD Public ID",
		datatype: "ExternalId"
	},
	{
		property: "P2087",
		label: "CrunchBase person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2088",
		label: "CrunchBase organisation ID",
		datatype: "ExternalId"
	},
	{
		property: "P2089",
		label: "Library of Congress JukeBox ID",
		datatype: "ExternalId"
	},
	{
		property: "P2090",
		label: "Power of 10 athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P2091",
		label: "FISA rower ID",
		datatype: "ExternalId"
	},
	{
		property: "P2092",
		label: "Bildindex der Kunst und Architektur ID",
		datatype: "ExternalId"
	},
	{
		property: "P2093",
		label: "author name string",
		datatype: "String"
	},
	{
		property: "P2094",
		label: "competition class",
		datatype: "WikibaseItem"
	},
	{
		property: "P2095",
		label: "co-driver",
		datatype: "WikibaseItem"
	},
	{
		property: "P2096",
		label: "media legend",
		datatype: "Monolingualtext"
	},
	{
		property: "P2097",
		label: "term length of office",
		datatype: "Quantity"
	},
	{
		property: "P2098",
		label: "substitute/deputy/replacement of office/officeholder",
		datatype: "WikibaseItem"
	},
	{
		property: "P2099",
		label: "BC Geographical Names ID",
		datatype: "ExternalId"
	},
	{
		property: "P2100",
		label: "Banque de noms de lieux du Québec ID",
		datatype: "ExternalId"
	},
	{
		property: "P2101",
		label: "melting point",
		datatype: "Quantity"
	},
	{
		property: "P2102",
		label: "boiling point",
		datatype: "Quantity"
	},
	{
		property: "P2103",
		label: "size of team at start",
		datatype: "Quantity"
	},
	{
		property: "P2105",
		label: "size of team at finish",
		datatype: "Quantity"
	},
	{
		property: "P2106",
		label: "RXNO Ontology",
		datatype: "ExternalId"
	},
	{
		property: "P2107",
		label: "decomposition point",
		datatype: "Quantity"
	},
	{
		property: "P2108",
		label: "Kunstindeks Danmark artwork ID",
		datatype: "ExternalId"
	},
	{
		property: "P2639",
		label: "Filmportal ID",
		datatype: "ExternalId"
	},
	{
		property: "P2640",
		label: "Swimrankings.net swimmer ID",
		datatype: "ExternalId"
	},
	{
		property: "P2641",
		label: "Davis Cup player ID",
		datatype: "ExternalId"
	},
	{
		property: "P2642",
		label: "Fed Cup player ID",
		datatype: "ExternalId"
	},
	{
		property: "P2643",
		label: "Carnegie Classification of Institutions of Higher Education",
		datatype: "WikibaseItem"
	},
	{
		property: "P2645",
		label: "mean lifetime",
		datatype: "Quantity"
	},
	{
		property: "P2646",
		label: "mirTarBase ID",
		datatype: "ExternalId"
	},
	{
		property: "P2647",
		label: "source of material",
		datatype: "WikibaseItem"
	},
	{
		property: "P2648",
		label: "Cycling Quotient ID men's race ID",
		datatype: "ExternalId"
	},
	{
		property: "P2649",
		label: "Cycling Quotient men's team URL",
		datatype: "Url"
	},
	{
		property: "P2650",
		label: "interested in",
		datatype: "WikibaseItem"
	},
	{
		property: "P2651",
		label: "CRICOS Provider Code",
		datatype: "ExternalId"
	},
	{
		property: "P2652",
		label: "partnership with",
		datatype: "WikibaseItem"
	},
	{
		property: "P2655",
		label: "Estyn ID",
		datatype: "ExternalId"
	},
	{
		property: "P2656",
		label: "FIFA World Ranking",
		datatype: "Quantity"
	},
	{
		property: "P2657",
		label: "EU transparency register ID",
		datatype: "ExternalId"
	},
	{
		property: "P2658",
		label: "Scoville grade",
		datatype: "Quantity"
	},
	{
		property: "P2659",
		label: "topographic isolation",
		datatype: "Quantity"
	},
	{
		property: "P2660",
		label: "topographic prominence",
		datatype: "Quantity"
	},
	{
		property: "P2661",
		label: "target interest rate",
		datatype: "Quantity"
	},
	{
		property: "P2662",
		label: "consumption rate per capita",
		datatype: "Quantity"
	},
	{
		property: "P2663",
		label: "tier 1 capital ratio (CETI)",
		datatype: "Quantity"
	},
	{
		property: "P2664",
		label: "units sold",
		datatype: "Quantity"
	},
	{
		property: "P2665",
		label: "alcohol by volume",
		datatype: "Quantity"
	},
	{
		property: "P2666",
		label: "Datahub page",
		datatype: "ExternalId"
	},
	{
		property: "P2667",
		label: "corresponding template",
		datatype: "WikibaseItem"
	},
	{
		property: "P2668",
		label: "stability of property value",
		datatype: "WikibaseItem"
	},
	{
		property: "P2669",
		label: "discontinued date",
		datatype: "Time"
	},
	{
		property: "P2670",
		label: "has parts of the class",
		datatype: "WikibaseItem"
	},
	{
		property: "P2671",
		label: "Google Knowledge Graph identifier",
		datatype: "ExternalId"
	},
	{
		property: "P2672",
		label: "SOATO ID",
		datatype: "ExternalId"
	},
	{
		property: "P2673",
		label: "next crossing upstream",
		datatype: "WikibaseItem"
	},
	{
		property: "P2674",
		label: "next crossing downstream",
		datatype: "WikibaseItem"
	},
	{
		property: "P2675",
		label: "reply to",
		datatype: "WikibaseItem"
	},
	{
		property: "P2676",
		label: "rating certificate ID",
		datatype: "String"
	},
	{
		property: "P2677",
		label: "relative position within image",
		datatype: "String"
	},
	{
		property: "P2678",
		label: "Russiancinema.ru film ID",
		datatype: "ExternalId"
	},
	{
		property: "P2679",
		label: "author of foreword",
		datatype: "WikibaseItem"
	},
	{
		property: "P2680",
		label: "author of afterword",
		datatype: "WikibaseItem"
	},
	{
		property: "P2681",
		label: "is recto of",
		datatype: "WikibaseItem"
	},
	{
		property: "P2682",
		label: "is verso of",
		datatype: "WikibaseItem"
	},
	{
		property: "P2683",
		label: "Bekker Number",
		datatype: "ExternalId"
	},
	{
		property: "P2684",
		label: "Kijkwijzer rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P2685",
		label: "Basketball-Reference.com NBA player ID",
		datatype: "ExternalId"
	},
	{
		property: "P2686",
		label: "Opensecrets Identifier",
		datatype: "ExternalId"
	},
	{
		property: "P2687",
		label: "NDL JPNO",
		datatype: "ExternalId"
	},
	{
		property: "P2688",
		label: "Box Office Mojo person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2689",
		label: "BARTOC ID",
		datatype: "ExternalId"
	},
	{
		property: "P2694",
		label: "ISU figure skater ID",
		datatype: "ExternalId"
	},
	{
		property: "P2695",
		label: "type locality",
		datatype: "WikibaseItem"
	},
	{
		property: "P2696",
		label: "FIG gymnast licence number",
		datatype: "ExternalId"
	},
	{
		property: "P2697",
		label: "ESPNcricinfo.com player ID",
		datatype: "ExternalId"
	},
	{
		property: "P2698",
		label: "CricketArchive player ID",
		datatype: "ExternalId"
	},
	{
		property: "P2699",
		label: "URL",
		datatype: "Url"
	},
	{
		property: "P2700",
		label: "protocol",
		datatype: "WikibaseItem"
	},
	{
		property: "P2701",
		label: "file format",
		datatype: "WikibaseItem"
	},
	{
		property: "P2702",
		label: "dataset distribution",
		datatype: "WikibaseItem"
	},
	{
		property: "P2703",
		label: "BFI work ID",
		datatype: "ExternalId"
	},
	{
		property: "P2704",
		label: "EIDR identifier",
		datatype: "ExternalId"
	},
	{
		property: "P2705",
		label: "Karate Records ID",
		datatype: "ExternalId"
	},
	{
		property: "P2708",
		label: "Cycling Quotient women's race ID",
		datatype: "ExternalId"
	},
	{
		property: "P2709",
		label: "Cycling Quotient female cyclist ID",
		datatype: "ExternalId"
	},
	{
		property: "P2710",
		label: "minimal lethal concentration",
		datatype: "Quantity"
	},
	{
		property: "P2712",
		label: "median lethal concentration",
		datatype: "Quantity"
	},
	{
		property: "P2713",
		label: "sectional view",
		datatype: "CommonsMedia"
	},
	{
		property: "P2715",
		label: "elected in",
		datatype: "WikibaseItem"
	},
	{
		property: "P2716",
		label: "collage image",
		datatype: "CommonsMedia"
	},
	{
		property: "P2717",
		label: "no-observed-adverse-effect level",
		datatype: "Quantity"
	},
	{
		property: "P2718",
		label: "lowest-observed-adverse-effect level",
		datatype: "Quantity"
	},
	{
		property: "P2719",
		label: "Hungarian-style transcription",
		datatype: "String"
	},
	{
		property: "P2720",
		label: "embed URL template",
		datatype: "String"
	},
	{
		property: "P2721",
		label: "Encyclopaedia Metallum release ID",
		datatype: "ExternalId"
	},
	{
		property: "P2722",
		label: "Deezer artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P2723",
		label: "Deezer album ID",
		datatype: "ExternalId"
	},
	{
		property: "P2724",
		label: "Deezer track ID",
		datatype: "ExternalId"
	},
	{
		property: "P2725",
		label: "GOG application ID",
		datatype: "ExternalId"
	},
	{
		property: "P2726",
		label: "UIPM ID",
		datatype: "ExternalId"
	},
	{
		property: "P2727",
		label: "United World Wrestling ID",
		datatype: "ExternalId"
	},
	{
		property: "P2728",
		label: "CageMatch worker ID",
		datatype: "ExternalId"
	},
	{
		property: "P2729",
		label: "Badminton World Federation ID",
		datatype: "ExternalId"
	},
	{
		property: "P2730",
		label: "ISSF ID",
		datatype: "ExternalId"
	},
	{
		property: "P2731",
		label: "Projeto Excelências ID",
		datatype: "ExternalId"
	},
	{
		property: "P2732",
		label: "Persée author ID",
		datatype: "ExternalId"
	},
	{
		property: "P2733",
		label: "Persée journal ID",
		datatype: "ExternalId"
	},
	{
		property: "P2734",
		label: "UNZ author identifier",
		datatype: "ExternalId"
	},
	{
		property: "P2735",
		label: "UNZ journal identifier",
		datatype: "ExternalId"
	},
	{
		property: "P2736",
		label: "Biographical Directory of Federal Judges ID",
		datatype: "ExternalId"
	},
	{
		property: "P2737",
		label: "union of",
		datatype: "WikibaseItem"
	},
	{
		property: "P2738",
		label: "disjoint union of",
		datatype: "WikibaseItem"
	},
	{
		property: "P2739",
		label: "typeface/font",
		datatype: "WikibaseItem"
	},
	{
		property: "P2740",
		label: "ResearchGate institute ID",
		datatype: "ExternalId"
	},
	{
		property: "P2741",
		label: "Tate artist identifier",
		datatype: "ExternalId"
	},
	{
		property: "P2742",
		label: "Australian Geological Provinces ID",
		datatype: "ExternalId"
	},
	{
		property: "P2743",
		label: "this zoological name is coordinate with",
		datatype: "WikibaseItem"
	},
	{
		property: "P2744",
		label: "PASE name",
		datatype: "String"
	},
	{
		property: "P2745",
		label: "Dictionary of New Zealand Biography",
		datatype: "ExternalId"
	},
	{
		property: "P2746",
		label: "production statistics",
		datatype: "WikibaseItem"
	},
	{
		property: "P2747",
		label: "Filmiroda rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P2748",
		label: "PRONOM file format identifier",
		datatype: "ExternalId"
	},
	{
		property: "P2749",
		label: "PRONOM software identifier",
		datatype: "ExternalId"
	},
	{
		property: "P1896",
		label: "source website for the property",
		datatype: "Url"
	},
	{
		property: "P1897",
		label: "highest note",
		datatype: "WikibaseItem"
	},
	{
		property: "P1898",
		label: "lowest note",
		datatype: "WikibaseItem"
	},
	{
		property: "P1899",
		label: "LibriVox author ID",
		datatype: "ExternalId"
	},
	{
		property: "P1900",
		label: "EAGLE id",
		datatype: "ExternalId"
	},
	{
		property: "P1901",
		label: "BALaT person/organisation id",
		datatype: "ExternalId"
	},
	{
		property: "P1902",
		label: "Spotify artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P1903",
		label: "volcanic explosivity index",
		datatype: "WikibaseItem"
	},
	{
		property: "P1905",
		label: "FundRef registry name",
		datatype: "Monolingualtext"
	},
	{
		property: "P1906",
		label: "office held by head of state",
		datatype: "WikibaseItem"
	},
	{
		property: "P1907",
		label: "Australian Dictionary of Biography ID",
		datatype: "ExternalId"
	},
	{
		property: "P1908",
		label: "CWGC person ID",
		datatype: "ExternalId"
	},
	{
		property: "P1909",
		label: "side effect",
		datatype: "WikibaseItem"
	},
	{
		property: "P1910",
		label: "decreased expression in",
		datatype: "WikibaseItem"
	},
	{
		property: "P1911",
		label: "increased expression in",
		datatype: "WikibaseItem"
	},
	{
		property: "P1912",
		label: "deletion association with",
		datatype: "WikibaseItem"
	},
	{
		property: "P1913",
		label: "gene duplication association with",
		datatype: "WikibaseItem"
	},
	{
		property: "P1914",
		label: "gene insertion association with",
		datatype: "WikibaseItem"
	},
	{
		property: "P1915",
		label: "gene inversion association with",
		datatype: "WikibaseItem"
	},
	{
		property: "P1916",
		label: "gene substitution association with",
		datatype: "WikibaseItem"
	},
	{
		property: "P1917",
		label: "posttranslational modification association with",
		datatype: "WikibaseItem"
	},
	{
		property: "P1918",
		label: "altered regulation leads to",
		datatype: "WikibaseItem"
	},
	{
		property: "P1919",
		label: "Ministry of Education of Chile school ID",
		datatype: "ExternalId"
	},
	{
		property: "P1920",
		label: "CWGC burial ground ID",
		datatype: "ExternalId"
	},
	{
		property: "P1921",
		label: "URI used in RDF",
		datatype: "String"
	},
	{
		property: "P1922",
		label: "first line",
		datatype: "Monolingualtext"
	},
	{
		property: "P1923",
		label: "participating teams",
		datatype: "WikibaseItem"
	},
	{
		property: "P1924",
		label: "vaccine for",
		datatype: "WikibaseItem"
	},
	{
		property: "P1925",
		label: "VIOLIN ID",
		datatype: "ExternalId"
	},
	{
		property: "P1928",
		label: "Vaccine Ontology ID",
		datatype: "ExternalId"
	},
	{
		property: "P1929",
		label: "ClinVar accession",
		datatype: "ExternalId"
	},
	{
		property: "P1930",
		label: "DSM-5",
		datatype: "ExternalId"
	},
	{
		property: "P1931",
		label: "NIOSH Pocket Guide ID",
		datatype: "String"
	},
	{
		property: "P1932",
		label: "stated as",
		datatype: "String"
	},
	{
		property: "P1933",
		label: "MobyGames ID",
		datatype: "ExternalId"
	},
	{
		property: "P1934",
		label: "Animator.ru film ID",
		datatype: "ExternalId"
	},
	{
		property: "P1935",
		label: "Database of Classical Scholars ID",
		datatype: "ExternalId"
	},
	{
		property: "P1936",
		label: "Digital Atlas of the Roman Empire ID",
		datatype: "ExternalId"
	},
	{
		property: "P1937",
		label: "UN/LOCODE",
		datatype: "ExternalId"
	},
	{
		property: "P1938",
		label: "Project Gutenberg author ID",
		datatype: "ExternalId"
	},
	{
		property: "P1939",
		label: "Dyntaxa ID",
		datatype: "ExternalId"
	},
	{
		property: "P1940",
		label: "conifers.org ID",
		datatype: "ExternalId"
	},
	{
		property: "P1942",
		label: "McCune-Reischauer romanization",
		datatype: "String"
	},
	{
		property: "P1943",
		label: "location map",
		datatype: "CommonsMedia"
	},
	{
		property: "P1944",
		label: "relief location map",
		datatype: "CommonsMedia"
	},
	{
		property: "P1945",
		label: "street key",
		datatype: "String"
	},
	{
		property: "P1946",
		label: "National Library of Ireland authority",
		datatype: "ExternalId"
	},
	{
		property: "P1947",
		label: "Mapillary ID",
		datatype: "ExternalId"
	},
	{
		property: "P1948",
		label: "BerlPap identifier",
		datatype: "ExternalId"
	},
	{
		property: "P1949",
		label: "CulturaItalia ID",
		datatype: "ExternalId"
	},
	{
		property: "P1950",
		label: "second surname in Spanish name",
		datatype: "WikibaseItem"
	},
	{
		property: "P1951",
		label: "investor",
		datatype: "WikibaseItem"
	},
	{
		property: "P1952",
		label: "Encyclopaedia Metallum band ID",
		datatype: "ExternalId"
	},
	{
		property: "P1953",
		label: "Discogs artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P1954",
		label: "Discogs master ID",
		datatype: "ExternalId"
	},
	{
		property: "P1955",
		label: "Discogs label ID",
		datatype: "ExternalId"
	},
	{
		property: "P1956",
		label: "takeoff and landing capability",
		datatype: "WikibaseItem"
	},
	{
		property: "P1957",
		label: "Wikisource index page",
		datatype: "Url"
	},
	{
		property: "P1958",
		label: "Trismegistos Geo ID",
		datatype: "ExternalId"
	},
	{
		property: "P1959",
		label: "Dutch Senate person ID",
		datatype: "ExternalId"
	},
	{
		property: "P1960",
		label: "Google Scholar author ID",
		datatype: "ExternalId"
	},
	{
		property: "P1961",
		label: "CTHS society ID",
		datatype: "ExternalId"
	},
	{
		property: "P1962",
		label: "patron",
		datatype: "WikibaseItem"
	},
	{
		property: "P1963",
		label: "properties for this type",
		datatype: "WikibaseProperty"
	},
	{
		property: "P1966",
		label: "Biblioteca Nacional de Chile catalogue number",
		datatype: "ExternalId"
	},
	{
		property: "P1967",
		label: "BoxRec ID",
		datatype: "ExternalId"
	},
	{
		property: "P1968",
		label: "Foursquare venue ID",
		datatype: "ExternalId"
	},
	{
		property: "P1969",
		label: "MovieMeter director ID",
		datatype: "ExternalId"
	},
	{
		property: "P1970",
		label: "MovieMeter Movie ID",
		datatype: "ExternalId"
	},
	{
		property: "P1971",
		label: "number of children",
		datatype: "Quantity"
	},
	{
		property: "P1972",
		label: "Open Hub ID",
		datatype: "ExternalId"
	},
	{
		property: "P1973",
		label: "RSL editions",
		datatype: "ExternalId"
	},
	{
		property: "P1976",
		label: "INEGI locality ID",
		datatype: "ExternalId"
	},
	{
		property: "P1977",
		label: "Les Archives du Spectacle ID",
		datatype: "ExternalId"
	},
	{
		property: "P1978",
		label: "USDA NDB number",
		datatype: "ExternalId"
	},
	{
		property: "P1979",
		label: "Righteous Among The Nations ID",
		datatype: "ExternalId"
	},
	{
		property: "P1980",
		label: "PolSys ID",
		datatype: "ExternalId"
	},
	{
		property: "P1981",
		label: "FSK film rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P1982",
		label: "Anime News Network person ID",
		datatype: "ExternalId"
	},
	{
		property: "P1983",
		label: "Anime News Network company ID",
		datatype: "ExternalId"
	},
	{
		property: "P1984",
		label: "Anime News Network manga ID",
		datatype: "ExternalId"
	},
	{
		property: "P1985",
		label: "Anime News Network anime ID",
		datatype: "ExternalId"
	},
	{
		property: "P1986",
		label: "Dizionario Biografico degli Italiani",
		datatype: "ExternalId"
	},
	{
		property: "P1987",
		label: "MCN code",
		datatype: "String"
	},
	{
		property: "P1988",
		label: "Delarge ID",
		datatype: "ExternalId"
	},
	{
		property: "P1989",
		label: "Encyclopaedia Metallum artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P1990",
		label: "species kept",
		datatype: "WikibaseItem"
	},
	{
		property: "P1991",
		label: "LPSN URL",
		datatype: "Url"
	},
	{
		property: "P1992",
		label: "Plazi ID",
		datatype: "ExternalId"
	},
	{
		property: "P1993",
		label: "TeX string",
		datatype: "String"
	},
	{
		property: "P1994",
		label: "AllMusic composition ID",
		datatype: "ExternalId"
	},
	{
		property: "P1995",
		label: "medical specialty",
		datatype: "WikibaseItem"
	},
	{
		property: "P1996",
		label: "parliament.uk ID",
		datatype: "ExternalId"
	},
	{
		property: "P1997",
		label: "Facebook Places ID",
		datatype: "ExternalId"
	},
	{
		property: "P1998",
		label: "UCI code",
		datatype: "String"
	},
	{
		property: "P1999",
		label: "UNESCO language status",
		datatype: "WikibaseItem"
	},
	{
		property: "P2000",
		label: "CPDL ID",
		datatype: "String"
	},
	{
		property: "P2001",
		label: "Revised Romanization",
		datatype: "String"
	},
	{
		property: "P2002",
		label: "Twitter username",
		datatype: "ExternalId"
	},
	{
		property: "P2003",
		label: "Instagram username",
		datatype: "ExternalId"
	},
	{
		property: "P2426",
		label: "Xeno-canto species ID",
		datatype: "ExternalId"
	},
	{
		property: "P2427",
		label: "GRID ID",
		datatype: "ExternalId"
	},
	{
		property: "P2428",
		label: "RePEc Short-ID",
		datatype: "ExternalId"
	},
	{
		property: "P2429",
		label: "expected completeness",
		datatype: "WikibaseItem"
	},
	{
		property: "P2430",
		label: "takeoff roll",
		datatype: "Quantity"
	},
	{
		property: "P2431",
		label: "Thyssen-Bornemisza artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P2432",
		label: "J. Paul Getty Museum artist id",
		datatype: "ExternalId"
	},
	{
		property: "P2433",
		label: "gender of a scientific name of a genus",
		datatype: "WikibaseItem"
	},
	{
		property: "P2434",
		label: "Panarctic Flora ID",
		datatype: "ExternalId"
	},
	{
		property: "P2435",
		label: "PORT person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2436",
		label: "voltage",
		datatype: "Quantity"
	},
	{
		property: "P2437",
		label: "number of seasons",
		datatype: "Quantity"
	},
	{
		property: "P2438",
		label: "narrator",
		datatype: "WikibaseItem"
	},
	{
		property: "P2439",
		label: "language",
		datatype: "WikibaseItem"
	},
	{
		property: "P2440",
		label: "transliteration",
		datatype: "String"
	},
	{
		property: "P2441",
		label: "literal translation",
		datatype: "Monolingualtext"
	},
	{
		property: "P2442",
		label: "conversion to standard unit",
		datatype: "Quantity"
	},
	{
		property: "P2443",
		label: "stage reached",
		datatype: "WikibaseItem"
	},
	{
		property: "P2444",
		label: "homoglyph",
		datatype: "WikibaseItem"
	},
	{
		property: "P2445",
		label: "metasubclass of",
		datatype: "WikibaseItem"
	},
	{
		property: "P2446",
		label: "Transfermarkt player ID",
		datatype: "ExternalId"
	},
	{
		property: "P2447",
		label: "Transfermarkt manager ID",
		datatype: "ExternalId"
	},
	{
		property: "P2448",
		label: "Turkish Football Federation player ID",
		datatype: "ExternalId"
	},
	{
		property: "P2449",
		label: "Turkish Football Federation coach  ID",
		datatype: "ExternalId"
	},
	{
		property: "P2450",
		label: "Encyclopædia Britannica contributor ID",
		datatype: "ExternalId"
	},
	{
		property: "P2451",
		label: "MAME ROM",
		datatype: "ExternalId"
	},
	{
		property: "P2452",
		label: "GeoNames feature code",
		datatype: "ExternalId"
	},
	{
		property: "P2453",
		label: "nominee",
		datatype: "WikibaseItem"
	},
	{
		property: "P2454",
		label: "KNAW past member ID",
		datatype: "ExternalId"
	},
	{
		property: "P2455",
		label: "Species Profile and Threats Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P2456",
		label: "DBLP ID",
		datatype: "ExternalId"
	},
	{
		property: "P2457",
		label: "Australian National Shipwreck ID",
		datatype: "ExternalId"
	},
	{
		property: "P2458",
		label: "Mackolik.com player ID",
		datatype: "ExternalId"
	},
	{
		property: "P2459",
		label: "IBU biathlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P2460",
		label: "Persons of Ancient Athens",
		datatype: "ExternalId"
	},
	{
		property: "P2461",
		label: "ComLaw ID",
		datatype: "ExternalId"
	},
	{
		property: "P2462",
		label: "member of the deme",
		datatype: "WikibaseItem"
	},
	{
		property: "P2463",
		label: "elibrary.ru organisation ID",
		datatype: "ExternalId"
	},
	{
		property: "P2464",
		label: "BugGuide ID",
		datatype: "ExternalId"
	},
	{
		property: "P2465",
		label: "Allcinema film ID",
		datatype: "ExternalId"
	},
	{
		property: "P2467",
		label: "Global Geoparks Network ID",
		datatype: "ExternalId"
	},
	{
		property: "P2468",
		label: "Theatricalia theatre ID",
		datatype: "ExternalId"
	},
	{
		property: "P2469",
		label: "Theatricalia person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2470",
		label: "Talouselämän vaikuttajat ID",
		datatype: "ExternalId"
	},
	{
		property: "P2471",
		label: "Models.com person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2472",
		label: "ACMA Radiocommunications Licence ID",
		datatype: "ExternalId"
	},
	{
		property: "P2473",
		label: "IGCPV ID",
		datatype: "ExternalId"
	},
	{
		property: "P2474",
		label: "CDLI ID",
		datatype: "ExternalId"
	},
	{
		property: "P2475",
		label: "NAVA ID",
		datatype: "ExternalId"
	},
	{
		property: "P2476",
		label: "HNI person/institution ID",
		datatype: "ExternalId"
	},
	{
		property: "P2477",
		label: "TBRC Resource ID",
		datatype: "ExternalId"
	},
	{
		property: "P2478",
		label: "Railways Archive event ID",
		datatype: "ExternalId"
	},
	{
		property: "P2479",
		label: "SPDX ID",
		datatype: "ExternalId"
	},
	{
		property: "P2480",
		label: "IHO Hydrographic Dictionary (S-32) Number",
		datatype: "ExternalId"
	},
	{
		property: "P2481",
		label: "Elite Prospects player ID",
		datatype: "ExternalId"
	},
	{
		property: "P2482",
		label: "SABR ID",
		datatype: "ExternalId"
	},
	{
		property: "P2483",
		label: "NCES District ID",
		datatype: "ExternalId"
	},
	{
		property: "P2484",
		label: "NCES School ID",
		datatype: "ExternalId"
	},
	{
		property: "P2485",
		label: "Fashion Model Directory photographer ID",
		datatype: "ExternalId"
	},
	{
		property: "P2486",
		label: "Fashion Model Directory brand ID",
		datatype: "ExternalId"
	},
	{
		property: "P2487",
		label: "page at website of Belarus Geocenter",
		datatype: "ExternalId"
	},
	{
		property: "P2488",
		label: "page at Belarus Globe website",
		datatype: "Url"
	},
	{
		property: "P2489",
		label: "page at hram.by",
		datatype: "ExternalId"
	},
	{
		property: "P2490",
		label: "page at OSTIS Belarus Wiki",
		datatype: "String"
	},
	{
		property: "P2491",
		label: "Radzima.org ID",
		datatype: "ExternalId"
	},
	{
		property: "P2492",
		label: "MTMT author ID",
		datatype: "ExternalId"
	},
	{
		property: "P2493",
		label: "OM institution ID",
		datatype: "ExternalId"
	},
	{
		property: "P2494",
		label: "Latvian cultural heritage register ID",
		datatype: "ExternalId"
	},
	{
		property: "P2496",
		label: "Latvian toponymic names database ID",
		datatype: "ExternalId"
	},
	{
		property: "P2497",
		label: "Latvian National Address Register ID",
		datatype: "ExternalId"
	},
	{
		property: "P2498",
		label: "Catalan Biographical Dictionary of Women ID",
		datatype: "ExternalId"
	},
	{
		property: "P2499",
		label: "league level above",
		datatype: "WikibaseItem"
	},
	{
		property: "P2500",
		label: "league level below",
		datatype: "WikibaseItem"
	},
	{
		property: "P2501",
		label: "results",
		datatype: "WikibaseItem"
	},
	{
		property: "P2502",
		label: "classification of cycling race",
		datatype: "WikibaseItem"
	},
	{
		property: "P2503",
		label: "Genealogical Gazetteer (GOV) ID",
		datatype: "ExternalId"
	},
	{
		property: "P2504",
		label: "Norwegian municipality number",
		datatype: "ExternalId"
	},
	{
		property: "P2505",
		label: "carries",
		datatype: "WikibaseItem"
	},
	{
		property: "P2506",
		label: "INSEE canton code",
		datatype: "ExternalId"
	},
	{
		property: "P2507",
		label: "corrigendum / erratum",
		datatype: "WikibaseItem"
	},
	{
		property: "P2508",
		label: "KINENOTE film ID",
		datatype: "ExternalId"
	},
	{
		property: "P2509",
		label: "Movie Walker ID",
		datatype: "ExternalId"
	},
	{
		property: "P2510",
		label: "National Discography of Italian Song artist/group ID",
		datatype: "ExternalId"
	},
	{
		property: "P2511",
		label: "MSK Gent work PID",
		datatype: "ExternalId"
	},
	{
		property: "P2512",
		label: "spin-off",
		datatype: "WikibaseItem"
	},
	{
		property: "P2513",
		label: "Jamendo album ID",
		datatype: "ExternalId"
	},
	{
		property: "P2514",
		label: "Jamendo artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P2515",
		label: "costume designer",
		datatype: "WikibaseItem"
	},
	{
		property: "P2516",
		label: "Australian Ramsar site ID",
		datatype: "ExternalId"
	},
	{
		property: "P2517",
		label: "category for recipients of this award",
		datatype: "WikibaseItem"
	},
	{
		property: "P2518",
		label: "Scope.dk film ID",
		datatype: "ExternalId"
	},
	{
		property: "P2519",
		label: "Scope.dk person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2520",
		label: "UNESCO Biosphere Reserve url",
		datatype: "Url"
	},
	{
		property: "P2521",
		label: "female form of label",
		datatype: "Monolingualtext"
	},
	{
		property: "P2522",
		label: "victory",
		datatype: "WikibaseItem"
	},
	{
		property: "P2524",
		label: "SEED number",
		datatype: "ExternalId"
	},
	{
		property: "P2525",
		label: "Ramsar Sites Information Service ID",
		datatype: "ExternalId"
	},
	{
		property: "P2526",
		label: "National Historic Sites of Canada ID",
		datatype: "ExternalId"
	},
	{
		property: "P2527",
		label: "earthquake magnitude on the moment magnitude scale",
		datatype: "Quantity"
	},
	{
		property: "P2528",
		label: "earthquake magnitude on the Richter magnitude scale",
		datatype: "Quantity"
	},
	{
		property: "P824",
		label: "Meteoritical Bulletin Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P825",
		label: "dedicated to",
		datatype: "WikibaseItem"
	},
	{
		property: "P826",
		label: "tonality",
		datatype: "WikibaseItem"
	},
	{
		property: "P827",
		label: "BBC programme ID",
		datatype: "ExternalId"
	},
	{
		property: "P828",
		label: "has cause",
		datatype: "WikibaseItem"
	},
	{
		property: "P829",
		label: "OEIS ID",
		datatype: "ExternalId"
	},
	{
		property: "P830",
		label: "Encyclopedia of Life ID",
		datatype: "ExternalId"
	},
	{
		property: "P831",
		label: "parent club",
		datatype: "WikibaseItem"
	},
	{
		property: "P832",
		label: "public holiday",
		datatype: "WikibaseItem"
	},
	{
		property: "P833",
		label: "interchange station",
		datatype: "WikibaseItem"
	},
	{
		property: "P834",
		label: "train depot",
		datatype: "WikibaseItem"
	},
	{
		property: "P835",
		label: "author citation (zoology)",
		datatype: "String"
	},
	{
		property: "P836",
		label: "GSS code (2011)",
		datatype: "ExternalId"
	},
	{
		property: "P837",
		label: "day in year for periodic occurrence",
		datatype: "WikibaseItem"
	},
	{
		property: "P838",
		label: "BioLib ID",
		datatype: "ExternalId"
	},
	{
		property: "P839",
		label: "IMSLP ID",
		datatype: "ExternalId"
	},
	{
		property: "P840",
		label: "narrative location",
		datatype: "WikibaseItem"
	},
	{
		property: "P841",
		label: "feast day",
		datatype: "WikibaseItem"
	},
	{
		property: "P842",
		label: "Fossilworks ID",
		datatype: "ExternalId"
	},
	{
		property: "P843",
		label: "SIRUTA code",
		datatype: "ExternalId"
	},
	{
		property: "P844",
		label: "UBIGEO code",
		datatype: "ExternalId"
	},
	{
		property: "P845",
		label: "Saskatchewan Register of Heritage Property ID",
		datatype: "ExternalId"
	},
	{
		property: "P846",
		label: "Global Biodiversity Information Facility ID",
		datatype: "ExternalId"
	},
	{
		property: "P847",
		label: "United States Navy aircraft designation",
		datatype: "String"
	},
	{
		property: "P849",
		label: "Japanese military aircraft designation",
		datatype: "ExternalId"
	},
	{
		property: "P850",
		label: "WoRMS-ID",
		datatype: "ExternalId"
	},
	{
		property: "P852",
		label: "ESRB rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P853",
		label: "CERO rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P854",
		label: "reference URL",
		datatype: "Url"
	},
	{
		property: "P855",
		label: "Sandbox-URL",
		datatype: "Url"
	},
	{
		property: "P856",
		label: "official website",
		datatype: "Url"
	},
	{
		property: "P858",
		label: "ESPNscrum player ID",
		datatype: "ExternalId"
	},
	{
		property: "P859",
		label: "sponsor",
		datatype: "WikibaseItem"
	},
	{
		property: "P860",
		label: "e-archiv.li ID",
		datatype: "ExternalId"
	},
	{
		property: "P861",
		label: "PremiershipRugby.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P862",
		label: "Operational Requirement of the UK Air Ministry",
		datatype: "ExternalId"
	},
	{
		property: "P863",
		label: "InPhO ID",
		datatype: "ExternalId"
	},
	{
		property: "P864",
		label: "ACM Digital Library author ID",
		datatype: "ExternalId"
	},
	{
		property: "P865",
		label: "BMLO",
		datatype: "ExternalId"
	},
	{
		property: "P866",
		label: "Perlentaucher ID",
		datatype: "ExternalId"
	},
	{
		property: "P867",
		label: "ROME Occupation Code (v3)",
		datatype: "ExternalId"
	},
	{
		property: "P868",
		label: "foods traditionally associated",
		datatype: "WikibaseItem"
	},
	{
		property: "P870",
		label: "instrumentation",
		datatype: "WikibaseItem"
	},
	{
		property: "P872",
		label: "printed by",
		datatype: "WikibaseItem"
	},
	{
		property: "P873",
		label: "phase point",
		datatype: "WikibaseItem"
	},
	{
		property: "P874",
		label: "UN class",
		datatype: "String"
	},
	{
		property: "P875",
		label: "UN code classification",
		datatype: "String"
	},
	{
		property: "P876",
		label: "UN packaging group",
		datatype: "String"
	},
	{
		property: "P877",
		label: "NFPA Other",
		datatype: "String"
	},
	{
		property: "P878",
		label: "avionics",
		datatype: "WikibaseItem"
	},
	{
		property: "P879",
		label: "pennant number",
		datatype: "String"
	},
	{
		property: "P880",
		label: "CPU",
		datatype: "WikibaseItem"
	},
	{
		property: "P881",
		label: "type of variable star",
		datatype: "WikibaseItem"
	},
	{
		property: "P882",
		label: "FIPS 6-4 (US counties)",
		datatype: "ExternalId"
	},
	{
		property: "P883",
		label: "FIPS 5-2 (code for US states)",
		datatype: "ExternalId"
	},
	{
		property: "P884",
		label: "State Water Register Code (Russia)",
		datatype: "ExternalId"
	},
	{
		property: "P885",
		label: "origin of the watercourse",
		datatype: "WikibaseItem"
	},
	{
		property: "P886",
		label: "LIR",
		datatype: "ExternalId"
	},
	{
		property: "P887",
		label: "based on heuristic",
		datatype: "WikibaseItem"
	},
	{
		property: "P888",
		label: "JSTOR article ID",
		datatype: "ExternalId"
	},
	{
		property: "P889",
		label: "Mathematical Reviews ID",
		datatype: "ExternalId"
	},
	{
		property: "P892",
		label: "RfC ID",
		datatype: "ExternalId"
	},
	{
		property: "P893",
		label: "Social Science Research Network ID",
		datatype: "ExternalId"
	},
	{
		property: "P894",
		label: "zbMATH ID",
		datatype: "ExternalId"
	},
	{
		property: "P897",
		label: "United States Army and Air Force aircraft designation",
		datatype: "String"
	},
	{
		property: "P898",
		label: "IPA transcription",
		datatype: "String"
	},
	{
		property: "P901",
		label: "FIPS 10-4 (countries and regions)",
		datatype: "ExternalId"
	},
	{
		property: "P902",
		label: "HDS ID",
		datatype: "ExternalId"
	},
	{
		property: "P905",
		label: "PORT film ID",
		datatype: "ExternalId"
	},
	{
		property: "P906",
		label: "SELIBR",
		datatype: "ExternalId"
	},
	{
		property: "P908",
		label: "PEGI rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P909",
		label: "Nova Scotia Register of Historic Places ID",
		datatype: "ExternalId"
	},
	{
		property: "P910",
		label: "topic's main category",
		datatype: "WikibaseItem"
	},
	{
		property: "P911",
		label: "South African municipality code",
		datatype: "ExternalId"
	},
	{
		property: "P912",
		label: "has facility",
		datatype: "WikibaseItem"
	},
	{
		property: "P913",
		label: "notation",
		datatype: "WikibaseItem"
	},
	{
		property: "P914",
		label: "USK rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P915",
		label: "filming location",
		datatype: "WikibaseItem"
	},
	{
		property: "P916",
		label: "GSRR rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P917",
		label: "GRAU index",
		datatype: "ExternalId"
	},
	{
		property: "P918",
		label: "NOC Occupation Code",
		datatype: "ExternalId"
	},
	{
		property: "P919",
		label: "SOC Code (2010)",
		datatype: "ExternalId"
	},
	{
		property: "P920",
		label: "LEM ID",
		datatype: "String"
	},
	{
		property: "P921",
		label: "main subject",
		datatype: "WikibaseItem"
	},
	{
		property: "P922",
		label: "magnetic ordering",
		datatype: "WikibaseItem"
	},
	{
		property: "P923",
		label: "medical examinations",
		datatype: "WikibaseItem"
	},
	{
		property: "P924",
		label: "medical treatment",
		datatype: "WikibaseItem"
	},
	{
		property: "P925",
		label: "presynaptic connection",
		datatype: "WikibaseItem"
	},
	{
		property: "P926",
		label: "postsynaptic connection",
		datatype: "WikibaseItem"
	},
	{
		property: "P927",
		label: "anatomical location",
		datatype: "WikibaseItem"
	},
	{
		property: "P928",
		label: "activating neurotransmitter",
		datatype: "WikibaseItem"
	},
	{
		property: "P929",
		label: "color space",
		datatype: "WikibaseItem"
	},
	{
		property: "P930",
		label: "type of electrification",
		datatype: "WikibaseItem"
	},
	{
		property: "P931",
		label: "place served by airport",
		datatype: "WikibaseItem"
	},
	{
		property: "P932",
		label: "PMCID",
		datatype: "ExternalId"
	},
	{
		property: "P933",
		label: "heritagefoundation.ca ID",
		datatype: "ExternalId"
	},
	{
		property: "P935",
		label: "Commons gallery",
		datatype: "String"
	},
	{
		property: "P937",
		label: "work location",
		datatype: "WikibaseItem"
	},
	{
		property: "P938",
		label: "FishBase species ID",
		datatype: "ExternalId"
	},
	{
		property: "P939",
		label: "KSH code",
		datatype: "ExternalId"
	},
	{
		property: "P2109",
		label: "installed capacity",
		datatype: "Quantity"
	},
	{
		property: "P2112",
		label: "wing area",
		datatype: "Quantity"
	},
	{
		property: "P2113",
		label: "sublimation temperature",
		datatype: "Quantity"
	},
	{
		property: "P2114",
		label: "half-life",
		datatype: "Quantity"
	},
	{
		property: "P2115",
		label: "NDF-RT ID",
		datatype: "ExternalId"
	},
	{
		property: "P2116",
		label: "enthalpy of vaporization",
		datatype: "Quantity"
	},
	{
		property: "P2117",
		label: "combustion enthalpy",
		datatype: "Quantity"
	},
	{
		property: "P2118",
		label: "kinematic viscosity",
		datatype: "Quantity"
	},
	{
		property: "P2119",
		label: "vapor pressure",
		datatype: "Quantity"
	},
	{
		property: "P2120",
		label: "radius",
		datatype: "Quantity"
	},
	{
		property: "P2121",
		label: "prize money",
		datatype: "Quantity"
	},
	{
		property: "P2123",
		label: "YerelNet village ID",
		datatype: "ExternalId"
	},
	{
		property: "P2124",
		label: "member count",
		datatype: "Quantity"
	},
	{
		property: "P2125",
		label: "Revised Hepburn romanization",
		datatype: "String"
	},
	{
		property: "P2126",
		label: "Georgian national system of romanization",
		datatype: "String"
	},
	{
		property: "P2127",
		label: "International Nuclear Event Scale",
		datatype: "WikibaseItem"
	},
	{
		property: "P2128",
		label: "flash point",
		datatype: "Quantity"
	},
	{
		property: "P2129",
		label: "IDLH",
		datatype: "Quantity"
	},
	{
		property: "P2130",
		label: "cost",
		datatype: "Quantity"
	},
	{
		property: "P2131",
		label: "nominal GDP",
		datatype: "Quantity"
	},
	{
		property: "P2132",
		label: "nominal GDP per capita",
		datatype: "Quantity"
	},
	{
		property: "P2133",
		label: "total debt",
		datatype: "Quantity"
	},
	{
		property: "P2134",
		label: "total reserves",
		datatype: "Quantity"
	},
	{
		property: "P2135",
		label: "total exports",
		datatype: "Quantity"
	},
	{
		property: "P2136",
		label: "total imports",
		datatype: "Quantity"
	},
	{
		property: "P2137",
		label: "total equity",
		datatype: "Quantity"
	},
	{
		property: "P2138",
		label: "total liabilities",
		datatype: "Quantity"
	},
	{
		property: "P2139",
		label: "total revenue",
		datatype: "Quantity"
	},
	{
		property: "P2140",
		label: "foreign direct investment net outflow",
		datatype: "Quantity"
	},
	{
		property: "P2141",
		label: "foreign direct investment net inflow",
		datatype: "Quantity"
	},
	{
		property: "P2142",
		label: "box office",
		datatype: "Quantity"
	},
	{
		property: "P2143",
		label: "genome size",
		datatype: "Quantity"
	},
	{
		property: "P2144",
		label: "frequency",
		datatype: "Quantity"
	},
	{
		property: "P2145",
		label: "explosive energy equivalent",
		datatype: "Quantity"
	},
	{
		property: "P2146",
		label: "orbital period",
		datatype: "Quantity"
	},
	{
		property: "P2147",
		label: "rotation period",
		datatype: "Quantity"
	},
	{
		property: "P2148",
		label: "distance from river mouth",
		datatype: "Quantity"
	},
	{
		property: "P2149",
		label: "clock speed",
		datatype: "Quantity"
	},
	{
		property: "P2150",
		label: "FSB speed",
		datatype: "Quantity"
	},
	{
		property: "P2151",
		label: "focal length",
		datatype: "Quantity"
	},
	{
		property: "P2152",
		label: "antiparticle",
		datatype: "WikibaseItem"
	},
	{
		property: "P2153",
		label: "PubChem Substance ID (SID)",
		datatype: "ExternalId"
	},
	{
		property: "P2154",
		label: "binding energy",
		datatype: "Quantity"
	},
	{
		property: "P2155",
		label: "solid solution series with",
		datatype: "WikibaseItem"
	},
	{
		property: "P2156",
		label: "pseudo crystal habit",
		datatype: "WikibaseItem"
	},
	{
		property: "P2157",
		label: "lithography",
		datatype: "WikibaseItem"
	},
	{
		property: "P2158",
		label: "Cell line ontology ID",
		datatype: "ExternalId"
	},
	{
		property: "P2159",
		label: "solves",
		datatype: "WikibaseItem"
	},
	{
		property: "P2160",
		label: "mass excess",
		datatype: "Quantity"
	},
	{
		property: "P2161",
		label: "Guthrie code",
		datatype: "ExternalId"
	},
	{
		property: "P2162",
		label: "Deutsche Ultramarathon-Vereinigung ID",
		datatype: "ExternalId"
	},
	{
		property: "P2163",
		label: "FAST ID",
		datatype: "ExternalId"
	},
	{
		property: "P2164",
		label: "SIGIC author ID",
		datatype: "ExternalId"
	},
	{
		property: "P2165",
		label: "SIGIC group ID",
		datatype: "ExternalId"
	},
	{
		property: "P2166",
		label: "SIGIC institution ID",
		datatype: "ExternalId"
	},
	{
		property: "P2167",
		label: "UNSPSC Code",
		datatype: "ExternalId"
	},
	{
		property: "P2168",
		label: "SFDb person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2169",
		label: "PublicWhip ID",
		datatype: "ExternalId"
	},
	{
		property: "P2170",
		label: "Hansard (2006–March 2016) ID",
		datatype: "ExternalId"
	},
	{
		property: "P2171",
		label: "They Work for You ID",
		datatype: "ExternalId"
	},
	{
		property: "P2172",
		label: "Parliamentary record identifier",
		datatype: "ExternalId"
	},
	{
		property: "P2173",
		label: "BBC News Democracy Live ID",
		datatype: "ExternalId"
	},
	{
		property: "P2174",
		label: "MoMA artist id",
		datatype: "ExternalId"
	},
	{
		property: "P2175",
		label: "medical condition treated",
		datatype: "WikibaseItem"
	},
	{
		property: "P2176",
		label: "drug used for treatment",
		datatype: "WikibaseItem"
	},
	{
		property: "P2177",
		label: "solubility",
		datatype: "Quantity"
	},
	{
		property: "P2178",
		label: "solvent",
		datatype: "WikibaseItem"
	},
	{
		property: "P2179",
		label: "ACM Classification Code (2012)",
		datatype: "String"
	},
	{
		property: "P2180",
		label: "Kansallisbiografia ID",
		datatype: "ExternalId"
	},
	{
		property: "P2181",
		label: "Finnish MP ID",
		datatype: "ExternalId"
	},
	{
		property: "P2182",
		label: "Finnish Ministers database ID",
		datatype: "ExternalId"
	},
	{
		property: "P2183",
		label: "ISO 9:1995",
		datatype: "String"
	},
	{
		property: "P2184",
		label: "history of topic",
		datatype: "WikibaseItem"
	},
	{
		property: "P2185",
		label: "DLI ID",
		datatype: "ExternalId"
	},
	{
		property: "P2186",
		label: "Wiki Loves Monuments ID",
		datatype: "ExternalId"
	},
	{
		property: "P2187",
		label: "BiblioNet publication ID",
		datatype: "ExternalId"
	},
	{
		property: "P2188",
		label: "BiblioNet author ID",
		datatype: "ExternalId"
	},
	{
		property: "P2189",
		label: "BiblioNet publisher ID",
		datatype: "ExternalId"
	},
	{
		property: "P2190",
		label: "C-SPAN person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2191",
		label: "NILF author id",
		datatype: "ExternalId"
	},
	{
		property: "P2192",
		label: "endangeredlanguages.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P2193",
		label: "Soccerbase player ID",
		datatype: "ExternalId"
	},
	{
		property: "P2194",
		label: "PSS-Archi architect id",
		datatype: "ExternalId"
	},
	{
		property: "P2195",
		label: "Soccerbase manager ID",
		datatype: "ExternalId"
	},
	{
		property: "P2196",
		label: "students count",
		datatype: "Quantity"
	},
	{
		property: "P2197",
		label: "production rate",
		datatype: "Quantity"
	},
	{
		property: "P2198",
		label: "average gradient",
		datatype: "Quantity"
	},
	{
		property: "P2199",
		label: "autoignition temperature",
		datatype: "Quantity"
	},
	{
		property: "P2200",
		label: "electric charge",
		datatype: "Quantity"
	},
	{
		property: "P2201",
		label: "electric dipole moment",
		datatype: "Quantity"
	},
	{
		property: "P2202",
		label: "lower flammable limit",
		datatype: "Quantity"
	},
	{
		property: "P2203",
		label: "upper flammable limit",
		datatype: "Quantity"
	},
	{
		property: "P2204",
		label: "minimum explosive concentration",
		datatype: "Quantity"
	},
	{
		property: "P2205",
		label: "Spotify album ID",
		datatype: "ExternalId"
	},
	{
		property: "P2206",
		label: "Discogs release ID",
		datatype: "ExternalId"
	},
	{
		property: "P2207",
		label: "Spotify track ID",
		datatype: "ExternalId"
	},
	{
		property: "P2208",
		label: "average shot length",
		datatype: "Quantity"
	},
	{
		property: "P2209",
		label: "SourceForge project",
		datatype: "ExternalId"
	},
	{
		property: "P2210",
		label: "relative to",
		datatype: "WikibaseItem"
	},
	{
		property: "P2211",
		label: "position angle",
		datatype: "Quantity"
	},
	{
		property: "P2750",
		label: "Photographers' Identities Catalog ID",
		datatype: "ExternalId"
	},
	{
		property: "P2751",
		label: "Roller Coaster Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P2752",
		label: "New Zealand Organisms Register ID",
		datatype: "ExternalId"
	},
	{
		property: "P2753",
		label: "Dictionary of Canadian Biography ID",
		datatype: "ExternalId"
	},
	{
		property: "P2754",
		label: "production date",
		datatype: "Time"
	},
	{
		property: "P2755",
		label: "exploitation visa number",
		datatype: "ExternalId"
	},
	{
		property: "P2756",
		label: "EIRIN film rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P2758",
		label: "CNC film rating (France)",
		datatype: "WikibaseItem"
	},
	{
		property: "P2759",
		label: "AUSNUT food ID",
		datatype: "ExternalId"
	},
	{
		property: "P2760",
		label: "NUTTAB food ID",
		datatype: "ExternalId"
	},
	{
		property: "P2761",
		label: "Research Papers in Economics Series handle",
		datatype: "ExternalId"
	},
	{
		property: "P2762",
		label: "Skyscraper Center building complex ID",
		datatype: "ExternalId"
	},
	{
		property: "P2763",
		label: "Danish protected area ID",
		datatype: "ExternalId"
	},
	{
		property: "P2764",
		label: "Wrestlingdata person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2765",
		label: "blue-style.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P2766",
		label: "ISO 4063 process number",
		datatype: "ExternalId"
	},
	{
		property: "P2767",
		label: "JudoInside.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P2768",
		label: "BNE journal ID",
		datatype: "ExternalId"
	},
	{
		property: "P2769",
		label: "budget",
		datatype: "Quantity"
	},
	{
		property: "P2770",
		label: "source of income",
		datatype: "WikibaseItem"
	},
	{
		property: "P2771",
		label: "D-U-N-S",
		datatype: "ExternalId"
	},
	{
		property: "P2772",
		label: "FIS alpine skier ID",
		datatype: "ExternalId"
	},
	{
		property: "P2773",
		label: "FIS cross-country skier ID",
		datatype: "ExternalId"
	},
	{
		property: "P2774",
		label: "FIS freestyle skier ID",
		datatype: "ExternalId"
	},
	{
		property: "P2775",
		label: "FIS ski jumper ID",
		datatype: "ExternalId"
	},
	{
		property: "P2776",
		label: "FIS Nordic combined skier ID",
		datatype: "ExternalId"
	},
	{
		property: "P2777",
		label: "FIS snowboarder ID",
		datatype: "ExternalId"
	},
	{
		property: "P2778",
		label: "IAT triathlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P2779",
		label: "IAT weightlifter ID",
		datatype: "ExternalId"
	},
	{
		property: "P2780",
		label: "IAT diver ID",
		datatype: "ExternalId"
	},
	{
		property: "P2781",
		label: "race time",
		datatype: "Quantity"
	},
	{
		property: "P2782",
		label: "Models.com client ID",
		datatype: "ExternalId"
	},
	{
		property: "P2783",
		label: "Danish listed buildings case ID",
		datatype: "ExternalId"
	},
	{
		property: "P2784",
		label: "Mercalli intensity scale",
		datatype: "WikibaseItem"
	},
	{
		property: "P2786",
		label: "aerodrome reference point",
		datatype: "GlobeCoordinate"
	},
	{
		property: "P2787",
		label: "longest span",
		datatype: "Quantity"
	},
	{
		property: "P2788",
		label: "Czech neighbourhood ID code",
		datatype: "ExternalId"
	},
	{
		property: "P2789",
		label: "connects with",
		datatype: "WikibaseItem"
	},
	{
		property: "P2790",
		label: "net tonnage",
		datatype: "Quantity"
	},
	{
		property: "P2791",
		label: "power consumed",
		datatype: "Quantity"
	},
	{
		property: "P2792",
		label: "ASF KID Cave Tag Number",
		datatype: "ExternalId"
	},
	{
		property: "P2793",
		label: "clearance",
		datatype: "Quantity"
	},
	{
		property: "P2794",
		label: "Index Hepaticarum ID",
		datatype: "ExternalId"
	},
	{
		property: "P2795",
		label: "directions",
		datatype: "Monolingualtext"
	},
	{
		property: "P2796",
		label: "3DMet ID",
		datatype: "ExternalId"
	},
	{
		property: "P2797",
		label: "sound power level",
		datatype: "Quantity"
	},
	{
		property: "P2798",
		label: "Loop ID",
		datatype: "ExternalId"
	},
	{
		property: "P2799",
		label: "BVMC person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2800",
		label: "Beach Volleyball Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P2801",
		label: "FIVB beach volleyball player ID",
		datatype: "ExternalId"
	},
	{
		property: "P2802",
		label: "fleet or registration number",
		datatype: "String"
	},
	{
		property: "P2803",
		label: "Wikidata time precision",
		datatype: "Quantity"
	},
	{
		property: "P2804",
		label: "World Sailing member ID",
		datatype: "ExternalId"
	},
	{
		property: "P2805",
		label: "Goratings ID",
		datatype: "ExternalId"
	},
	{
		property: "P2806",
		label: "vibration",
		datatype: "Quantity"
	},
	{
		property: "P2807",
		label: "molar volume",
		datatype: "Quantity"
	},
	{
		property: "P2808",
		label: "wavelength",
		datatype: "Quantity"
	},
	{
		property: "P2809",
		label: "Australasian Pollen and Spore Atlas Code",
		datatype: "ExternalId"
	},
	{
		property: "P2810",
		label: "LPGA Tour ID",
		datatype: "ExternalId"
	},
	{
		property: "P2811",
		label: "PGA Tour ID",
		datatype: "ExternalId"
	},
	{
		property: "P2812",
		label: "MathWorld identifier",
		datatype: "ExternalId"
	},
	{
		property: "P2813",
		label: "mouthpiece",
		datatype: "WikibaseItem"
	},
	{
		property: "P2814",
		label: "P-number",
		datatype: "ExternalId"
	},
	{
		property: "P2815",
		label: "ESR station code",
		datatype: "ExternalId"
	},
	{
		property: "P2816",
		label: "HowLongToBeat ID",
		datatype: "ExternalId"
	},
	{
		property: "P2817",
		label: "appears in the heritage monument list",
		datatype: "WikibaseItem"
	},
	{
		property: "P2818",
		label: "Sherdog ID",
		datatype: "ExternalId"
	},
	{
		property: "P2819",
		label: "Yandex.Music album ID",
		datatype: "ExternalId"
	},
	{
		property: "P2820",
		label: "cardinality of this set",
		datatype: "WikibaseItem"
	},
	{
		property: "P2821",
		label: "by-product",
		datatype: "WikibaseItem"
	},
	{
		property: "P2822",
		label: "by-product of",
		datatype: "WikibaseItem"
	},
	{
		property: "P2823",
		label: "Royal Belgian Football Association player ID",
		datatype: "ExternalId"
	},
	{
		property: "P2824",
		label: "Gazetteer of Planetary Nomenclature ID",
		datatype: "ExternalId"
	},
	{
		property: "P2825",
		label: "via",
		datatype: "WikibaseItem"
	},
	{
		property: "P2826",
		label: "Megogo ID",
		datatype: "ExternalId"
	},
	{
		property: "P2827",
		label: "flower color",
		datatype: "WikibaseItem"
	},
	{
		property: "P2828",
		label: "corporate officer",
		datatype: "WikibaseItem"
	},
	{
		property: "P2829",
		label: "Internet Wrestling Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P2830",
		label: "Online World of Wrestling ID",
		datatype: "ExternalId"
	},
	{
		property: "P2831",
		label: "totem",
		datatype: "WikibaseItem"
	},
	{
		property: "P2832",
		label: "Joint Electronics Type Designation Automated System designation",
		datatype: "ExternalId"
	},
	{
		property: "P2833",
		label: "ARKive ID",
		datatype: "ExternalId"
	},
	{
		property: "P2834",
		label: "individual tax rate",
		datatype: "Quantity"
	},
	{
		property: "P2835",
		label: "lowest income threshold",
		datatype: "Quantity"
	},
	{
		property: "P2836",
		label: "highest income threshold",
		datatype: "Quantity"
	},
	{
		property: "P2837",
		label: "Wikidata month number",
		datatype: "Quantity"
	},
	{
		property: "P2838",
		label: "professional name (Japan)",
		datatype: "WikibaseItem"
	},
	{
		property: "P2839",
		label: "gait",
		datatype: "WikibaseItem"
	},
	{
		property: "P2840",
		label: "NSC number",
		datatype: "ExternalId"
	},
	{
		property: "P2841",
		label: "age of onset",
		datatype: "WikibaseItem"
	},
	{
		property: "P2842",
		label: "place of marriage",
		datatype: "WikibaseItem"
	},
	{
		property: "P2843",
		label: "Benezit ID",
		datatype: "ExternalId"
	},
	{
		property: "P2844",
		label: "incidence",
		datatype: "Quantity"
	},
	{
		property: "P2845",
		label: "RAN ID",
		datatype: "ExternalId"
	},
	{
		property: "P2846",
		label: "wheelchair accessibility",
		datatype: "WikibaseItem"
	},
	{
		property: "P2847",
		label: "Google+ ID",
		datatype: "ExternalId"
	},
	{
		property: "P2848",
		label: "Wi-Fi",
		datatype: "WikibaseItem"
	},
	{
		property: "P2849",
		label: "produced by",
		datatype: "WikibaseItem"
	},
	{
		property: "P2850",
		label: "iTunes artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P2851",
		label: "payment types accepted",
		datatype: "WikibaseItem"
	},
	{
		property: "P2212",
		label: "angular distance",
		datatype: "Quantity"
	},
	{
		property: "P2213",
		label: "longitude of ascending node",
		datatype: "Quantity"
	},
	{
		property: "P2214",
		label: "parallax",
		datatype: "Quantity"
	},
	{
		property: "P2215",
		label: "proper motion",
		datatype: "Quantity"
	},
	{
		property: "P2216",
		label: "radial velocity",
		datatype: "Quantity"
	},
	{
		property: "P2217",
		label: "cruise speed",
		datatype: "Quantity"
	},
	{
		property: "P2218",
		label: "net worth estimate",
		datatype: "Quantity"
	},
	{
		property: "P2219",
		label: "real gross domestic product growth rate",
		datatype: "Quantity"
	},
	{
		property: "P2220",
		label: "household wealth",
		datatype: "Quantity"
	},
	{
		property: "P2221",
		label: "flux",
		datatype: "Quantity"
	},
	{
		property: "P2222",
		label: "gyromagnetic ratio",
		datatype: "Quantity"
	},
	{
		property: "P2223",
		label: "decay width",
		datatype: "Quantity"
	},
	{
		property: "P2224",
		label: "spectral line",
		datatype: "Quantity"
	},
	{
		property: "P2225",
		label: "discharge",
		datatype: "Quantity"
	},
	{
		property: "P2226",
		label: "market capitalization",
		datatype: "Quantity"
	},
	{
		property: "P2227",
		label: "metallicity",
		datatype: "Quantity"
	},
	{
		property: "P2228",
		label: "maximum thrust",
		datatype: "Quantity"
	},
	{
		property: "P2229",
		label: "thermal design power",
		datatype: "Quantity"
	},
	{
		property: "P2230",
		label: "torque",
		datatype: "Quantity"
	},
	{
		property: "P2231",
		label: "explosive velocity",
		datatype: "Quantity"
	},
	{
		property: "P2232",
		label: "cash",
		datatype: "Quantity"
	},
	{
		property: "P2233",
		label: "semi-major axis",
		datatype: "Quantity"
	},
	{
		property: "P2234",
		label: "volume as quantity",
		datatype: "Quantity"
	},
	{
		property: "P2235",
		label: "external superproperty",
		datatype: "Url"
	},
	{
		property: "P2236",
		label: "external subproperty",
		datatype: "Url"
	},
	{
		property: "P2237",
		label: "units used for this property",
		datatype: "WikibaseItem"
	},
	{
		property: "P2238",
		label: "official symbol",
		datatype: "WikibaseItem"
	},
	{
		property: "P2239",
		label: "first aid measures",
		datatype: "WikibaseItem"
	},
	{
		property: "P2240",
		label: "median lethal dose",
		datatype: "Quantity"
	},
	{
		property: "P2241",
		label: "reason for deprecation",
		datatype: "WikibaseItem"
	},
	{
		property: "P2242",
		label: "Florentine musea catalogue ID",
		datatype: "ExternalId"
	},
	{
		property: "P2243",
		label: "apoapsis",
		datatype: "Quantity"
	},
	{
		property: "P2244",
		label: "periapsis",
		datatype: "Quantity"
	},
	{
		property: "P2248",
		label: "argument of periapsis",
		datatype: "Quantity"
	},
	{
		property: "P2249",
		label: "Refseq Genome ID",
		datatype: "ExternalId"
	},
	{
		property: "P2250",
		label: "life expectancy",
		datatype: "Quantity"
	},
	{
		property: "P2252",
		label: "National Gallery of Art artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P2253",
		label: "DfE URN",
		datatype: "ExternalId"
	},
	{
		property: "P2254",
		label: "maximum operating altitude",
		datatype: "Quantity"
	},
	{
		property: "P2255",
		label: "Debrett's People of Today ID",
		datatype: "ExternalId"
	},
	{
		property: "P2257",
		label: "frequency of event",
		datatype: "Quantity"
	},
	{
		property: "P2258",
		label: "mobile country code",
		datatype: "String"
	},
	{
		property: "P2259",
		label: "mobile network code",
		datatype: "String"
	},
	{
		property: "P2260",
		label: "ionization energy",
		datatype: "Quantity"
	},
	{
		property: "P2261",
		label: "beam",
		datatype: "Quantity"
	},
	{
		property: "P2262",
		label: "draft",
		datatype: "Quantity"
	},
	{
		property: "P2263",
		label: "ISOCAT id",
		datatype: "String"
	},
	{
		property: "P2264",
		label: "mix'n'match catalogue ID",
		datatype: "ExternalId"
	},
	{
		property: "P2266",
		label: "Fashion Model Directory model ID",
		datatype: "ExternalId"
	},
	{
		property: "P2267",
		label: "Politifact Personality ID",
		datatype: "ExternalId"
	},
	{
		property: "P2268",
		label: "Musée d'Orsay artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P2270",
		label: "Emporis building complex ID",
		datatype: "ExternalId"
	},
	{
		property: "P2271",
		label: "Wikidata property example for properties",
		datatype: "WikibaseProperty"
	},
	{
		property: "P2272",
		label: "Hederich encyclopedia article ID",
		datatype: "ExternalId"
	},
	{
		property: "P2273",
		label: "Heidelberg Academy for Sciences and Humanities member ID",
		datatype: "ExternalId"
	},
	{
		property: "P2275",
		label: "World Health Organisation International Nonproprietary Name",
		datatype: "Monolingualtext"
	},
	{
		property: "P2276",
		label: "UEFA player ID",
		datatype: "ExternalId"
	},
	{
		property: "P2277",
		label: "Magdeburger Biographisches Lexikon",
		datatype: "ExternalId"
	},
	{
		property: "P2278",
		label: "Member of the Hellenic Parliament ID",
		datatype: "ExternalId"
	},
	{
		property: "P2279",
		label: "ambitus",
		datatype: "WikibaseItem"
	},
	{
		property: "P2280",
		label: "Austrian Parliament ID",
		datatype: "ExternalId"
	},
	{
		property: "P2281",
		label: "iTunes album ID",
		datatype: "ExternalId"
	},
	{
		property: "P2282",
		label: "Groeningemuseum work PID",
		datatype: "ExternalId"
	},
	{
		property: "P2283",
		label: "uses",
		datatype: "WikibaseItem"
	},
	{
		property: "P2284",
		label: "price",
		datatype: "Quantity"
	},
	{
		property: "P2285",
		label: "periapsis date",
		datatype: "Time"
	},
	{
		property: "P2286",
		label: "arterial supply",
		datatype: "WikibaseItem"
	},
	{
		property: "P2287",
		label: "CRIStin ID",
		datatype: "ExternalId"
	},
	{
		property: "P2288",
		label: "lymphatic drainage",
		datatype: "WikibaseItem"
	},
	{
		property: "P2289",
		label: "venous drainage",
		datatype: "WikibaseItem"
	},
	{
		property: "P2290",
		label: "Danish parish code",
		datatype: "ExternalId"
	},
	{
		property: "P2291",
		label: "charted in",
		datatype: "WikibaseItem"
	},
	{
		property: "P2292",
		label: "consumption rate",
		datatype: "Quantity"
	},
	{
		property: "P2293",
		label: "genetic association",
		datatype: "WikibaseItem"
	},
	{
		property: "P2294",
		label: "balance of trade",
		datatype: "Quantity"
	},
	{
		property: "P2295",
		label: "net profit",
		datatype: "Quantity"
	},
	{
		property: "P2296",
		label: "money supply",
		datatype: "Quantity"
	},
	{
		property: "P2297",
		label: "employment by economic sector",
		datatype: "Quantity"
	},
	{
		property: "P2298",
		label: "NSDAP membership number (1925–1945)",
		datatype: "ExternalId"
	},
	{
		property: "P2299",
		label: "PPP GDP per capita",
		datatype: "Quantity"
	},
	{
		property: "P2300",
		label: "minimal lethal dose",
		datatype: "Quantity"
	},
	{
		property: "P2302",
		label: "property constraint",
		datatype: "WikibaseItem"
	},
	{
		property: "P2303",
		label: "exception to constraint",
		datatype: "WikibaseItem"
	},
	{
		property: "P2304",
		label: "group by",
		datatype: "WikibaseProperty"
	},
	{
		property: "P2305",
		label: "qualifier of property constraint",
		datatype: "WikibaseItem"
	},
	{
		property: "P2306",
		label: "property",
		datatype: "WikibaseProperty"
	},
	{
		property: "P2307",
		label: "namespace",
		datatype: "String"
	},
	{
		property: "P2308",
		label: "class",
		datatype: "WikibaseItem"
	},
	{
		property: "P2309",
		label: "relation",
		datatype: "WikibaseItem"
	},
	{
		property: "P2310",
		label: "minimum date",
		datatype: "Time"
	},
	{
		property: "P2311",
		label: "maximum date",
		datatype: "Time"
	},
	{
		property: "P2312",
		label: "maximum quantity",
		datatype: "Quantity"
	},
	{
		property: "P2313",
		label: "minimum quantity",
		datatype: "Quantity"
	},
	{
		property: "P2315",
		label: "comment (DEPRECATED)",
		datatype: "Monolingualtext"
	},
	{
		property: "P2316",
		label: "constraint status",
		datatype: "WikibaseItem"
	},
	{
		property: "P2317",
		label: "call sign",
		datatype: "String"
	},
	{
		property: "P2318",
		label: "debut participant",
		datatype: "WikibaseItem"
	},
	{
		property: "P2319",
		label: "elector",
		datatype: "WikibaseItem"
	},
	{
		property: "P2320",
		label: "aftershocks",
		datatype: "Quantity"
	},
	{
		property: "P2321",
		label: "general classification of race participants",
		datatype: "WikibaseItem"
	},
	{
		property: "P2529",
		label: "ČSFD film ID",
		datatype: "ExternalId"
	},
	{
		property: "P2530",
		label: "Box Office Mojo franchise ID",
		datatype: "ExternalId"
	},
	{
		property: "P2531",
		label: "Box Office Mojo studio ID",
		datatype: "ExternalId"
	},
	{
		property: "P2532",
		label: "lowest atmospheric pressure",
		datatype: "Quantity"
	},
	{
		property: "P2533",
		label: "WomenWriters ID",
		datatype: "ExternalId"
	},
	{
		property: "P2534",
		label: "defining formula",
		datatype: "Math"
	},
	{
		property: "P2535",
		label: "Sandbox-Mathematical expression",
		datatype: "Math"
	},
	{
		property: "P2536",
		label: "Sandbox-External identifier",
		datatype: "ExternalId"
	},
	{
		property: "P2537",
		label: "Free Software Directory entry",
		datatype: "ExternalId"
	},
	{
		property: "P2538",
		label: "Nationalmuseum Sweden artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P2539",
		label: "Nationalmuseum Sweden artwork ID",
		datatype: "ExternalId"
	},
	{
		property: "P2540",
		label: "Aarne–Thompson–Uther Tale Type Index",
		datatype: "String"
	},
	{
		property: "P2541",
		label: "operating area",
		datatype: "WikibaseItem"
	},
	{
		property: "P2542",
		label: "acceptable daily intake",
		datatype: "Quantity"
	},
	{
		property: "P2545",
		label: "bowling style",
		datatype: "WikibaseItem"
	},
	{
		property: "P2546",
		label: "sidekick of",
		datatype: "WikibaseItem"
	},
	{
		property: "P2547",
		label: "perimeter",
		datatype: "Quantity"
	},
	{
		property: "P2548",
		label: "strand orientation",
		datatype: "WikibaseItem"
	},
	{
		property: "P2549",
		label: "Italian Senate of the Republic ID",
		datatype: "ExternalId"
	},
	{
		property: "P2550",
		label: "recording or performance of",
		datatype: "WikibaseItem"
	},
	{
		property: "P2551",
		label: "used metre",
		datatype: "WikibaseItem"
	},
	{
		property: "P2552",
		label: "quantitative metrical pattern",
		datatype: "String"
	},
	{
		property: "P2553",
		label: "in work",
		datatype: "WikibaseItem"
	},
	{
		property: "P2554",
		label: "production designer",
		datatype: "WikibaseItem"
	},
	{
		property: "P2555",
		label: "fee",
		datatype: "Quantity"
	},
	{
		property: "P2556",
		label: "bore",
		datatype: "Quantity"
	},
	{
		property: "P2557",
		label: "stroke",
		datatype: "Quantity"
	},
	{
		property: "P2558",
		label: "autores.uy database id",
		datatype: "ExternalId"
	},
	{
		property: "P2559",
		label: "Wikidata usage instructions",
		datatype: "Monolingualtext"
	},
	{
		property: "P2560",
		label: "GPU",
		datatype: "WikibaseItem"
	},
	{
		property: "P2561",
		label: "name",
		datatype: "Monolingualtext"
	},
	{
		property: "P2562",
		label: "married name",
		datatype: "Monolingualtext"
	},
	{
		property: "P2563",
		label: "superhuman feature or ability",
		datatype: "WikibaseItem"
	},
	{
		property: "P2564",
		label: "Köppen climate classification",
		datatype: "WikibaseItem"
	},
	{
		property: "P2565",
		label: "global-warming potential",
		datatype: "Quantity"
	},
	{
		property: "P2566",
		label: "ECHA InfoCard ID",
		datatype: "ExternalId"
	},
	{
		property: "P2567",
		label: "amended by",
		datatype: "WikibaseItem"
	},
	{
		property: "P2568",
		label: "repealed by",
		datatype: "WikibaseItem"
	},
	{
		property: "P2571",
		label: "uncertainty corresponds to",
		datatype: "WikibaseItem"
	},
	{
		property: "P2572",
		label: "Twitter hashtag",
		datatype: "String"
	},
	{
		property: "P2573",
		label: "number of out of school children",
		datatype: "Quantity"
	},
	{
		property: "P2574",
		label: "National-Football-Teams.com player ID",
		datatype: "ExternalId"
	},
	{
		property: "P2575",
		label: "measures",
		datatype: "WikibaseItem"
	},
	{
		property: "P2576",
		label: "UCSC Genome Browser assembly ID",
		datatype: "ExternalId"
	},
	{
		property: "P2577",
		label: "admissible rule in",
		datatype: "WikibaseItem"
	},
	{
		property: "P2578",
		label: "studies",
		datatype: "WikibaseItem"
	},
	{
		property: "P2579",
		label: "studied by",
		datatype: "WikibaseItem"
	},
	{
		property: "P2580",
		label: "Baltisches Biographisches Lexikon digital ID",
		datatype: "ExternalId"
	},
	{
		property: "P2581",
		label: "BabelNet id",
		datatype: "ExternalId"
	},
	{
		property: "P2582",
		label: "J. Paul Getty Museum object ID",
		datatype: "ExternalId"
	},
	{
		property: "P2583",
		label: "distance from Earth",
		datatype: "Quantity"
	},
	{
		property: "P2584",
		label: "Australian Wetlands Code",
		datatype: "ExternalId"
	},
	{
		property: "P2585",
		label: "INSEE region code",
		datatype: "ExternalId"
	},
	{
		property: "P2586",
		label: "INSEE department code",
		datatype: "ExternalId"
	},
	{
		property: "P2587",
		label: "has phoneme",
		datatype: "WikibaseItem"
	},
	{
		property: "P2588",
		label: "administrative code of Indonesia",
		datatype: "ExternalId"
	},
	{
		property: "P2589",
		label: "Statistics Indonesia ethnicity code",
		datatype: "ExternalId"
	},
	{
		property: "P2590",
		label: "BPS language code",
		datatype: "ExternalId"
	},
	{
		property: "P2591",
		label: "grammatical option indicates",
		datatype: "WikibaseItem"
	},
	{
		property: "P2592",
		label: "Québec cultural heritage directory people identifier",
		datatype: "ExternalId"
	},
	{
		property: "P2593",
		label: "Latvian Olympic Committee athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P2595",
		label: "maximum gradient",
		datatype: "Quantity"
	},
	{
		property: "P2596",
		label: "culture",
		datatype: "WikibaseItem"
	},
	{
		property: "P2597",
		label: "Gram staining",
		datatype: "WikibaseItem"
	},
	{
		property: "P2598",
		label: "serial number",
		datatype: "String"
	},
	{
		property: "P2599",
		label: "block size",
		datatype: "Quantity"
	},
	{
		property: "P2600",
		label: "Geni.com profile ID",
		datatype: "ExternalId"
	},
	{
		property: "P2601",
		label: "Eurohockey.com player ID",
		datatype: "ExternalId"
	},
	{
		property: "P2602",
		label: "HockeyDB.com player ID",
		datatype: "ExternalId"
	},
	{
		property: "P2603",
		label: "Kinopoisk film ID",
		datatype: "ExternalId"
	},
	{
		property: "P2604",
		label: "Kinopoisk person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2605",
		label: "ČSFD person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2606",
		label: "PlayStation ID",
		datatype: "ExternalId"
	},
	{
		property: "P2607",
		label: "BookBrainz creator ID",
		datatype: "ExternalId"
	},
	{
		property: "P2610",
		label: "thickness",
		datatype: "Quantity"
	},
	{
		property: "P2611",
		label: "TED speaker ID",
		datatype: "ExternalId"
	},
	{
		property: "P2612",
		label: "TED topic ID",
		datatype: "ExternalId"
	},
	{
		property: "P2613",
		label: "TED talk ID",
		datatype: "ExternalId"
	},
	{
		property: "P2614",
		label: "World Heritage criteria",
		datatype: "WikibaseItem"
	},
	{
		property: "P2618",
		label: "SHOWA ID",
		datatype: "ExternalId"
	},
	{
		property: "P2619",
		label: "Hungarian company ID",
		datatype: "ExternalId"
	},
	{
		property: "P2620",
		label: "ISO 15924 numeric code",
		datatype: "ExternalId"
	},
	{
		property: "P2621",
		label: "Site of Special Scientific Interest (England) ID",
		datatype: "ExternalId"
	},
	{
		property: "P2622",
		label: "Companies House ID",
		datatype: "ExternalId"
	},
	{
		property: "P2623",
		label: "MEK ID",
		datatype: "ExternalId"
	},
	{
		property: "P2624",
		label: "MetroLyrics ID",
		datatype: "ExternalId"
	},
	{
		property: "P2625",
		label: "PASE ID",
		datatype: "ExternalId"
	},
	{
		property: "P2626",
		label: "DNF person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2627",
		label: "ISO 9362 SWIFT/BIC code",
		datatype: "ExternalId"
	},
	{
		property: "P2628",
		label: "German tax authority ID",
		datatype: "ExternalId"
	},
	{
		property: "P2629",
		label: "BBFC rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P2630",
		label: "cost of damage",
		datatype: "Quantity"
	},
	{
		property: "P2631",
		label: "Turner Classic Movies film ID",
		datatype: "ExternalId"
	},
	{
		property: "P2632",
		label: "place of detention",
		datatype: "WikibaseItem"
	},
	{
		property: "P2633",
		label: "geography of topic",
		datatype: "WikibaseItem"
	},
	{
		property: "P2634",
		label: "model",
		datatype: "WikibaseItem"
	},
	{
		property: "P2635",
		label: "number of parts of a work of art",
		datatype: "Quantity"
	},
	{
		property: "P2636",
		label: "Minkultury film ID",
		datatype: "ExternalId"
	},
	{
		property: "P2637",
		label: "RARS rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P2638",
		label: "TV.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P3390",
		label: "Consolidated code of the electronic catalog of libraries of Belarus",
		datatype: "ExternalId"
	},
	{
		property: "P3391",
		label: "Verkhovna Rada MP ID",
		datatype: "ExternalId"
	},
	{
		property: "P3392",
		label: "Surman ID",
		datatype: "ExternalId"
	},
	{
		property: "P3393",
		label: "LittleSis organisation ID",
		datatype: "ExternalId"
	},
	{
		property: "P3394",
		label: "Finnish Lake ID",
		datatype: "ExternalId"
	},
	{
		property: "P3395",
		label: "heart rate",
		datatype: "Quantity"
	},
	{
		property: "P3396",
		label: "French Catholic Church structure ID",
		datatype: "ExternalId"
	},
	{
		property: "P3397",
		label: "Guide of the French Church person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3398",
		label: "Butterflies and Moths of North America ID",
		datatype: "ExternalId"
	},
	{
		property: "P3399",
		label: "JTWC tropical cyclone ID",
		datatype: "ExternalId"
	},
	{
		property: "P3400",
		label: "CORDIS Project ID",
		datatype: "ExternalId"
	},
	{
		property: "P3401",
		label: "Wilderness.net ID",
		datatype: "ExternalId"
	},
	{
		property: "P3402",
		label: "CNC film rating (Romania)",
		datatype: "WikibaseItem"
	},
	{
		property: "P3403",
		label: "coextensive with",
		datatype: "WikibaseItem"
	},
	{
		property: "P3404",
		label: "The Vogue List ID",
		datatype: "ExternalId"
	},
	{
		property: "P3405",
		label: "Nederlands Soortenregister ID",
		datatype: "ExternalId"
	},
	{
		property: "P3406",
		label: "Saccharomyces Genome Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P3407",
		label: "Klosterdatenbank ID",
		datatype: "ExternalId"
	},
	{
		property: "P3408",
		label: "FINA athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3409",
		label: "Catalogus Professorum Lipsiensis ID",
		datatype: "ExternalId"
	},
	{
		property: "P3410",
		label: "Clergy of the Church of England database ID",
		datatype: "ExternalId"
	},
	{
		property: "P3411",
		label: "Saxon Academy of Sciences member ID",
		datatype: "ExternalId"
	},
	{
		property: "P3412",
		label: "Canadian Environmental Sustainability Indicators ID (Protected areas)",
		datatype: "ExternalId"
	},
	{
		property: "P3413",
		label: "Leopoldina member ID",
		datatype: "ExternalId"
	},
	{
		property: "P3414",
		label: "Yle Areena ID",
		datatype: "ExternalId"
	},
	{
		property: "P3415",
		label: "start period",
		datatype: "WikibaseItem"
	},
	{
		property: "P3416",
		label: "end period",
		datatype: "WikibaseItem"
	},
	{
		property: "P3417",
		label: "Quora topic ID",
		datatype: "ExternalId"
	},
	{
		property: "P3418",
		label: "Google Play Store ID",
		datatype: "ExternalId"
	},
	{
		property: "P3419",
		label: "Basic Unit of Settlement code (Czech/Slovak)",
		datatype: "ExternalId"
	},
	{
		property: "P3420",
		label: "Calflora ID",
		datatype: "ExternalId"
	},
	{
		property: "P3421",
		label: "Belvedere artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P3422",
		label: "INSEE countries and foreign territories code",
		datatype: "ExternalId"
	},
	{
		property: "P3423",
		label: "INSEE arrondissement code",
		datatype: "ExternalId"
	},
	{
		property: "P3424",
		label: "Polish cultural heritage register number",
		datatype: "ExternalId"
	},
	{
		property: "P3425",
		label: "Natura 2000 site ID",
		datatype: "ExternalId"
	},
	{
		property: "P3426",
		label: "ArbetSam ID",
		datatype: "ExternalId"
	},
	{
		property: "P3427",
		label: "as.com athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3428",
		label: "INCAA film rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P3429",
		label: "Electronic Enlightenment ID",
		datatype: "ExternalId"
	},
	{
		property: "P3430",
		label: "Social Networks and Archival Context ID",
		datatype: "ExternalId"
	},
	{
		property: "P3431",
		label: "Publons Publication ID",
		datatype: "ExternalId"
	},
	{
		property: "P3432",
		label: "parent cell line",
		datatype: "WikibaseItem"
	},
	{
		property: "P3433",
		label: "biological variant of",
		datatype: "WikibaseItem"
	},
	{
		property: "P3434",
		label: "ERIH PLUS ID",
		datatype: "ExternalId"
	},
	{
		property: "P3435",
		label: "VGMdb artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P3436",
		label: "AELG ID",
		datatype: "ExternalId"
	},
	{
		property: "P3437",
		label: "people or cargo transported",
		datatype: "WikibaseItem"
	},
	{
		property: "P3438",
		label: "vehicle normally used",
		datatype: "WikibaseItem"
	},
	{
		property: "P3439",
		label: "angular resolution",
		datatype: "Quantity"
	},
	{
		property: "P3440",
		label: "time signature",
		datatype: "WikibaseItem"
	},
	{
		property: "P3441",
		label: "FIFA country code",
		datatype: "String"
	},
	{
		property: "P3442",
		label: "Debian stable package",
		datatype: "ExternalId"
	},
	{
		property: "P3443",
		label: "Victorian Heritage Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P3444",
		label: "eBird ID",
		datatype: "ExternalId"
	},
	{
		property: "P3445",
		label: "Cinema of Israel ID",
		datatype: "ExternalId"
	},
	{
		property: "P3446",
		label: "FIDAL ID",
		datatype: "ExternalId"
	},
	{
		property: "P3447",
		label: "mirrors data from",
		datatype: "WikibaseItem"
	},
	{
		property: "P3448",
		label: "stepparent",
		datatype: "WikibaseItem"
	},
	{
		property: "P3449",
		label: "NSW Heritage database ID",
		datatype: "ExternalId"
	},
	{
		property: "P3450",
		label: "sports season of",
		datatype: "WikibaseItem"
	},
	{
		property: "P3451",
		label: "nighttime view",
		datatype: "CommonsMedia"
	},
	{
		property: "P3452",
		label: "inferred from",
		datatype: "WikibaseItem"
	},
	{
		property: "P3453",
		label: "IPI base code",
		datatype: "ExternalId"
	},
	{
		property: "P3454",
		label: "Arch package",
		datatype: "ExternalId"
	},
	{
		property: "P3455",
		label: "CircleID",
		datatype: "ExternalId"
	},
	{
		property: "P3456",
		label: "ATP tennis tournament ID",
		datatype: "ExternalId"
	},
	{
		property: "P3457",
		label: "case fatality rate",
		datatype: "Quantity"
	},
	{
		property: "P3458",
		label: "CNC authorization number",
		datatype: "ExternalId"
	},
	{
		property: "P3459",
		label: "Euring number",
		datatype: "ExternalId"
	},
	{
		property: "P3460",
		label: "colonel-in-chief",
		datatype: "WikibaseItem"
	},
	{
		property: "P3461",
		label: "designated as terrorist by",
		datatype: "WikibaseItem"
	},
	{
		property: "P3462",
		label: "FAMA work ID",
		datatype: "ExternalId"
	},
	{
		property: "P3463",
		label: "Fedora package",
		datatype: "ExternalId"
	},
	{
		property: "P3464",
		label: "medicine marketing authorization",
		datatype: "WikibaseItem"
	},
	{
		property: "P3465",
		label: "maximum frequency of audible sound",
		datatype: "Quantity"
	},
	{
		property: "P3466",
		label: "Israeli CBS municipal ID",
		datatype: "ExternalId"
	},
	{
		property: "P3467",
		label: "Inventario Sculture - Polo Museale Fiorentino",
		datatype: "ExternalId"
	},
	{
		property: "P3468",
		label: "National Inventors Hall of Fame ID",
		datatype: "ExternalId"
	},
	{
		property: "P3469",
		label: "WTA tennis tournament ID",
		datatype: "ExternalId"
	},
	{
		property: "P3470",
		label: "Woodland Trust wood ID",
		datatype: "ExternalId"
	},
	{
		property: "P3471",
		label: "WikiSkripta ID",
		datatype: "ExternalId"
	},
	{
		property: "P3472",
		label: "VICNAMES Place ID",
		datatype: "ExternalId"
	},
	{
		property: "P3473",
		label: "Ubuntu 16.10 package",
		datatype: "ExternalId"
	},
	{
		property: "P3475",
		label: "SANU member ID",
		datatype: "ExternalId"
	},
	{
		property: "P3476",
		label: "PSA World Tour ID",
		datatype: "ExternalId"
	},
	{
		property: "P3477",
		label: "Nihon Tarento Meikan ID",
		datatype: "ExternalId"
	},
	{
		property: "P3478",
		label: "Songkick artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P3479",
		label: "Omni topic ID",
		datatype: "ExternalId"
	},
	{
		property: "P3480",
		label: "base Mémoire reference",
		datatype: "ExternalId"
	},
	{
		property: "P3481",
		label: "Parks & Gardens UK Record ID",
		datatype: "ExternalId"
	},
	{
		property: "P3482",
		label: "Europeana Fashion creator ID",
		datatype: "ExternalId"
	},
	{
		property: "P3483",
		label: "VGMdb album ID",
		datatype: "ExternalId"
	},
	{
		property: "P3484",
		label: "name shares origin with",
		datatype: "WikibaseItem"
	},
	{
		property: "P3485",
		label: "bite force quotient",
		datatype: "Quantity"
	},
	{
		property: "P3486",
		label: "normal respiratory rate",
		datatype: "Quantity"
	},
	{
		property: "P3487",
		label: "maximal incubation period in humans",
		datatype: "Quantity"
	},
	{
		property: "P3488",
		label: "minimal incubation period in humans",
		datatype: "Quantity"
	},
	{
		property: "P3489",
		label: "pregnancy category",
		datatype: "WikibaseItem"
	},
	{
		property: "P3490",
		label: "muscle origin",
		datatype: "WikibaseItem"
	},
	{
		property: "P940",
		label: "GHS precautionary statements",
		datatype: "String"
	},
	{
		property: "P941",
		label: "inspired by",
		datatype: "WikibaseItem"
	},
	{
		property: "P942",
		label: "theme music",
		datatype: "WikibaseItem"
	},
	{
		property: "P943",
		label: "programmer",
		datatype: "WikibaseItem"
	},
	{
		property: "P944",
		label: "Code of nomenclature",
		datatype: "WikibaseItem"
	},
	{
		property: "P945",
		label: "allegiance",
		datatype: "WikibaseItem"
	},
	{
		property: "P946",
		label: "ISIN",
		datatype: "String"
	},
	{
		property: "P947",
		label: "RSL ID (person)",
		datatype: "ExternalId"
	},
	{
		property: "P948",
		label: "page banner",
		datatype: "CommonsMedia"
	},
	{
		property: "P949",
		label: "National Library of Israel ID",
		datatype: "ExternalId"
	},
	{
		property: "P950",
		label: "BNE ID",
		datatype: "ExternalId"
	},
	{
		property: "P951",
		label: "NSZL ID",
		datatype: "ExternalId"
	},
	{
		property: "P952",
		label: "ISCO occupation code",
		datatype: "String"
	},
	{
		property: "P953",
		label: "full work available at",
		datatype: "Url"
	},
	{
		property: "P954",
		label: "IBNR ID",
		datatype: "ExternalId"
	},
	{
		property: "P957",
		label: "ISBN-10",
		datatype: "ExternalId"
	},
	{
		property: "P958",
		label: "section, verse, or paragraph",
		datatype: "String"
	},
	{
		property: "P959",
		label: "MSW ID",
		datatype: "ExternalId"
	},
	{
		property: "P960",
		label: "Tropicos ID",
		datatype: "ExternalId"
	},
	{
		property: "P961",
		label: "IPNI plant ID",
		datatype: "ExternalId"
	},
	{
		property: "P962",
		label: "MycoBank taxon name ID",
		datatype: "ExternalId"
	},
	{
		property: "P963",
		label: "streaming media URL",
		datatype: "Url"
	},
	{
		property: "P964",
		label: "Austrian municipality key",
		datatype: "ExternalId"
	},
	{
		property: "P965",
		label: "burial plot reference",
		datatype: "String"
	},
	{
		property: "P966",
		label: "MusicBrainz label ID",
		datatype: "ExternalId"
	},
	{
		property: "P967",
		label: "guest of honor",
		datatype: "WikibaseItem"
	},
	{
		property: "P968",
		label: "e-mail",
		datatype: "Url"
	},
	{
		property: "P969",
		label: "located at street address",
		datatype: "String"
	},
	{
		property: "P970",
		label: "neurological function",
		datatype: "WikibaseItem"
	},
	{
		property: "P971",
		label: "category combines topics",
		datatype: "WikibaseItem"
	},
	{
		property: "P972",
		label: "catalog",
		datatype: "WikibaseItem"
	},
	{
		property: "P973",
		label: "described at URL",
		datatype: "Url"
	},
	{
		property: "P974",
		label: "tributary",
		datatype: "WikibaseItem"
	},
	{
		property: "P980",
		label: "code for weekend and holiday homes (Sweden)",
		datatype: "ExternalId"
	},
	{
		property: "P981",
		label: "BAG-code for Dutch locations",
		datatype: "ExternalId"
	},
	{
		property: "P982",
		label: "MusicBrainz area ID",
		datatype: "ExternalId"
	},
	{
		property: "P984",
		label: "IOC country code",
		datatype: "ExternalId"
	},
	{
		property: "P988",
		label: "Philippine Standard Geographic Code",
		datatype: "ExternalId"
	},
	{
		property: "P989",
		label: "spoken text audio",
		datatype: "CommonsMedia"
	},
	{
		property: "P990",
		label: "audio recording of the subject's spoken voice",
		datatype: "CommonsMedia"
	},
	{
		property: "P991",
		label: "successful candidate",
		datatype: "WikibaseItem"
	},
	{
		property: "P993",
		label: "NFPA Health",
		datatype: "String"
	},
	{
		property: "P994",
		label: "NFPA Fire",
		datatype: "String"
	},
	{
		property: "P995",
		label: "NFPA Reactivity",
		datatype: "String"
	},
	{
		property: "P996",
		label: "scanned file on Wikimedia Commons",
		datatype: "CommonsMedia"
	},
	{
		property: "P998",
		label: "DMOZ ID",
		datatype: "ExternalId"
	},
	{
		property: "P999",
		label: "ARICNS",
		datatype: "ExternalId"
	},
	{
		property: "P1000",
		label: "record held",
		datatype: "WikibaseItem"
	},
	{
		property: "P1001",
		label: "applies to territorial jurisdiction",
		datatype: "WikibaseItem"
	},
	{
		property: "P1002",
		label: "engine configuration",
		datatype: "WikibaseItem"
	},
	{
		property: "P1003",
		label: "NLR (Romania) ID",
		datatype: "ExternalId"
	},
	{
		property: "P1004",
		label: "MusicBrainz place ID",
		datatype: "ExternalId"
	},
	{
		property: "P1005",
		label: "PTBNP ID",
		datatype: "ExternalId"
	},
	{
		property: "P1006",
		label: "National Thesaurus for Author Names ID",
		datatype: "ExternalId"
	},
	{
		property: "P1007",
		label: "Lattes Platform number",
		datatype: "ExternalId"
	},
	{
		property: "P1010",
		label: "Iran statistics ID",
		datatype: "ExternalId"
	},
	{
		property: "P1011",
		label: "excluding",
		datatype: "WikibaseItem"
	},
	{
		property: "P1012",
		label: "including",
		datatype: "WikibaseItem"
	},
	{
		property: "P1013",
		label: "criterion used",
		datatype: "WikibaseItem"
	},
	{
		property: "P1014",
		label: "AAT ID",
		datatype: "ExternalId"
	},
	{
		property: "P1015",
		label: "BIBSYS ID",
		datatype: "ExternalId"
	},
	{
		property: "P1016",
		label: "asteroid taxonomy",
		datatype: "WikibaseItem"
	},
	{
		property: "P1017",
		label: "BAV ID",
		datatype: "ExternalId"
	},
	{
		property: "P1018",
		label: "language regulatory body",
		datatype: "WikibaseItem"
	},
	{
		property: "P1019",
		label: "feed URL",
		datatype: "Url"
	},
	{
		property: "P1021",
		label: "KldB-2010 occupation code",
		datatype: "ExternalId"
	},
	{
		property: "P1022",
		label: "CNO-11 occupation code",
		datatype: "ExternalId"
	},
	{
		property: "P1023",
		label: "SBC-2010 occupation code",
		datatype: "ExternalId"
	},
	{
		property: "P1024",
		label: "SBFI occupation code",
		datatype: "ExternalId"
	},
	{
		property: "P1025",
		label: "SUDOC editions",
		datatype: "ExternalId"
	},
	{
		property: "P1026",
		label: "doctoral thesis",
		datatype: "WikibaseItem"
	},
	{
		property: "P1027",
		label: "conferred by",
		datatype: "WikibaseItem"
	},
	{
		property: "P1028",
		label: "donated by",
		datatype: "WikibaseItem"
	},
	{
		property: "P1029",
		label: "crew member",
		datatype: "WikibaseItem"
	},
	{
		property: "P1030",
		label: "light characteristic of a lighthouse",
		datatype: "String"
	},
	{
		property: "P1031",
		label: "legal citation of this text",
		datatype: "String"
	},
	{
		property: "P1032",
		label: "Digital Rights Management system",
		datatype: "WikibaseItem"
	},
	{
		property: "P1033",
		label: "GHS signal word",
		datatype: "WikibaseItem"
	},
	{
		property: "P1034",
		label: "main food source",
		datatype: "WikibaseItem"
	},
	{
		property: "P1035",
		label: "honorific suffix",
		datatype: "WikibaseItem"
	},
	{
		property: "P1036",
		label: "Dewey Decimal Classification",
		datatype: "String"
	},
	{
		property: "P1037",
		label: "manager/director",
		datatype: "WikibaseItem"
	},
	{
		property: "P1038",
		label: "relative",
		datatype: "WikibaseItem"
	},
	{
		property: "P1039",
		label: "type of kinship",
		datatype: "WikibaseItem"
	},
	{
		property: "P1040",
		label: "film editor",
		datatype: "WikibaseItem"
	},
	{
		property: "P1041",
		label: "socket supported",
		datatype: "WikibaseItem"
	},
	{
		property: "P1042",
		label: "ZDB ID",
		datatype: "ExternalId"
	},
	{
		property: "P1043",
		label: "IDEO Job ID",
		datatype: "ExternalId"
	},
	{
		property: "P1044",
		label: "SWB editions",
		datatype: "ExternalId"
	},
	{
		property: "P1045",
		label: "Sycomore ID",
		datatype: "ExternalId"
	},
	{
		property: "P1046",
		label: "discovery method",
		datatype: "WikibaseItem"
	},
	{
		property: "P1047",
		label: "Catholic Hierarchy person ID",
		datatype: "ExternalId"
	},
	{
		property: "P1048",
		label: "NCL ID",
		datatype: "ExternalId"
	},
	{
		property: "P1049",
		label: "worshipped by",
		datatype: "WikibaseItem"
	},
	{
		property: "P1050",
		label: "medical condition",
		datatype: "WikibaseItem"
	},
	{
		property: "P1051",
		label: "PSH ID",
		datatype: "ExternalId"
	},
	{
		property: "P1052",
		label: "Portuguese Job Code CPP-2010",
		datatype: "ExternalId"
	},
	{
		property: "P1053",
		label: "ResearcherID",
		datatype: "ExternalId"
	},
	{
		property: "P1054",
		label: "NDL bib ID",
		datatype: "ExternalId"
	},
	{
		property: "P1055",
		label: "NLM Unique ID",
		datatype: "ExternalId"
	},
	{
		property: "P2852",
		label: "emergency phone number",
		datatype: "WikibaseItem"
	},
	{
		property: "P2853",
		label: "electrical plug type",
		datatype: "WikibaseItem"
	},
	{
		property: "P2854",
		label: "disease burden",
		datatype: "Quantity"
	},
	{
		property: "P2855",
		label: "VAT-rate",
		datatype: "Quantity"
	},
	{
		property: "P2856",
		label: "EU Surface Water Body Code",
		datatype: "ExternalId"
	},
	{
		property: "P2857",
		label: "WWE.com superstar ID",
		datatype: "ExternalId"
	},
	{
		property: "P2858",
		label: "KLOV ID",
		datatype: "ExternalId"
	},
	{
		property: "P2859",
		label: "X-SAMPA Code",
		datatype: "String"
	},
	{
		property: "P2860",
		label: "cites",
		datatype: "WikibaseItem"
	},
	{
		property: "P2861",
		label: "Leidse Hoogleraren ID",
		datatype: "ExternalId"
	},
	{
		property: "P2862",
		label: "Catalogus Professorum Academiae Rheno-Traiectinae ID",
		datatype: "ExternalId"
	},
	{
		property: "P2863",
		label: "Nederlandse Molendatabase ID",
		datatype: "ExternalId"
	},
	{
		property: "P2864",
		label: "OpenCritic ID",
		datatype: "ExternalId"
	},
	{
		property: "P2865",
		label: "band number",
		datatype: "ExternalId"
	},
	{
		property: "P2866",
		label: "Hollandsche Molen ID",
		datatype: "ExternalId"
	},
	{
		property: "P2867",
		label: "Molenecho's ID",
		datatype: "ExternalId"
	},
	{
		property: "P2868",
		label: "subject has role",
		datatype: "WikibaseItem"
	},
	{
		property: "P2869",
		label: "record or record progression",
		datatype: "WikibaseItem"
	},
	{
		property: "P2870",
		label: "miRBase pre-miRNA ID",
		datatype: "ExternalId"
	},
	{
		property: "P2871",
		label: "miRBase mature miRNA ID",
		datatype: "ExternalId"
	},
	{
		property: "P2872",
		label: "tourist office",
		datatype: "WikibaseItem"
	},
	{
		property: "P2873",
		label: "time in space",
		datatype: "Quantity"
	},
	{
		property: "P2874",
		label: "PubChem BioAssay ID (AID)",
		datatype: "ExternalId"
	},
	{
		property: "P2875",
		label: "property usage tracking category",
		datatype: "WikibaseItem"
	},
	{
		property: "P2876",
		label: "type of unit for this property",
		datatype: "WikibaseItem"
	},
	{
		property: "P2877",
		label: "SureChEMBL ID",
		datatype: "ExternalId"
	},
	{
		property: "P2878",
		label: "Minitel code",
		datatype: "ExternalId"
	},
	{
		property: "P2879",
		label: "Library of the National Congress of Argentina ID",
		datatype: "ExternalId"
	},
	{
		property: "P2880",
		label: "NIOSHTIC-2 ID",
		datatype: "ExternalId"
	},
	{
		property: "P2881",
		label: "promoted",
		datatype: "WikibaseItem"
	},
	{
		property: "P2882",
		label: "relegated",
		datatype: "WikibaseItem"
	},
	{
		property: "P2883",
		label: "HKMDb film ID",
		datatype: "ExternalId"
	},
	{
		property: "P2884",
		label: "mains voltage",
		datatype: "Quantity"
	},
	{
		property: "P2886",
		label: "Shakeosphere person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2887",
		label: "reserve number (Canada)",
		datatype: "ExternalId"
	},
	{
		property: "P2888",
		label: "exact match",
		datatype: "Url"
	},
	{
		property: "P2889",
		label: "FamilySearch person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2892",
		label: "UMLS CUI",
		datatype: "ExternalId"
	},
	{
		property: "P2893",
		label: "Skype username",
		datatype: "String"
	},
	{
		property: "P2894",
		label: "day of week",
		datatype: "WikibaseItem"
	},
	{
		property: "P2895",
		label: "maximum sustained winds",
		datatype: "Quantity"
	},
	{
		property: "P2896",
		label: "publication interval",
		datatype: "Quantity"
	},
	{
		property: "P2897",
		label: "Eldoblaje Movie ID",
		datatype: "ExternalId"
	},
	{
		property: "P2898",
		label: "Swedish county letter",
		datatype: "ExternalId"
	},
	{
		property: "P2899",
		label: "minimum age",
		datatype: "Quantity"
	},
	{
		property: "P2900",
		label: "fax number",
		datatype: "String"
	},
	{
		property: "P2903",
		label: "Molendatabase verdwenen molens ID",
		datatype: "ExternalId"
	},
	{
		property: "P2904",
		label: "Beer Advocate brewery ID",
		datatype: "ExternalId"
	},
	{
		property: "P2905",
		label: "RateBeer brewery ID",
		datatype: "ExternalId"
	},
	{
		property: "P2907",
		label: "timezone offset",
		datatype: "Quantity"
	},
	{
		property: "P2908",
		label: "SecondHandSongs song ID",
		datatype: "ExternalId"
	},
	{
		property: "P2909",
		label: "SecondHandSongs artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P2910",
		label: "icon",
		datatype: "CommonsMedia"
	},
	{
		property: "P2911",
		label: "time gap",
		datatype: "Quantity"
	},
	{
		property: "P2912",
		label: "distinctive jersey",
		datatype: "WikibaseItem"
	},
	{
		property: "P2913",
		label: "date depicted",
		datatype: "Time"
	},
	{
		property: "P2914",
		label: "MSBI person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2915",
		label: "ECARTICO person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2916",
		label: "syntax clarification",
		datatype: "Monolingualtext"
	},
	{
		property: "P2917",
		label: "COAM ID",
		datatype: "ExternalId"
	},
	{
		property: "P2918",
		label: "PO Box",
		datatype: "String"
	},
	{
		property: "P2919",
		label: "label in sign language",
		datatype: "CommonsMedia"
	},
	{
		property: "P2922",
		label: "month of the year",
		datatype: "WikibaseItem"
	},
	{
		property: "P2923",
		label: "focal height",
		datatype: "Quantity"
	},
	{
		property: "P2924",
		label: "Great Russian Encyclopedia Online ID",
		datatype: "ExternalId"
	},
	{
		property: "P2925",
		label: "domain of saint or deity",
		datatype: "WikibaseItem"
	},
	{
		property: "P2926",
		label: "InterPro ID",
		datatype: "ExternalId"
	},
	{
		property: "P2927",
		label: "water as percent of area",
		datatype: "Quantity"
	},
	{
		property: "P2928",
		label: "memory capacity",
		datatype: "Quantity"
	},
	{
		property: "P2929",
		label: "lighthouse range",
		datatype: "Quantity"
	},
	{
		property: "P2930",
		label: "INSPIRE-HEP author ID",
		datatype: "ExternalId"
	},
	{
		property: "P2931",
		label: "Encyclopedia of Triangle Centers identifier",
		datatype: "ExternalId"
	},
	{
		property: "P2935",
		label: "connector",
		datatype: "WikibaseItem"
	},
	{
		property: "P2936",
		label: "language used",
		datatype: "WikibaseItem"
	},
	{
		property: "P2937",
		label: "parliamentary term",
		datatype: "WikibaseItem"
	},
	{
		property: "P2938",
		label: "Pleiades place type identifier",
		datatype: "ExternalId"
	},
	{
		property: "P2939",
		label: "CageMatch tag team ID",
		datatype: "ExternalId"
	},
	{
		property: "P2940",
		label: "Catalogus Professorum Rostochiensium ID",
		datatype: "ExternalId"
	},
	{
		property: "P2941",
		label: "Munk's Roll ID",
		datatype: "ExternalId"
	},
	{
		property: "P2942",
		label: "Dailymotion channel ID",
		datatype: "ExternalId"
	},
	{
		property: "P2943",
		label: "warheroes.ru ID",
		datatype: "ExternalId"
	},
	{
		property: "P2944",
		label: "Plarr ID",
		datatype: "ExternalId"
	},
	{
		property: "P2945",
		label: "British Book Trade Index ID",
		datatype: "ExternalId"
	},
	{
		property: "P2946",
		label: "BacDive ID",
		datatype: "ExternalId"
	},
	{
		property: "P2948",
		label: "Estonian cultural monument ID",
		datatype: "ExternalId"
	},
	{
		property: "P2949",
		label: "WikiTree ID",
		datatype: "ExternalId"
	},
	{
		property: "P2950",
		label: "Nomisma ID",
		datatype: "ExternalId"
	},
	{
		property: "P2951",
		label: "Cultural heritage database in Austria ObjektID",
		datatype: "ExternalId"
	},
	{
		property: "P2952",
		label: "bateau d'intérêt patrimonial",
		datatype: "ExternalId"
	},
	{
		property: "P2953",
		label: "Estonian Research Portal person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2954",
		label: "Transferred Account Data Interchange Group Code",
		datatype: "ExternalId"
	},
	{
		property: "P2955",
		label: "point of penalty",
		datatype: "Quantity"
	},
	{
		property: "P2956",
		label: "NAIF ID",
		datatype: "ExternalId"
	},
	{
		property: "P2957",
		label: "throughput",
		datatype: "Quantity"
	},
	{
		property: "P2959",
		label: "permanent duplicated item",
		datatype: "WikibaseItem"
	},
	{
		property: "P2960",
		label: "archive date",
		datatype: "Time"
	},
	{
		property: "P2961",
		label: "BVPH ID",
		datatype: "ExternalId"
	},
	{
		property: "P2962",
		label: "title of chess player",
		datatype: "WikibaseItem"
	},
	{
		property: "P2963",
		label: "Goodreads author ID",
		datatype: "ExternalId"
	},
	{
		property: "P2964",
		label: "right to vote",
		datatype: "WikibaseItem"
	},
	{
		property: "P3491",
		label: "muscle insertion",
		datatype: "WikibaseItem"
	},
	{
		property: "P3492",
		label: "basic reproduction number",
		datatype: "Quantity"
	},
	{
		property: "P3493",
		label: "legal status (medicine)",
		datatype: "WikibaseItem"
	},
	{
		property: "P3494",
		label: "points classification",
		datatype: "WikibaseItem"
	},
	{
		property: "P3495",
		label: "FilmPolski.pl ID",
		datatype: "ExternalId"
	},
	{
		property: "P3496",
		label: "teams classification by points",
		datatype: "WikibaseItem"
	},
	{
		property: "P3497",
		label: "teams classification by time",
		datatype: "WikibaseItem"
	},
	{
		property: "P3498",
		label: "ZNIEFF ID",
		datatype: "ExternalId"
	},
	{
		property: "P3499",
		label: "Gentoo package",
		datatype: "ExternalId"
	},
	{
		property: "P3500",
		label: "Ringgold ID",
		datatype: "ExternalId"
	},
	{
		property: "P3501",
		label: "Catholic rite",
		datatype: "WikibaseItem"
	},
	{
		property: "P3502",
		label: "Ameblo username",
		datatype: "ExternalId"
	},
	{
		property: "P3503",
		label: "LombardiaBeniCulturali building ID",
		datatype: "ExternalId"
	},
	{
		property: "P3504",
		label: "Florentine Inventario Palatina art ID",
		datatype: "ExternalId"
	},
	{
		property: "P3505",
		label: "BoardGameGeek designer ID",
		datatype: "ExternalId"
	},
	{
		property: "P3506",
		label: "Luding designer ID",
		datatype: "ExternalId"
	},
	{
		property: "P3507",
		label: "Bivouac.com mountain ID",
		datatype: "ExternalId"
	},
	{
		property: "P3509",
		label: "Dagens Nyheter topic ID",
		datatype: "ExternalId"
	},
	{
		property: "P3511",
		label: "VGMDb label ID",
		datatype: "ExternalId"
	},
	{
		property: "P3512",
		label: "means of locomotion",
		datatype: "WikibaseItem"
	},
	{
		property: "P3513",
		label: "peakware mountain ID",
		datatype: "ExternalId"
	},
	{
		property: "P3514",
		label: "U.S. National Geodetic Survey ID",
		datatype: "ExternalId"
	},
	{
		property: "P3515",
		label: "NPCA ID",
		datatype: "ExternalId"
	},
	{
		property: "P3516",
		label: "National Park Foundation ID",
		datatype: "ExternalId"
	},
	{
		property: "P3517",
		label: "Geographical Names Board of New South Wales ID",
		datatype: "ExternalId"
	},
	{
		property: "P3518",
		label: "Smithsonian trinomial",
		datatype: "ExternalId"
	},
	{
		property: "P3519",
		label: "Pfam ID",
		datatype: "ExternalId"
	},
	{
		property: "P3520",
		label: "databaseOlympics.com athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3521",
		label: "EuroTour golf player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3522",
		label: "NHL.com player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3523",
		label: "Rfam ID",
		datatype: "ExternalId"
	},
	{
		property: "P3524",
		label: "Simple Modular Architecture Research Tool ID",
		datatype: "ExternalId"
	},
	{
		property: "P3525",
		label: "acb.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P3526",
		label: "wisdenindia.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P3527",
		label: "eurobasket.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P3528",
		label: "Luding game ID",
		datatype: "ExternalId"
	},
	{
		property: "P3529",
		label: "median income",
		datatype: "Quantity"
	},
	{
		property: "P3530",
		label: "par",
		datatype: "Quantity"
	},
	{
		property: "P3531",
		label: "AZBilliards ID",
		datatype: "ExternalId"
	},
	{
		property: "P3532",
		label: "databaseFootball.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P3533",
		label: "draftexpress.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P3534",
		label: "Australian Government Organisations Register ID",
		datatype: "ExternalId"
	},
	{
		property: "P3535",
		label: "JapanTour golf player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3536",
		label: "euroleague.net ID",
		datatype: "ExternalId"
	},
	{
		property: "P3537",
		label: "FootballDatabase.eu ID",
		datatype: "ExternalId"
	},
	{
		property: "P3538",
		label: "fussballdaten.de ID",
		datatype: "ExternalId"
	},
	{
		property: "P3539",
		label: "NFL.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P3541",
		label: "MLB ID",
		datatype: "ExternalId"
	},
	{
		property: "P3542",
		label: "FIBA player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3544",
		label: "Te Papa artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P3545",
		label: "Theoi Project ID",
		datatype: "ExternalId"
	},
	{
		property: "P3546",
		label: "AustralianFootball.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P3547",
		label: "AFL Tables ID",
		datatype: "ExternalId"
	},
	{
		property: "P3548",
		label: "Australian Business Number",
		datatype: "ExternalId"
	},
	{
		property: "P3549",
		label: "Australian Company Number",
		datatype: "ExternalId"
	},
	{
		property: "P3550",
		label: "Australian Register of Therapeutic Goods ID",
		datatype: "ExternalId"
	},
	{
		property: "P3551",
		label: "Australian Registered Body Number",
		datatype: "ExternalId"
	},
	{
		property: "P3552",
		label: "Australian Registered Scheme Number",
		datatype: "ExternalId"
	},
	{
		property: "P3553",
		label: "Zhihu topic ID",
		datatype: "ExternalId"
	},
	{
		property: "P3554",
		label: "World Series of Poker ID",
		datatype: "ExternalId"
	},
	{
		property: "P3555",
		label: "World Guide to Covered Bridges ID",
		datatype: "ExternalId"
	},
	{
		property: "P3556",
		label: "World Curling Tour ID",
		datatype: "ExternalId"
	},
	{
		property: "P3557",
		label: "World Curling Federation ID",
		datatype: "ExternalId"
	},
	{
		property: "P3558",
		label: "USCF ID",
		datatype: "ExternalId"
	},
	{
		property: "P3559",
		label: "maximum size or capacity",
		datatype: "Quantity"
	},
	{
		property: "P3560",
		label: "College Football Data Warehouse ID",
		datatype: "ExternalId"
	},
	{
		property: "P3561",
		label: "pro-football-reference ID",
		datatype: "ExternalId"
	},
	{
		property: "P3562",
		label: "Admiralty number",
		datatype: "ExternalId"
	},
	{
		property: "P3563",
		label: "NGA Lighthouse ID",
		datatype: "ExternalId"
	},
	{
		property: "P3564",
		label: "Global Poker Index ID",
		datatype: "ExternalId"
	},
	{
		property: "P3565",
		label: "J.League player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3566",
		label: "Just Sports Stats ID",
		datatype: "ExternalId"
	},
	{
		property: "P3567",
		label: "HHOF.com NHL player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3568",
		label: "OWGR ID",
		datatype: "ExternalId"
	},
	{
		property: "P3569",
		label: "Cultureel Woordenboek identifier",
		datatype: "ExternalId"
	},
	{
		property: "P3570",
		label: "European Case Law id",
		datatype: "ExternalId"
	},
	{
		property: "P3571",
		label: "ESPN.com MLB player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3572",
		label: "ESPNcricinfo playing ground ID",
		datatype: "ExternalId"
	},
	{
		property: "P3573",
		label: "European Handball Federation ID",
		datatype: "ExternalId"
	},
	{
		property: "P3574",
		label: "Fangraphs ID",
		datatype: "ExternalId"
	},
	{
		property: "P3575",
		label: "data size",
		datatype: "Quantity"
	},
	{
		property: "P3576",
		label: "TLG author ID",
		datatype: "ExternalId"
	},
	{
		property: "P3577",
		label: "Croatian Football Federation player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3578",
		label: "autologous cell line",
		datatype: "WikibaseItem"
	},
	{
		property: "P3579",
		label: "Sina Weibo ID",
		datatype: "ExternalId"
	},
	{
		property: "P3580",
		label: "SIPCA code",
		datatype: "ExternalId"
	},
	{
		property: "P3581",
		label: "Pro Football Hall of Fame ID",
		datatype: "ExternalId"
	},
	{
		property: "P3582",
		label: "SunshineTour ID",
		datatype: "ExternalId"
	},
	{
		property: "P3583",
		label: "Surfline ID",
		datatype: "ExternalId"
	},
	{
		property: "P3584",
		label: "ITRA runner ID",
		datatype: "ExternalId"
	},
	{
		property: "P3585",
		label: "UltraSignup runner ID",
		datatype: "ExternalId"
	},
	{
		property: "P3586",
		label: "CricketArchive playing ground ID",
		datatype: "ExternalId"
	},
	{
		property: "P3587",
		label: "Common Vulnerabilities and Exposures ID",
		datatype: "ExternalId"
	},
	{
		property: "P3588",
		label: "WNBA player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3589",
		label: "GCD series ID",
		datatype: "ExternalId"
	},
	{
		property: "P3590",
		label: "Relations Ontology ID",
		datatype: "ExternalId"
	},
	{
		property: "P3591",
		label: "World Checklist of Selected Plant Families ID",
		datatype: "ExternalId"
	},
	{
		property: "P3592",
		label: "Saros cycle of eclipse",
		datatype: "WikibaseItem"
	},
	{
		property: "P3593",
		label: "AFI Catalog of Feature Films ID",
		datatype: "ExternalId"
	},
	{
		property: "P3594",
		label: "Araneae Spider ID",
		datatype: "ExternalId"
	},
	{
		property: "P2965",
		label: "EU River Basin District code",
		datatype: "ExternalId"
	},
	{
		property: "P2966",
		label: "National Library of Wales ID",
		datatype: "ExternalId"
	},
	{
		property: "P2967",
		label: "Queensland Heritage Register ID",
		datatype: "ExternalId"
	},
	{
		property: "P2968",
		label: "QUDT unit ID",
		datatype: "ExternalId"
	},
	{
		property: "P2969",
		label: "Goodreads book ID",
		datatype: "ExternalId"
	},
	{
		property: "P2970",
		label: "Kinopolis film ID",
		datatype: "ExternalId"
	},
	{
		property: "P2971",
		label: "GCatholic church ID",
		datatype: "ExternalId"
	},
	{
		property: "P2972",
		label: "SNAP ID",
		datatype: "ExternalId"
	},
	{
		property: "P2973",
		label: "Spenserians person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2974",
		label: "habitat",
		datatype: "WikibaseItem"
	},
	{
		property: "P2975",
		label: "host",
		datatype: "WikibaseItem"
	},
	{
		property: "P2976",
		label: "patronym or matronym",
		datatype: "WikibaseItem"
	},
	{
		property: "P2977",
		label: "LBT person ID",
		datatype: "ExternalId"
	},
	{
		property: "P2978",
		label: "wheel arrangement",
		datatype: "WikibaseItem"
	},
	{
		property: "P2979",
		label: "maritime identification digits",
		datatype: "String"
	},
	{
		property: "P2980",
		label: "ARLHS Lighthouse ID",
		datatype: "ExternalId"
	},
	{
		property: "P2981",
		label: "UIC alphabetical country code",
		datatype: "ExternalId"
	},
	{
		property: "P2982",
		label: "UIC numerical country code",
		datatype: "ExternalId"
	},
	{
		property: "P2983",
		label: "UNDP country code",
		datatype: "ExternalId"
	},
	{
		property: "P2984",
		label: "Snapchat username",
		datatype: "ExternalId"
	},
	{
		property: "P2985",
		label: "DSBE ID",
		datatype: "ExternalId"
	},
	{
		property: "P2986",
		label: "aircraft registration prefix",
		datatype: "ExternalId"
	},
	{
		property: "P2987",
		label: "Taekwondo Data ID",
		datatype: "ExternalId"
	},
	{
		property: "P2988",
		label: "GOST 7.67 cyrillic",
		datatype: "ExternalId"
	},
	{
		property: "P2989",
		label: "has grammatical case",
		datatype: "WikibaseItem"
	},
	{
		property: "P2990",
		label: "FIL ID",
		datatype: "ExternalId"
	},
	{
		property: "P2991",
		label: "IBSF ID",
		datatype: "ExternalId"
	},
	{
		property: "P2992",
		label: "software quality assurance",
		datatype: "WikibaseItem"
	},
	{
		property: "P2993",
		label: "partition coefficient water/octanol",
		datatype: "Quantity"
	},
	{
		property: "P2997",
		label: "age of majority",
		datatype: "Quantity"
	},
	{
		property: "P2998",
		label: "age of candidacy",
		datatype: "Quantity"
	},
	{
		property: "P2999",
		label: "age of consent",
		datatype: "Quantity"
	},
	{
		property: "P3000",
		label: "marriageable age",
		datatype: "Quantity"
	},
	{
		property: "P3001",
		label: "retirement age",
		datatype: "Quantity"
	},
	{
		property: "P3002",
		label: "Untappd brewery ID",
		datatype: "ExternalId"
	},
	{
		property: "P3003",
		label: "zanikleobce.cz abandoned objects ID",
		datatype: "ExternalId"
	},
	{
		property: "P3004",
		label: "Galiciana work ID",
		datatype: "ExternalId"
	},
	{
		property: "P3005",
		label: "valid in place",
		datatype: "WikibaseItem"
	},
	{
		property: "P3006",
		label: "Marine Regions Geographic ID",
		datatype: "ExternalId"
	},
	{
		property: "P3007",
		label: "Cadw Monument ID",
		datatype: "ExternalId"
	},
	{
		property: "P3008",
		label: "Australian Heritage Database Place ID",
		datatype: "ExternalId"
	},
	{
		property: "P3009",
		label: "Conservatoire du littoral ID",
		datatype: "ExternalId"
	},
	{
		property: "P3010",
		label: "World Archery athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3012",
		label: "Standard Geographical Classification code",
		datatype: "ExternalId"
	},
	{
		property: "P3013",
		label: "surface tension",
		datatype: "Quantity"
	},
	{
		property: "P3014",
		label: "laws applied",
		datatype: "WikibaseItem"
	},
	{
		property: "P3015",
		label: "backup or reserve team or crew",
		datatype: "WikibaseItem"
	},
	{
		property: "P3016",
		label: "French national research structure identifier",
		datatype: "ExternalId"
	},
	{
		property: "P3017",
		label: "Rolling Stone artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P3018",
		label: "located in protected area",
		datatype: "WikibaseItem"
	},
	{
		property: "P3019",
		label: "railway signalling system",
		datatype: "WikibaseItem"
	},
	{
		property: "P3020",
		label: "residence time of water",
		datatype: "Quantity"
	},
	{
		property: "P3021",
		label: "Iranica ID",
		datatype: "ExternalId"
	},
	{
		property: "P3022",
		label: "flag bearer",
		datatype: "WikibaseItem"
	},
	{
		property: "P3023",
		label: "Legacies of British Slave-ownership person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3024",
		label: "ITU letter code",
		datatype: "ExternalId"
	},
	{
		property: "P3025",
		label: "open days",
		datatype: "WikibaseItem"
	},
	{
		property: "P3026",
		label: "closed on",
		datatype: "WikibaseItem"
	},
	{
		property: "P3027",
		label: "open period from",
		datatype: "WikibaseItem"
	},
	{
		property: "P3028",
		label: "open period to",
		datatype: "WikibaseItem"
	},
	{
		property: "P3029",
		label: "UK National Archives ID",
		datatype: "ExternalId"
	},
	{
		property: "P3030",
		label: "sheet music",
		datatype: "CommonsMedia"
	},
	{
		property: "P3031",
		label: "EPPO Code",
		datatype: "ExternalId"
	},
	{
		property: "P3032",
		label: "adjacent building",
		datatype: "WikibaseItem"
	},
	{
		property: "P3033",
		label: "package management system",
		datatype: "WikibaseItem"
	},
	{
		property: "P3034",
		label: "Indonesian ethnicity code",
		datatype: "ExternalId"
	},
	{
		property: "P3035",
		label: "ISBN publisher prefix",
		datatype: "ExternalId"
	},
	{
		property: "P3036",
		label: "precipitation height",
		datatype: "Quantity"
	},
	{
		property: "P3037",
		label: "spatial reference system",
		datatype: "WikibaseItem"
	},
	{
		property: "P3038",
		label: "IWM memorial ID",
		datatype: "ExternalId"
	},
	{
		property: "P3039",
		label: "wheelbase",
		datatype: "Quantity"
	},
	{
		property: "P3040",
		label: "SoundCloud ID",
		datatype: "ExternalId"
	},
	{
		property: "P3041",
		label: "luminous intensity",
		datatype: "Quantity"
	},
	{
		property: "P3042",
		label: "CageMatch wrestling stable id",
		datatype: "ExternalId"
	},
	{
		property: "P3043",
		label: "Scoresway soccer person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3044",
		label: "College Football HoF ID",
		datatype: "ExternalId"
	},
	{
		property: "P3045",
		label: "HanCinema person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3046",
		label: "ForaDeJogo player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3047",
		label: "TheFinalBall player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3048",
		label: "racing-reference driver ID",
		datatype: "ExternalId"
	},
	{
		property: "P3049",
		label: "Scottish Football Association player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3050",
		label: "FACR player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3051",
		label: "Kindred Britain ID",
		datatype: "ExternalId"
	},
	{
		property: "P3052",
		label: "Bloomberg person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3053",
		label: "K League player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3054",
		label: "Ontario MPP ID",
		datatype: "ExternalId"
	},
	{
		property: "P3055",
		label: "NAQ elected person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3056",
		label: "Turner Classic Movies person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3057",
		label: "Charity Commission no.",
		datatype: "ExternalId"
	},
	{
		property: "P3058",
		label: "Architectuurgids architect ID",
		datatype: "ExternalId"
	},
	{
		property: "P3059",
		label: "Architectuurgids building ID",
		datatype: "ExternalId"
	},
	{
		property: "P3060",
		label: "ButMoth ID",
		datatype: "ExternalId"
	},
	{
		property: "P3061",
		label: "Basisregistratie Instellingen number",
		datatype: "ExternalId"
	},
	{
		property: "P3063",
		label: "gestation period",
		datatype: "Quantity"
	},
	{
		property: "P3064",
		label: "LepIndex ID",
		datatype: "ExternalId"
	},
	{
		property: "P3065",
		label: "RERO ID",
		datatype: "ExternalId"
	},
	{
		property: "P3066",
		label: "GLAM Identifier",
		datatype: "ExternalId"
	},
	{
		property: "P3067",
		label: "GS1 country code",
		datatype: "String"
	},
	{
		property: "P3068",
		label: "WIPO ST.3",
		datatype: "ExternalId"
	},
	{
		property: "P3069",
		label: "UN document symbol",
		datatype: "ExternalId"
	},
	{
		property: "P1056",
		label: "product or material produced",
		datatype: "WikibaseItem"
	},
	{
		property: "P1057",
		label: "chromosome",
		datatype: "WikibaseItem"
	},
	{
		property: "P1058",
		label: "ERA Journal ID",
		datatype: "ExternalId"
	},
	{
		property: "P1059",
		label: "CVR number",
		datatype: "ExternalId"
	},
	{
		property: "P1060",
		label: "pathogen transmission process",
		datatype: "WikibaseItem"
	},
	{
		property: "P1064",
		label: "track gauge",
		datatype: "WikibaseItem"
	},
	{
		property: "P1065",
		label: "archive URL",
		datatype: "Url"
	},
	{
		property: "P1066",
		label: "student of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1067",
		label: "Thailand central administrative unit code",
		datatype: "ExternalId"
	},
	{
		property: "P1068",
		label: "instruction set",
		datatype: "WikibaseItem"
	},
	{
		property: "P1069",
		label: "Statistics Denmarks classification of occupation (DISCO-08)",
		datatype: "ExternalId"
	},
	{
		property: "P1070",
		label: "PlantList-ID",
		datatype: "ExternalId"
	},
	{
		property: "P1071",
		label: "location of final assembly",
		datatype: "WikibaseItem"
	},
	{
		property: "P1072",
		label: "readable file format",
		datatype: "WikibaseItem"
	},
	{
		property: "P1073",
		label: "writable file format",
		datatype: "WikibaseItem"
	},
	{
		property: "P1074",
		label: "fictional analog of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1075",
		label: "rector",
		datatype: "WikibaseItem"
	},
	{
		property: "P1076",
		label: "ICTV virus ID",
		datatype: "ExternalId"
	},
	{
		property: "P1077",
		label: "KOATUU identifier",
		datatype: "String"
	},
	{
		property: "P1078",
		label: "valvetrain configuration",
		datatype: "WikibaseItem"
	},
	{
		property: "P1079",
		label: "launch contractor",
		datatype: "WikibaseItem"
	},
	{
		property: "P1080",
		label: "from fictional universe",
		datatype: "WikibaseItem"
	},
	{
		property: "P1081",
		label: "Human Development Index",
		datatype: "Quantity"
	},
	{
		property: "P1082",
		label: "population",
		datatype: "Quantity"
	},
	{
		property: "P1083",
		label: "maximum capacity",
		datatype: "Quantity"
	},
	{
		property: "P1084",
		label: "EUL editions",
		datatype: "ExternalId"
	},
	{
		property: "P1085",
		label: "LibraryThing work ID",
		datatype: "ExternalId"
	},
	{
		property: "P1086",
		label: "atomic number",
		datatype: "Quantity"
	},
	{
		property: "P1087",
		label: "Elo rating",
		datatype: "Quantity"
	},
	{
		property: "P1088",
		label: "Mohs' hardness",
		datatype: "Quantity"
	},
	{
		property: "P1090",
		label: "redshift",
		datatype: "Quantity"
	},
	{
		property: "P1092",
		label: "total produced",
		datatype: "Quantity"
	},
	{
		property: "P1093",
		label: "gross tonnage",
		datatype: "Quantity"
	},
	{
		property: "P1096",
		label: "orbital eccentricity",
		datatype: "Quantity"
	},
	{
		property: "P1097",
		label: "g-factor",
		datatype: "Quantity"
	},
	{
		property: "P1098",
		label: "number of speakers",
		datatype: "Quantity"
	},
	{
		property: "P1099",
		label: "number of masts",
		datatype: "Quantity"
	},
	{
		property: "P1100",
		label: "number of cylinders",
		datatype: "Quantity"
	},
	{
		property: "P1101",
		label: "floors above ground",
		datatype: "Quantity"
	},
	{
		property: "P1102",
		label: "flattening",
		datatype: "Quantity"
	},
	{
		property: "P1103",
		label: "number of platform tracks",
		datatype: "Quantity"
	},
	{
		property: "P1104",
		label: "number of pages",
		datatype: "Quantity"
	},
	{
		property: "P1106",
		label: "Sandbox-Quantity",
		datatype: "Quantity"
	},
	{
		property: "P1107",
		label: "proportion",
		datatype: "Quantity"
	},
	{
		property: "P1108",
		label: "electronegativity",
		datatype: "Quantity"
	},
	{
		property: "P1109",
		label: "refractive index",
		datatype: "Quantity"
	},
	{
		property: "P1110",
		label: "attendance",
		datatype: "Quantity"
	},
	{
		property: "P1111",
		label: "votes received",
		datatype: "Quantity"
	},
	{
		property: "P1112",
		label: "Pokédex number",
		datatype: "Quantity"
	},
	{
		property: "P1113",
		label: "number of episodes",
		datatype: "Quantity"
	},
	{
		property: "P1114",
		label: "quantity",
		datatype: "Quantity"
	},
	{
		property: "P1115",
		label: "ATVK ID",
		datatype: "ExternalId"
	},
	{
		property: "P1116",
		label: "ELSTAT geographical code",
		datatype: "ExternalId"
	},
	{
		property: "P1117",
		label: "pKa",
		datatype: "Quantity"
	},
	{
		property: "P1120",
		label: "number of deaths",
		datatype: "Quantity"
	},
	{
		property: "P1121",
		label: "oxidation state",
		datatype: "Quantity"
	},
	{
		property: "P1122",
		label: "spin quantum number",
		datatype: "Quantity"
	},
	{
		property: "P1123",
		label: "parity",
		datatype: "Quantity"
	},
	{
		property: "P1124",
		label: "TEU",
		datatype: "Quantity"
	},
	{
		property: "P1125",
		label: "Gini coefficient",
		datatype: "Quantity"
	},
	{
		property: "P1126",
		label: "isospin quantum number",
		datatype: "Quantity"
	},
	{
		property: "P1127",
		label: "isospin z-component",
		datatype: "Quantity"
	},
	{
		property: "P1128",
		label: "employees",
		datatype: "Quantity"
	},
	{
		property: "P1129",
		label: "national team caps",
		datatype: "Quantity"
	},
	{
		property: "P1132",
		label: "number of participants",
		datatype: "Quantity"
	},
	{
		property: "P1133",
		label: "DGO4 identifier",
		datatype: "ExternalId"
	},
	{
		property: "P1135",
		label: "nomenclatural status",
		datatype: "WikibaseItem"
	},
	{
		property: "P1136",
		label: "solved by",
		datatype: "WikibaseItem"
	},
	{
		property: "P1137",
		label: "fossil found in this unit",
		datatype: "WikibaseItem"
	},
	{
		property: "P1138",
		label: "Kunstindeks Danmark Artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P1139",
		label: "floors below ground",
		datatype: "Quantity"
	},
	{
		property: "P1140",
		label: "EHAK id",
		datatype: "ExternalId"
	},
	{
		property: "P1141",
		label: "number of processor cores",
		datatype: "Quantity"
	},
	{
		property: "P1142",
		label: "political ideology",
		datatype: "WikibaseItem"
	},
	{
		property: "P1143",
		label: "BN (Argentine) editions",
		datatype: "ExternalId"
	},
	{
		property: "P1144",
		label: "LCOC LCCN (bibliographic)",
		datatype: "ExternalId"
	},
	{
		property: "P1145",
		label: "Lagrangian point",
		datatype: "WikibaseItem"
	},
	{
		property: "P1146",
		label: "IAAF ID",
		datatype: "ExternalId"
	},
	{
		property: "P1148",
		label: "neutron number",
		datatype: "Quantity"
	},
	{
		property: "P1149",
		label: "Library of Congress Classification",
		datatype: "String"
	},
	{
		property: "P1150",
		label: "Regensburg Classification",
		datatype: "String"
	},
	{
		property: "P1151",
		label: "topic's main Wikimedia portal",
		datatype: "WikibaseItem"
	},
	{
		property: "P1153",
		label: "Scopus Author ID",
		datatype: "ExternalId"
	},
	{
		property: "P1154",
		label: "Scopus EID",
		datatype: "ExternalId"
	},
	{
		property: "P1155",
		label: "Scopus Affiliation ID",
		datatype: "ExternalId"
	},
	{
		property: "P1156",
		label: "Scopus Source ID",
		datatype: "ExternalId"
	},
	{
		property: "P1157",
		label: "US Congress Bio ID",
		datatype: "ExternalId"
	},
	{
		property: "P1158",
		label: "location of landing",
		datatype: "WikibaseItem"
	},
	{
		property: "P1159",
		label: "CODEN",
		datatype: "ExternalId"
	},
	{
		property: "P1160",
		label: "ISO 4 abbreviation",
		datatype: "ExternalId"
	},
	{
		property: "P1161",
		label: "Z39.5 abbreviation",
		datatype: "String"
	},
	{
		property: "P1162",
		label: "Bluebook abbreviation",
		datatype: "String"
	},
	{
		property: "P1163",
		label: "media type",
		datatype: "String"
	},
	{
		property: "P1164",
		label: "cardinality of the group",
		datatype: "Quantity"
	},
	{
		property: "P1165",
		label: "home world",
		datatype: "WikibaseItem"
	},
	{
		property: "P1167",
		label: "USB ID",
		datatype: "ExternalId"
	},
	{
		property: "P1168",
		label: "municipality code (Denmark)",
		datatype: "ExternalId"
	},
	{
		property: "P1170",
		label: "transmitted signal type",
		datatype: "WikibaseItem"
	},
	{
		property: "P1171",
		label: "approximation algorithm",
		datatype: "WikibaseItem"
	},
	{
		property: "P1172",
		label: "Geokod",
		datatype: "ExternalId"
	},
	{
		property: "P3595",
		label: "BLF article ID",
		datatype: "ExternalId"
	},
	{
		property: "P3596",
		label: "Danish ancient monument ID",
		datatype: "ExternalId"
	},
	{
		property: "P3597",
		label: "F-Droid package",
		datatype: "ExternalId"
	},
	{
		property: "P3598",
		label: "Hockey-reference player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3599",
		label: "archival creator authority record at the Archives nationales",
		datatype: "ExternalId"
	},
	{
		property: "P3600",
		label: "protected heritage site in Brussels ID",
		datatype: "ExternalId"
	},
	{
		property: "P3601",
		label: "MarineTraffic Lighthouse ID",
		datatype: "ExternalId"
	},
	{
		property: "P3602",
		label: "candidacy in election",
		datatype: "WikibaseItem"
	},
	{
		property: "P3603",
		label: "Minneapolis Institute of Art Constituent ID",
		datatype: "ExternalId"
	},
	{
		property: "P3604",
		label: "ITU triathlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3605",
		label: "90minut player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3606",
		label: "BOLD Systems taxon ID",
		datatype: "ExternalId"
	},
	{
		property: "P3607",
		label: "Booking.com hotel ID",
		datatype: "ExternalId"
	},
	{
		property: "P3608",
		label: "EU VAT number",
		datatype: "ExternalId"
	},
	{
		property: "P3609",
		label: "Recreation.gov area ID",
		datatype: "ExternalId"
	},
	{
		property: "P3610",
		label: "fare zone",
		datatype: "WikibaseItem"
	},
	{
		property: "P3611",
		label: "Borden Code",
		datatype: "ExternalId"
	},
	{
		property: "P3612",
		label: "Le Monde diplomatique subject ID",
		datatype: "ExternalId"
	},
	{
		property: "P3613",
		label: "Naturvårdsregistret ID",
		datatype: "ExternalId"
	},
	{
		property: "P3614",
		label: "DigDag ID",
		datatype: "ExternalId"
	},
	{
		property: "P3615",
		label: "Vision of Britain unit ID",
		datatype: "ExternalId"
	},
	{
		property: "P3616",
		label: "Vision of Britain place ID",
		datatype: "ExternalId"
	},
	{
		property: "P3618",
		label: "base salary",
		datatype: "Quantity"
	},
	{
		property: "P3619",
		label: "ski-db.com skier ID",
		datatype: "ExternalId"
	},
	{
		property: "P3620",
		label: "BWFbadminton.com player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3621",
		label: "Darts Database player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3622",
		label: "rusbandy player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3623",
		label: "BadmintonLink player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3624",
		label: "CWE ID",
		datatype: "ExternalId"
	},
	{
		property: "P3625",
		label: "Kirshenbaum",
		datatype: "String"
	},
	{
		property: "P3626",
		label: "Australian Antarctic Gazetteer ID",
		datatype: "ExternalId"
	},
	{
		property: "P3627",
		label: "Historical Gazetteer of England's Place Names ID",
		datatype: "ExternalId"
	},
	{
		property: "P3628",
		label: "British History Online VCH ID",
		datatype: "ExternalId"
	},
	{
		property: "P3629",
		label: "stated age at event",
		datatype: "Quantity"
	},
	{
		property: "P3630",
		label: "Babelio author ID",
		datatype: "ExternalId"
	},
	{
		property: "P3631",
		label: "Babelio work ID",
		datatype: "ExternalId"
	},
	{
		property: "P3632",
		label: "British Museum thesaurus ID",
		datatype: "ExternalId"
	},
	{
		property: "P3633",
		label: "British Museum place ID",
		datatype: "ExternalId"
	},
	{
		property: "P3634",
		label: "The Met object ID",
		datatype: "ExternalId"
	},
	{
		property: "P3635",
		label: "Peakbagger area ID",
		datatype: "ExternalId"
	},
	{
		property: "P3636",
		label: "PDB ligand ID",
		datatype: "ExternalId"
	},
	{
		property: "P3637",
		label: "European Medicines Agency product number",
		datatype: "ExternalId"
	},
	{
		property: "P3638",
		label: "Oorlogsmonument ID",
		datatype: "ExternalId"
	},
	{
		property: "P3639",
		label: "KEPN ID",
		datatype: "ExternalId"
	},
	{
		property: "P3640",
		label: "National Drug Code",
		datatype: "ExternalId"
	},
	{
		property: "P3641",
		label: "Uniform Type Identifier",
		datatype: "ExternalId"
	},
	{
		property: "P3642",
		label: "ARCHON code",
		datatype: "ExternalId"
	},
	{
		property: "P3643",
		label: "significant environmental impact",
		datatype: "WikibaseItem"
	},
	{
		property: "P3644",
		label: "FFR player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3645",
		label: "All Blacks player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3646",
		label: "Basketball Hall of Fame ID",
		datatype: "ExternalId"
	},
	{
		property: "P3647",
		label: "NBA player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3648",
		label: "NatureServe conservation status",
		datatype: "WikibaseItem"
	},
	{
		property: "P3650",
		label: "JMK film rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P3651",
		label: "American Hockey League player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3652",
		label: "Kontinental Hockey League player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3653",
		label: "ARRS runner ID",
		datatype: "ExternalId"
	},
	{
		property: "P3654",
		label: "Chess.com player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3655",
		label: "BDFutbol player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3656",
		label: "Cross-tables.com Scrabble player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3657",
		label: "Croatian Football Statistics ID",
		datatype: "ExternalId"
	},
	{
		property: "P3658",
		label: "DZFoot.com player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3659",
		label: "Estonian Football Association player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3660",
		label: "FootballFacts.ru player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3661",
		label: "ForaDeJogo manager ID",
		datatype: "ExternalId"
	},
	{
		property: "P3662",
		label: "Football Federation of Ukraine player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3663",
		label: "Fotbal DNES player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3664",
		label: "Futsal Planet player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3665",
		label: "L'Équipe football player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3666",
		label: "EPCR player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3667",
		label: "International Weightlifting Federation ID",
		datatype: "ExternalId"
	},
	{
		property: "P3668",
		label: "Sambafoot player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3669",
		label: "Swimming Australia swimmer ID",
		datatype: "ExternalId"
	},
	{
		property: "P3670",
		label: "Tennis Archives player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3671",
		label: "USA Gymnastics athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3672",
		label: "International Orienteering Federation athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3673",
		label: "film-documentaire.fr film ID",
		datatype: "ExternalId"
	},
	{
		property: "P3674",
		label: "Mutopia composer ID",
		datatype: "ExternalId"
	},
	{
		property: "P3675",
		label: "Hans Christian Andersen Centre work ID",
		datatype: "ExternalId"
	},
	{
		property: "P3676",
		label: "National Bridge Inventory Number",
		datatype: "ExternalId"
	},
	{
		property: "P3677",
		label: "Wereld van Oranje player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3678",
		label: "SA Rugby player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3679",
		label: "stock market index",
		datatype: "WikibaseItem"
	},
	{
		property: "P3680",
		label: "statement supported by",
		datatype: "WikibaseItem"
	},
	{
		property: "P3681",
		label: "ESPNFC.com player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3682",
		label: "Australian Olympic Committee athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3683",
		label: "LFP player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3684",
		label: "DriverDB driver ID",
		datatype: "ExternalId"
	},
	{
		property: "P3685",
		label: "ESPN.com NBA player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3686",
		label: "ESPN.com NFL player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3687",
		label: "ESPN.com NHL player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3689",
		label: "ICF canoer ID",
		datatype: "ExternalId"
	},
	{
		property: "P3690",
		label: "IFSC climber ID",
		datatype: "ExternalId"
	},
	{
		property: "P3691",
		label: "ISHOF swimmer ID",
		datatype: "ExternalId"
	},
	{
		property: "P3692",
		label: "NCAA sports team ID",
		datatype: "ExternalId"
	},
	{
		property: "P3693",
		label: "ShorttrackOnLine speed skater ID",
		datatype: "ExternalId"
	},
	{
		property: "P3694",
		label: "SpeedSkatingNews.info speed skater ID",
		datatype: "ExternalId"
	},
	{
		property: "P3695",
		label: "SpeedSkatingStats speed skater ID",
		datatype: "ExternalId"
	},
	{
		property: "P3696",
		label: "SRCBB player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3697",
		label: "SRCFB player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3070",
		label: "dynamic viscosity",
		datatype: "Quantity"
	},
	{
		property: "P3071",
		label: "standard molar entropy",
		datatype: "Quantity"
	},
	{
		property: "P3072",
		label: "Storting person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3073",
		label: "CosIng number",
		datatype: "ExternalId"
	},
	{
		property: "P3074",
		label: "Grace's Guide ID",
		datatype: "ExternalId"
	},
	{
		property: "P3075",
		label: "official religion",
		datatype: "WikibaseItem"
	},
	{
		property: "P3076",
		label: "Open Beauty Facts category ID",
		datatype: "ExternalId"
	},
	{
		property: "P3077",
		label: "Cineplex film ID",
		datatype: "ExternalId"
	},
	{
		property: "P3078",
		label: "standard enthalpy of formation",
		datatype: "Quantity"
	},
	{
		property: "P3080",
		label: "game artist",
		datatype: "WikibaseItem"
	},
	{
		property: "P3081",
		label: "damaged",
		datatype: "WikibaseItem"
	},
	{
		property: "P3082",
		label: "destroyed",
		datatype: "WikibaseItem"
	},
	{
		property: "P3083",
		label: "SIMBAD ID",
		datatype: "ExternalId"
	},
	{
		property: "P3084",
		label: "freedom of panorama",
		datatype: "WikibaseItem"
	},
	{
		property: "P3085",
		label: "qualifies for event",
		datatype: "WikibaseItem"
	},
	{
		property: "P3086",
		label: "speed limit",
		datatype: "Quantity"
	},
	{
		property: "P3087",
		label: "fiscal/tax revenue",
		datatype: "Quantity"
	},
	{
		property: "P3088",
		label: "Catalogue of Life in Taiwan ID",
		datatype: "ExternalId"
	},
	{
		property: "P3089",
		label: "Flags of the World ID",
		datatype: "ExternalId"
	},
	{
		property: "P3090",
		label: "flight number",
		datatype: "String"
	},
	{
		property: "P3091",
		label: "mount",
		datatype: "WikibaseItem"
	},
	{
		property: "P3092",
		label: "film crew member",
		datatype: "WikibaseItem"
	},
	{
		property: "P3093",
		label: "recovered by",
		datatype: "WikibaseItem"
	},
	{
		property: "P3094",
		label: "develops from",
		datatype: "WikibaseItem"
	},
	{
		property: "P3095",
		label: "practiced by",
		datatype: "WikibaseItem"
	},
	{
		property: "P3096",
		label: "KML file",
		datatype: "WikibaseItem"
	},
	{
		property: "P3097",
		label: "ISBN identifier group",
		datatype: "ExternalId"
	},
	{
		property: "P3098",
		label: "ClinicalTrials.gov Identifier",
		datatype: "ExternalId"
	},
	{
		property: "P3099",
		label: "Internet Bird Collection species ID",
		datatype: "ExternalId"
	},
	{
		property: "P3100",
		label: "Flora of Australia ID",
		datatype: "ExternalId"
	},
	{
		property: "P3101",
		label: "FloraBase ID",
		datatype: "ExternalId"
	},
	{
		property: "P3102",
		label: "Plantarium ID",
		datatype: "ExternalId"
	},
	{
		property: "P3103",
		label: "has tense",
		datatype: "WikibaseItem"
	},
	{
		property: "P3104",
		label: "Gares & Connexions ID",
		datatype: "ExternalId"
	},
	{
		property: "P3105",
		label: "Tela Botanica ID",
		datatype: "ExternalId"
	},
	{
		property: "P3106",
		label: "Guardian topic ID",
		datatype: "ExternalId"
	},
	{
		property: "P3107",
		label: "LdiF ID",
		datatype: "ExternalId"
	},
	{
		property: "P3108",
		label: "Yelp ID",
		datatype: "ExternalId"
	},
	{
		property: "P3109",
		label: "Peakbagger mountain ID",
		datatype: "ExternalId"
	},
	{
		property: "P3110",
		label: "ISzDb film ID",
		datatype: "ExternalId"
	},
	{
		property: "P3111",
		label: "FEI ID",
		datatype: "ExternalId"
	},
	{
		property: "P3112",
		label: "DistroWatch ID",
		datatype: "ExternalId"
	},
	{
		property: "P3113",
		label: "does not have part",
		datatype: "WikibaseItem"
	},
	{
		property: "P3114",
		label: "ISzDb person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3115",
		label: "ISzDb company ID",
		datatype: "ExternalId"
	},
	{
		property: "P3116",
		label: "ISzDb dub ID",
		datatype: "ExternalId"
	},
	{
		property: "P3117",
		label: "DSSTOX substance identifier",
		datatype: "ExternalId"
	},
	{
		property: "P3118",
		label: "OpenDomesday settlement ID",
		datatype: "ExternalId"
	},
	{
		property: "P3119",
		label: "Code for China Reservoir Name",
		datatype: "ExternalId"
	},
	{
		property: "P3120",
		label: "TOID",
		datatype: "ExternalId"
	},
	{
		property: "P3121",
		label: "Epguides ID",
		datatype: "ExternalId"
	},
	{
		property: "P3122",
		label: "OpenDomesday person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3123",
		label: "Stanford Encyclopedia of Philosophy ID",
		datatype: "ExternalId"
	},
	{
		property: "P3124",
		label: "Polish scientist ID",
		datatype: "ExternalId"
	},
	{
		property: "P3125",
		label: "EDRPOU code",
		datatype: "ExternalId"
	},
	{
		property: "P3126",
		label: "ALCUIN ID",
		datatype: "ExternalId"
	},
	{
		property: "P3127",
		label: "Latindex ID",
		datatype: "ExternalId"
	},
	{
		property: "P3128",
		label: "CiNetMag film ID",
		datatype: "ExternalId"
	},
	{
		property: "P3129",
		label: "cine.gr film ID",
		datatype: "ExternalId"
	},
	{
		property: "P3130",
		label: "NSW Flora ID",
		datatype: "ExternalId"
	},
	{
		property: "P3131",
		label: "Redalyc journal ID",
		datatype: "ExternalId"
	},
	{
		property: "P3132",
		label: "last line",
		datatype: "Monolingualtext"
	},
	{
		property: "P3133",
		label: "NSZL name authority ID",
		datatype: "ExternalId"
	},
	{
		property: "P3134",
		label: "TripAdvisor ID",
		datatype: "ExternalId"
	},
	{
		property: "P3135",
		label: "elCinema film ID",
		datatype: "ExternalId"
	},
	{
		property: "P3136",
		label: "elCinema person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3137",
		label: "parent peak",
		datatype: "WikibaseItem"
	},
	{
		property: "P3138",
		label: "OFDb ID",
		datatype: "ExternalId"
	},
	{
		property: "P3139",
		label: "SourehCinema film ID",
		datatype: "ExternalId"
	},
	{
		property: "P3140",
		label: "SourehCinema person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3141",
		label: "EDb film ID",
		datatype: "ExternalId"
	},
	{
		property: "P3142",
		label: "EDb person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3143",
		label: "elFilm film ID",
		datatype: "ExternalId"
	},
	{
		property: "P3144",
		label: "elFilm person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3145",
		label: "Sratim ID",
		datatype: "ExternalId"
	},
	{
		property: "P3146",
		label: "CiNetMag person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3147",
		label: "United States Reports ID",
		datatype: "ExternalId"
	},
	{
		property: "P3148",
		label: "repeals",
		datatype: "WikibaseItem"
	},
	{
		property: "P3149",
		label: "molecule conformation",
		datatype: "WikibaseItem"
	},
	{
		property: "P3150",
		label: "birthday",
		datatype: "WikibaseItem"
	},
	{
		property: "P3151",
		label: "iNaturalist taxon ID",
		datatype: "ExternalId"
	},
	{
		property: "P3152",
		label: "Findsmiley ID",
		datatype: "ExternalId"
	},
	{
		property: "P3153",
		label: "Crossref funder ID",
		datatype: "ExternalId"
	},
	{
		property: "P3154",
		label: "Runeberg author ID",
		datatype: "ExternalId"
	},
	{
		property: "P3155",
		label: "Runeberg book ID",
		datatype: "ExternalId"
	},
	{
		property: "P3156",
		label: "Australian Classification",
		datatype: "WikibaseItem"
	},
	{
		property: "P3157",
		label: "event distance",
		datatype: "Quantity"
	},
	{
		property: "P3158",
		label: "enclosure",
		datatype: "WikibaseItem"
	},
	{
		property: "P3159",
		label: "UGentMemorialis ID",
		datatype: "ExternalId"
	},
	{
		property: "P3160",
		label: "Minnesota legislator ID",
		datatype: "ExternalId"
	},
	{
		property: "P3161",
		label: "has grammatical mood",
		datatype: "WikibaseItem"
	},
	{
		property: "P3162",
		label: "Rock Hall of Fame ID",
		datatype: "ExternalId"
	},
	{
		property: "P3163",
		label: "Scottish Charity number",
		datatype: "ExternalId"
	},
	{
		property: "P3165",
		label: "Horsetelex ID",
		datatype: "ExternalId"
	},
	{
		property: "P3166",
		label: "Webpedigrees ID",
		datatype: "ExternalId"
	},
	{
		property: "P3167",
		label: "Allbreedpedigree ID",
		datatype: "ExternalId"
	},
	{
		property: "P3168",
		label: "Sporthorse data ID",
		datatype: "ExternalId"
	},
	{
		property: "P3169",
		label: "Harasire ID",
		datatype: "ExternalId"
	},
	{
		property: "P3170",
		label: "Cultural Heritage Armenia ID",
		datatype: "ExternalId"
	},
	{
		property: "P3171",
		label: "International Olympic Committee athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P1174",
		label: "visitors per year",
		datatype: "Quantity"
	},
	{
		property: "P1181",
		label: "numeric value",
		datatype: "Quantity"
	},
	{
		property: "P1182",
		label: "LIBRIS editions",
		datatype: "ExternalId"
	},
	{
		property: "P1183",
		label: "Gewässerkennzahl",
		datatype: "String"
	},
	{
		property: "P1184",
		label: "handle",
		datatype: "ExternalId"
	},
	{
		property: "P1185",
		label: "Rodovid ID",
		datatype: "ExternalId"
	},
	{
		property: "P1186",
		label: "MEP directory ID",
		datatype: "ExternalId"
	},
	{
		property: "P1187",
		label: "Dharma Drum Buddhist College person ID",
		datatype: "ExternalId"
	},
	{
		property: "P1188",
		label: "Dharma Drum Buddhist College place ID",
		datatype: "ExternalId"
	},
	{
		property: "P1189",
		label: "Chinese Library Classification",
		datatype: "ExternalId"
	},
	{
		property: "P1190",
		label: "Universal Decimal Classification",
		datatype: "String"
	},
	{
		property: "P1191",
		label: "first performance",
		datatype: "Time"
	},
	{
		property: "P1192",
		label: "connecting service",
		datatype: "WikibaseItem"
	},
	{
		property: "P1193",
		label: "prevalence",
		datatype: "Quantity"
	},
	{
		property: "P1194",
		label: "received signal type",
		datatype: "WikibaseItem"
	},
	{
		property: "P1195",
		label: "file extension",
		datatype: "String"
	},
	{
		property: "P1196",
		label: "manner of death",
		datatype: "WikibaseItem"
	},
	{
		property: "P1198",
		label: "unemployment rate",
		datatype: "Quantity"
	},
	{
		property: "P1199",
		label: "mode of inheritance",
		datatype: "WikibaseItem"
	},
	{
		property: "P1200",
		label: "bodies of water basin category",
		datatype: "WikibaseItem"
	},
	{
		property: "P1201",
		label: "space tug",
		datatype: "WikibaseItem"
	},
	{
		property: "P1202",
		label: "carries scientific instrument",
		datatype: "WikibaseItem"
	},
	{
		property: "P1203",
		label: "Finnish municipality number",
		datatype: "ExternalId"
	},
	{
		property: "P1204",
		label: "Wikimedia portal's main topic",
		datatype: "WikibaseItem"
	},
	{
		property: "P1207",
		label: "NUKAT (WarsawU) authorities",
		datatype: "ExternalId"
	},
	{
		property: "P1208",
		label: "ISMN",
		datatype: "ExternalId"
	},
	{
		property: "P1209",
		label: "CN",
		datatype: "ExternalId"
	},
	{
		property: "P1210",
		label: "supercharger",
		datatype: "WikibaseItem"
	},
	{
		property: "P1211",
		label: "fuel system",
		datatype: "WikibaseItem"
	},
	{
		property: "P1212",
		label: "Atlas ID",
		datatype: "ExternalId"
	},
	{
		property: "P1213",
		label: "NLC authorities",
		datatype: "ExternalId"
	},
	{
		property: "P1214",
		label: "Riksdagen person-id",
		datatype: "ExternalId"
	},
	{
		property: "P1215",
		label: "apparent magnitude",
		datatype: "Quantity"
	},
	{
		property: "P1216",
		label: "National Heritage List for England number",
		datatype: "ExternalId"
	},
	{
		property: "P1217",
		label: "Internet Broadway Database venue ID",
		datatype: "ExternalId"
	},
	{
		property: "P1218",
		label: "Internet Broadway Database production ID",
		datatype: "ExternalId"
	},
	{
		property: "P1219",
		label: "Internet Broadway Database show ID",
		datatype: "ExternalId"
	},
	{
		property: "P1220",
		label: "Internet Broadway Database person ID",
		datatype: "ExternalId"
	},
	{
		property: "P1221",
		label: "compressor type",
		datatype: "WikibaseItem"
	},
	{
		property: "P1222",
		label: "(deprecated) NARA person ID",
		datatype: "ExternalId"
	},
	{
		property: "P1225",
		label: "National Archives Identifier",
		datatype: "ExternalId"
	},
	{
		property: "P1227",
		label: "astronomical filter",
		datatype: "WikibaseItem"
	},
	{
		property: "P1229",
		label: "Openpolis ID",
		datatype: "ExternalId"
	},
	{
		property: "P1230",
		label: "JSTOR journal code",
		datatype: "ExternalId"
	},
	{
		property: "P1232",
		label: "Linguist list code",
		datatype: "ExternalId"
	},
	{
		property: "P1233",
		label: "ISFDB author ID",
		datatype: "ExternalId"
	},
	{
		property: "P1234",
		label: "ISFDB publication ID",
		datatype: "ExternalId"
	},
	{
		property: "P1235",
		label: "ISFDB series ID",
		datatype: "ExternalId"
	},
	{
		property: "P1236",
		label: "Parsons code",
		datatype: "ExternalId"
	},
	{
		property: "P1237",
		label: "Box Office Mojo film ID",
		datatype: "ExternalId"
	},
	{
		property: "P1238",
		label: "Swedish Football Association ID",
		datatype: "ExternalId"
	},
	{
		property: "P1239",
		label: "ISFDB publisher ID",
		datatype: "ExternalId"
	},
	{
		property: "P1240",
		label: "Danish Bibliometric Research Indicator level",
		datatype: "String"
	},
	{
		property: "P1241",
		label: "Swiss Football Association Club Number",
		datatype: "ExternalId"
	},
	{
		property: "P1242",
		label: "Theatricalia play ID",
		datatype: "ExternalId"
	},
	{
		property: "P1243",
		label: "International Standard Recording Code",
		datatype: "ExternalId"
	},
	{
		property: "P1245",
		label: "OmegaWiki Defined Meaning",
		datatype: "ExternalId"
	},
	{
		property: "P1246",
		label: "patent number",
		datatype: "ExternalId"
	},
	{
		property: "P1247",
		label: "compression ratio",
		datatype: "Quantity"
	},
	{
		property: "P1248",
		label: "KulturNav-id",
		datatype: "ExternalId"
	},
	{
		property: "P1249",
		label: "time of earliest written record",
		datatype: "Time"
	},
	{
		property: "P1250",
		label: "Danish Bibliometric Research Indicator (BFI) SNO/CNO",
		datatype: "ExternalId"
	},
	{
		property: "P1251",
		label: "ABS ASCL code",
		datatype: "ExternalId"
	},
	{
		property: "P1252",
		label: "AUSTLANG code",
		datatype: "ExternalId"
	},
	{
		property: "P1253",
		label: "BCU Ecrivainsvd",
		datatype: "ExternalId"
	},
	{
		property: "P1254",
		label: "Slovenska biografija ID",
		datatype: "ExternalId"
	},
	{
		property: "P1255",
		label: "Helveticarchives ID",
		datatype: "ExternalId"
	},
	{
		property: "P1256",
		label: "Iconclass notation",
		datatype: "ExternalId"
	},
	{
		property: "P1257",
		label: "depicts Iconclass notation",
		datatype: "String"
	},
	{
		property: "P1258",
		label: "Rotten Tomatoes ID",
		datatype: "ExternalId"
	},
	{
		property: "P1259",
		label: "coordinates of the point of view",
		datatype: "GlobeCoordinate"
	},
	{
		property: "P1260",
		label: "Cultural heritage database in Sweden ID",
		datatype: "ExternalId"
	},
	{
		property: "P1261",
		label: "Rundata",
		datatype: "ExternalId"
	},
	{
		property: "P1262",
		label: "RAÄ number",
		datatype: "ExternalId"
	},
	{
		property: "P1263",
		label: "NNDB people ID",
		datatype: "ExternalId"
	},
	{
		property: "P1264",
		label: "valid in period",
		datatype: "WikibaseItem"
	},
	{
		property: "P1265",
		label: "AlloCiné film ID",
		datatype: "ExternalId"
	},
	{
		property: "P1266",
		label: "AlloCiné person ID",
		datatype: "ExternalId"
	},
	{
		property: "P1267",
		label: "AlloCiné series ID",
		datatype: "ExternalId"
	},
	{
		property: "P1268",
		label: "represents organisation",
		datatype: "WikibaseItem"
	},
	{
		property: "P1269",
		label: "facet of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1270",
		label: "Norwegian Register journal ID",
		datatype: "ExternalId"
	},
	{
		property: "P1271",
		label: "Norway Database for Statistics on Higher education publisher ID",
		datatype: "ExternalId"
	},
	{
		property: "P1272",
		label: "Norway Import Service and Registration Authority periodical code",
		datatype: "ExternalId"
	},
	{
		property: "P1273",
		label: "CANTIC-ID",
		datatype: "ExternalId"
	},
	{
		property: "P1274",
		label: "ISFDB title ID",
		datatype: "ExternalId"
	},
	{
		property: "P1275",
		label: "Norway Import Service and Registration Authority publisher code",
		datatype: "ExternalId"
	},
	{
		property: "P1276",
		label: "Dictionnaire du Jura ID",
		datatype: "ExternalId"
	},
	{
		property: "P1277",
		label: "Jufo ID",
		datatype: "ExternalId"
	},
	{
		property: "P1278",
		label: "Legal Entity ID",
		datatype: "ExternalId"
	},
	{
		property: "P1279",
		label: "inflation rate",
		datatype: "Quantity"
	},
	{
		property: "P1280",
		label: "CONOR ID",
		datatype: "ExternalId"
	},
	{
		property: "P1281",
		label: "WOEID",
		datatype: "ExternalId"
	},
	{
		property: "P1282",
		label: "OpenStreetMap tag or key",
		datatype: "String"
	},
	{
		property: "P1283",
		label: "filmography",
		datatype: "WikibaseItem"
	},
	{
		property: "P1284",
		label: "Munzinger IBA",
		datatype: "ExternalId"
	},
	{
		property: "P1285",
		label: "Munzinger Sport number",
		datatype: "ExternalId"
	},
	{
		property: "P1286",
		label: "Munzinger Pop ID",
		datatype: "ExternalId"
	},
	{
		property: "P1287",
		label: "KDG Komponisten der Gegenwart",
		datatype: "ExternalId"
	},
	{
		property: "P1288",
		label: "KLG Kritisches Lexikon der Gegenwartsliteratur",
		datatype: "ExternalId"
	},
	{
		property: "P3698",
		label: "Tennis Australia player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3699",
		label: "Transfermarkt referee ID",
		datatype: "ExternalId"
	},
	{
		property: "P3700",
		label: "NHF player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3701",
		label: "incarnation of",
		datatype: "WikibaseItem"
	},
	{
		property: "P3702",
		label: "Catalogue of Illuminated Manuscripts ID",
		datatype: "ExternalId"
	},
	{
		property: "P3703",
		label: "JMDb person or company ID",
		datatype: "ExternalId"
	},
	{
		property: "P3704",
		label: "KMDb film ID",
		datatype: "ExternalId"
	},
	{
		property: "P3705",
		label: "RITVA Program ID",
		datatype: "ExternalId"
	},
	{
		property: "P3706",
		label: "RITVA Person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3707",
		label: "Gridabase glacier ID",
		datatype: "ExternalId"
	},
	{
		property: "P3708",
		label: "PhDTree person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3709",
		label: "category for value different from Wikidata",
		datatype: "WikibaseItem"
	},
	{
		property: "P3710",
		label: "Jewish Encyclopedia Daat ID",
		datatype: "ExternalId"
	},
	{
		property: "P3711",
		label: "Vanderkrogt.net Statues ID",
		datatype: "ExternalId"
	},
	{
		property: "P3712",
		label: "objective of project or mission",
		datatype: "WikibaseItem"
	},
	{
		property: "P3713",
		label: "category for value not in Wikidata",
		datatype: "WikibaseItem"
	},
	{
		property: "P3714",
		label: "Recreation.gov facility ID",
		datatype: "ExternalId"
	},
	{
		property: "P3715",
		label: "NISH Hall of Fame ID",
		datatype: "ExternalId"
	},
	{
		property: "P3716",
		label: "social classification",
		datatype: "WikibaseItem"
	},
	{
		property: "P3717",
		label: "MEROPS enzyme ID",
		datatype: "ExternalId"
	},
	{
		property: "P3718",
		label: "NCMEC person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3719",
		label: "regulated by",
		datatype: "WikibaseItem"
	},
	{
		property: "P3720",
		label: "GPnotebook ID",
		datatype: "ExternalId"
	},
	{
		property: "P3721",
		label: "public key fingerprint",
		datatype: "String"
	},
	{
		property: "P3722",
		label: "Commons maps category",
		datatype: "String"
	},
	{
		property: "P3723",
		label: "USCG Lighthouse ID",
		datatype: "ExternalId"
	},
	{
		property: "P3724",
		label: "USHMM Holocaust Encyclopedia ID",
		datatype: "ExternalId"
	},
	{
		property: "P3725",
		label: "CEV player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3726",
		label: "Eu-football.info player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3727",
		label: "Serbia municipality ID",
		datatype: "ExternalId"
	},
	{
		property: "P3728",
		label: "New Zealand Heritage List number",
		datatype: "ExternalId"
	},
	{
		property: "P3729",
		label: "next lower rank",
		datatype: "WikibaseItem"
	},
	{
		property: "P3730",
		label: "next higher rank",
		datatype: "WikibaseItem"
	},
	{
		property: "P3731",
		label: "Serbia cadastral municipality ID",
		datatype: "ExternalId"
	},
	{
		property: "P3732",
		label: "PhilPapers record",
		datatype: "ExternalId"
	},
	{
		property: "P3733",
		label: "MOOMA artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P3734",
		label: "category for value same as Wikidata",
		datatype: "WikibaseItem"
	},
	{
		property: "P3735",
		label: "Yad Vashem Encyclopedia of the Ghettos ID",
		datatype: "ExternalId"
	},
	{
		property: "P3736",
		label: "Eurovision Song Contest song ID",
		datatype: "ExternalId"
	},
	{
		property: "P3737",
		label: "maximum wavelength of sensitivity",
		datatype: "Quantity"
	},
	{
		property: "P3738",
		label: "minimum wavelength of sensitivity",
		datatype: "Quantity"
	},
	{
		property: "P3739",
		label: "inflorescence",
		datatype: "WikibaseItem"
	},
	{
		property: "P3740",
		label: "number of works",
		datatype: "Quantity"
	},
	{
		property: "P3741",
		label: "seed dispersal",
		datatype: "WikibaseItem"
	},
	{
		property: "P3742",
		label: "FIH player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3743",
		label: "ITU/ISO/IEC object identifier",
		datatype: "ExternalId"
	},
	{
		property: "P3744",
		label: "number of subscribers",
		datatype: "Quantity"
	},
	{
		property: "P3745",
		label: "World Rugby Sevens Series ID",
		datatype: "ExternalId"
	},
	{
		property: "P3746",
		label: "Wildflowers of Israel ID",
		datatype: "ExternalId"
	},
	{
		property: "P3747",
		label: "SSRN author ID",
		datatype: "ExternalId"
	},
	{
		property: "P3748",
		label: "Israel Football Association player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3749",
		label: "Google Maps CID",
		datatype: "ExternalId"
	},
	{
		property: "P3750",
		label: "KMDb documentary ID",
		datatype: "ExternalId"
	},
	{
		property: "P3751",
		label: "Shoftim BeIsrael judge ID",
		datatype: "ExternalId"
	},
	{
		property: "P3752",
		label: "worst-case performance",
		datatype: "Math"
	},
	{
		property: "P3753",
		label: "best-case performance",
		datatype: "Math"
	},
	{
		property: "P3754",
		label: "average performance",
		datatype: "Math"
	},
	{
		property: "P3755",
		label: "worst-case space complexity",
		datatype: "Math"
	},
	{
		property: "P3756",
		label: "best-case space complexity",
		datatype: "Math"
	},
	{
		property: "P3757",
		label: "average space complexity",
		datatype: "Math"
	},
	{
		property: "P3758",
		label: "DOCOMOMO Ibérico ID",
		datatype: "ExternalId"
	},
	{
		property: "P3759",
		label: "SAHRA heritage site ID",
		datatype: "ExternalId"
	},
	{
		property: "P3760",
		label: "Iditarod musher ID",
		datatype: "ExternalId"
	},
	{
		property: "P3761",
		label: "IPv4 routing prefix",
		datatype: "String"
	},
	{
		property: "P3762",
		label: "openMLOL author ID",
		datatype: "ExternalId"
	},
	{
		property: "P3763",
		label: "MIMO instrument ID",
		datatype: "ExternalId"
	},
	{
		property: "P3764",
		label: "pole position",
		datatype: "WikibaseItem"
	},
	{
		property: "P3765",
		label: "All-Athletics.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P3766",
		label: "European Athletics ID",
		datatype: "ExternalId"
	},
	{
		property: "P3767",
		label: "FFA ID",
		datatype: "ExternalId"
	},
	{
		property: "P3768",
		label: "Medieval Libraries of Great Britain ID",
		datatype: "ExternalId"
	},
	{
		property: "P3769",
		label: "It's Rugby ID",
		datatype: "ExternalId"
	},
	{
		property: "P3770",
		label: "PeakFinder ID",
		datatype: "ExternalId"
	},
	{
		property: "P3771",
		label: "activator of",
		datatype: "WikibaseItem"
	},
	{
		property: "P3772",
		label: "agonist of",
		datatype: "WikibaseItem"
	},
	{
		property: "P3773",
		label: "antagonist of",
		datatype: "WikibaseItem"
	},
	{
		property: "P3774",
		label: "blocker of",
		datatype: "WikibaseItem"
	},
	{
		property: "P3775",
		label: "disrupting agent for",
		datatype: "WikibaseItem"
	},
	{
		property: "P3776",
		label: "inhibitor of",
		datatype: "WikibaseItem"
	},
	{
		property: "P3777",
		label: "antisense inhibitor of",
		datatype: "WikibaseItem"
	},
	{
		property: "P3778",
		label: "positive allosteric modulator of",
		datatype: "WikibaseItem"
	},
	{
		property: "P3779",
		label: "negative allosteric modulator of",
		datatype: "WikibaseItem"
	},
	{
		property: "P3780",
		label: "active ingredient in",
		datatype: "WikibaseItem"
	},
	{
		property: "P3781",
		label: "has active ingredient",
		datatype: "WikibaseItem"
	},
	{
		property: "P3782",
		label: "Artnet artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P3783",
		label: "Christie's work ID",
		datatype: "ExternalId"
	},
	{
		property: "P3784",
		label: "CiteSeerX article ID",
		datatype: "ExternalId"
	},
	{
		property: "P3785",
		label: "danskefilm film ID",
		datatype: "ExternalId"
	},
	{
		property: "P3786",
		label: "danskefilm person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3787",
		label: "danskefilm silent film ID",
		datatype: "ExternalId"
	},
	{
		property: "P3788",
		label: "BNA authority ID",
		datatype: "ExternalId"
	},
	{
		property: "P3789",
		label: "Telegram username",
		datatype: "ExternalId"
	},
	{
		property: "P3790",
		label: "AnimeCons.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P3791",
		label: "Art Renewal Center ID",
		datatype: "ExternalId"
	},
	{
		property: "P3792",
		label: "rate of fire",
		datatype: "Quantity"
	},
	{
		property: "P3793",
		label: "IPv6 routing prefix",
		datatype: "String"
	},
	{
		property: "P3794",
		label: "Dictionary of Sydney ID",
		datatype: "ExternalId"
	},
	{
		property: "P3795",
		label: "Flora of Israel plant ID",
		datatype: "ExternalId"
	},
	{
		property: "P3796",
		label: "Bureau of Meteorology station ID",
		datatype: "ExternalId"
	},
	{
		property: "P3797",
		label: "autonomous system number",
		datatype: "ExternalId"
	},
	{
		property: "P3172",
		label: "World Bridge Federation ID",
		datatype: "ExternalId"
	},
	{
		property: "P3173",
		label: "offers view on",
		datatype: "WikibaseItem"
	},
	{
		property: "P3174",
		label: "art director",
		datatype: "WikibaseItem"
	},
	{
		property: "P3175",
		label: "Statoids ID",
		datatype: "ExternalId"
	},
	{
		property: "P3176",
		label: "uses property",
		datatype: "WikibaseProperty"
	},
	{
		property: "P3177",
		label: "Patrimonio Web JCyL ID",
		datatype: "ExternalId"
	},
	{
		property: "P3178",
		label: "Zaragoza monument ID",
		datatype: "ExternalId"
	},
	{
		property: "P3179",
		label: "territory overlaps",
		datatype: "WikibaseItem"
	},
	{
		property: "P3180",
		label: "Visual Novel Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P3181",
		label: "OpenCitations bibliographic resource ID",
		datatype: "ExternalId"
	},
	{
		property: "P3182",
		label: "FANTOIR code",
		datatype: "ExternalId"
	},
	{
		property: "P3183",
		label: "WSJ topic ID",
		datatype: "ExternalId"
	},
	{
		property: "P3184",
		label: "Czech National Bibliography book ID",
		datatype: "ExternalId"
	},
	{
		property: "P3185",
		label: "VKontakte username",
		datatype: "ExternalId"
	},
	{
		property: "P3186",
		label: "TAXREF ID",
		datatype: "ExternalId"
	},
	{
		property: "P3187",
		label: "Marburger Professorenkatalog ID",
		datatype: "ExternalId"
	},
	{
		property: "P3188",
		label: "Nobel prize ID",
		datatype: "ExternalId"
	},
	{
		property: "P3189",
		label: "innervated by",
		datatype: "WikibaseItem"
	},
	{
		property: "P3190",
		label: "innervates",
		datatype: "WikibaseItem"
	},
	{
		property: "P3191",
		label: "IMIS person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3192",
		label: "Last.fm music ID",
		datatype: "ExternalId"
	},
	{
		property: "P3193",
		label: "GS1 Manufacturer code",
		datatype: "ExternalId"
	},
	{
		property: "P3194",
		label: "INA video ID",
		datatype: "ExternalId"
	},
	{
		property: "P3195",
		label: "league points system",
		datatype: "WikibaseItem"
	},
	{
		property: "P3196",
		label: "USGS earthquake id",
		datatype: "ExternalId"
	},
	{
		property: "P3197",
		label: "Federal Heritage Buildings ID (Canada)",
		datatype: "ExternalId"
	},
	{
		property: "P3198",
		label: "JewishGen Locality ID",
		datatype: "ExternalId"
	},
	{
		property: "P3199",
		label: "charity number (Isle of Man)",
		datatype: "ExternalId"
	},
	{
		property: "P3200",
		label: "Northern Ireland charity number",
		datatype: "ExternalId"
	},
	{
		property: "P3201",
		label: "Medical Dictionary for Regulatory Activities ID",
		datatype: "ExternalId"
	},
	{
		property: "P3202",
		label: "UAI code",
		datatype: "ExternalId"
	},
	{
		property: "P3203",
		label: "Ciné-Ressources film ID",
		datatype: "ExternalId"
	},
	{
		property: "P3204",
		label: "Ciné-Ressources person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3205",
		label: "patient of",
		datatype: "WikibaseItem"
	},
	{
		property: "P3206",
		label: "data.gouv.fr ID",
		datatype: "ExternalId"
	},
	{
		property: "P3207",
		label: "Vine user ID",
		datatype: "ExternalId"
	},
	{
		property: "P3208",
		label: "New General Catalogue ID",
		datatype: "ExternalId"
	},
	{
		property: "P3209",
		label: "Heritage Railway Station of Canada ID",
		datatype: "ExternalId"
	},
	{
		property: "P3211",
		label: "Heritage Lighthouse of Canada ID",
		datatype: "ExternalId"
	},
	{
		property: "P3212",
		label: "ISAN",
		datatype: "ExternalId"
	},
	{
		property: "P3213",
		label: "Indian census area code",
		datatype: "ExternalId"
	},
	{
		property: "P3215",
		label: "SIRET number",
		datatype: "ExternalId"
	},
	{
		property: "P3216",
		label: "ClassInd rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P3217",
		label: "Dictionary of Swedish National Biography",
		datatype: "ExternalId"
	},
	{
		property: "P3218",
		label: "Auñamendi ID",
		datatype: "ExternalId"
	},
	{
		property: "P3219",
		label: "Encyclopædia Universalis Online ID",
		datatype: "ExternalId"
	},
	{
		property: "P3220",
		label: "KvK company ID",
		datatype: "ExternalId"
	},
	{
		property: "P3221",
		label: "NYT topic ID",
		datatype: "ExternalId"
	},
	{
		property: "P3222",
		label: "NE.se ID",
		datatype: "ExternalId"
	},
	{
		property: "P3223",
		label: "Online List of Lights id",
		datatype: "ExternalId"
	},
	{
		property: "P3224",
		label: "NAICS code",
		datatype: "ExternalId"
	},
	{
		property: "P3225",
		label: "Corporate Number (Japan)",
		datatype: "ExternalId"
	},
	{
		property: "P3226",
		label: "HAS member ID",
		datatype: "ExternalId"
	},
	{
		property: "P3227",
		label: "Cultural Heritage Kosovo ID",
		datatype: "ExternalId"
	},
	{
		property: "P3228",
		label: "Schläfli symbol",
		datatype: "String"
	},
	{
		property: "P3229",
		label: "South Dakota legislator ID",
		datatype: "ExternalId"
	},
	{
		property: "P3230",
		label: "SCAR Composite Gazetteer place ID",
		datatype: "ExternalId"
	},
	{
		property: "P3231",
		label: "Mediaarts-DB ID",
		datatype: "ExternalId"
	},
	{
		property: "P3232",
		label: "PhilPapers author ID",
		datatype: "ExternalId"
	},
	{
		property: "P3233",
		label: "PhilPapers profile",
		datatype: "ExternalId"
	},
	{
		property: "P3234",
		label: "Library of Congress Cultural Heritage Organizations",
		datatype: "ExternalId"
	},
	{
		property: "P3235",
		label: "PhilPapers topic",
		datatype: "ExternalId"
	},
	{
		property: "P3236",
		label: "PhilPapers publication ID",
		datatype: "ExternalId"
	},
	{
		property: "P3237",
		label: "KU Leuven person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3238",
		label: "trunk prefix",
		datatype: "String"
	},
	{
		property: "P3240",
		label: "NBN System Key",
		datatype: "ExternalId"
	},
	{
		property: "P3241",
		label: "Catholic Encyclopedia ID",
		datatype: "ExternalId"
	},
	{
		property: "P3242",
		label: "SIC code",
		datatype: "ExternalId"
	},
	{
		property: "P3243",
		label: "OKVED 1.1 code of the economic activity",
		datatype: "ExternalId"
	},
	{
		property: "P3245",
		label: "OKPD code of the good or service",
		datatype: "ExternalId"
	},
	{
		property: "P3246",
		label: "OKVED 2 code of the economic activity",
		datatype: "ExternalId"
	},
	{
		property: "P3248",
		label: "OKP ID of the good or service",
		datatype: "ExternalId"
	},
	{
		property: "P3250",
		label: "OKPD2 code of the good or service",
		datatype: "ExternalId"
	},
	{
		property: "P3251",
		label: "minimum viable temperature",
		datatype: "Quantity"
	},
	{
		property: "P3252",
		label: "maximum viable temperature",
		datatype: "Quantity"
	},
	{
		property: "P3253",
		label: "optimum viable temperature",
		datatype: "Quantity"
	},
	{
		property: "P3254",
		label: "property proposal discussion",
		datatype: "Url"
	},
	{
		property: "P3256",
		label: "Cave E-Cadastre ID",
		datatype: "ExternalId"
	},
	{
		property: "P3257",
		label: "Queensland place ID",
		datatype: "ExternalId"
	},
	{
		property: "P3258",
		label: "LiveJournal ID",
		datatype: "ExternalId"
	},
	{
		property: "P3259",
		label: "intangible cultural heritage status",
		datatype: "WikibaseItem"
	},
	{
		property: "P3260",
		label: "points awarded",
		datatype: "Quantity"
	},
	{
		property: "P3261",
		label: "anatomical branch of",
		datatype: "WikibaseItem"
	},
	{
		property: "P3262",
		label: "has anatomical branch",
		datatype: "WikibaseItem"
	},
	{
		property: "P3263",
		label: "base",
		datatype: "WikibaseItem"
	},
	{
		property: "P3264",
		label: "radix",
		datatype: "WikibaseItem"
	},
	{
		property: "P3265",
		label: "Myspace ID",
		datatype: "ExternalId"
	},
	{
		property: "P3266",
		label: "LocFDD ID",
		datatype: "ExternalId"
	},
	{
		property: "P3267",
		label: "Flickr user ID",
		datatype: "ExternalId"
	},
	{
		property: "P3268",
		label: "PORT organization URL",
		datatype: "Url"
	},
	{
		property: "P3269",
		label: "Fotografen.nl ID",
		datatype: "ExternalId"
	},
	{
		property: "P3270",
		label: "compulsory education (minimum age)",
		datatype: "Quantity"
	},
	{
		property: "P3271",
		label: "compulsory education (maximum age)",
		datatype: "Quantity"
	},
	{
		property: "P3272",
		label: "Zeri image ID",
		datatype: "ExternalId"
	},
	{
		property: "P3273",
		label: "Actorenregister ID",
		datatype: "ExternalId"
	},
	{
		property: "P3274",
		label: "content deliverer",
		datatype: "WikibaseItem"
	},
	{
		property: "P3275",
		label: "storyboard artist",
		datatype: "WikibaseItem"
	},
	{
		property: "P3276",
		label: "Angel List ID",
		datatype: "ExternalId"
	},
	{
		property: "P3277",
		label: "KANTL member ID",
		datatype: "ExternalId"
	},
	{
		property: "P3279",
		label: "statistical leader",
		datatype: "WikibaseItem"
	},
	{
		property: "P1289",
		label: "KLfG Critical Dictionary of foreign contemporary literature",
		datatype: "ExternalId"
	},
	{
		property: "P1290",
		label: "godparent",
		datatype: "WikibaseItem"
	},
	{
		property: "P1291",
		label: "Association Authors of Switzerland ID",
		datatype: "ExternalId"
	},
	{
		property: "P1292",
		label: "DNB editions",
		datatype: "ExternalId"
	},
	{
		property: "P1293",
		label: "Royal Aero Club Aviator's Certificate ID",
		datatype: "ExternalId"
	},
	{
		property: "P1294",
		label: "WWF ecoregion code",
		datatype: "ExternalId"
	},
	{
		property: "P1295",
		label: "emissivity",
		datatype: "Quantity"
	},
	{
		property: "P1296",
		label: "Gran Enciclopèdia Catalana ID",
		datatype: "ExternalId"
	},
	{
		property: "P1297",
		label: "IRS Employer Identification Number",
		datatype: "ExternalId"
	},
	{
		property: "P1299",
		label: "depicted by",
		datatype: "WikibaseItem"
	},
	{
		property: "P1300",
		label: "bibcode",
		datatype: "ExternalId"
	},
	{
		property: "P1301",
		label: "number of elevators",
		datatype: "Quantity"
	},
	{
		property: "P1302",
		label: "primary destinations",
		datatype: "WikibaseItem"
	},
	{
		property: "P1303",
		label: "instrument",
		datatype: "WikibaseItem"
	},
	{
		property: "P1304",
		label: "central bank",
		datatype: "WikibaseItem"
	},
	{
		property: "P1305",
		label: "Skyscraper Center ID",
		datatype: "ExternalId"
	},
	{
		property: "P1307",
		label: "Swiss parliament ID",
		datatype: "ExternalId"
	},
	{
		property: "P1308",
		label: "officeholder",
		datatype: "WikibaseItem"
	},
	{
		property: "P1309",
		label: "EGAXA ID",
		datatype: "ExternalId"
	},
	{
		property: "P1310",
		label: "statement disputed by",
		datatype: "WikibaseItem"
	},
	{
		property: "P1311",
		label: "lostbridges.org ID",
		datatype: "ExternalId"
	},
	{
		property: "P1312",
		label: "has facet polytope",
		datatype: "WikibaseItem"
	},
	{
		property: "P1313",
		label: "office held by head of government",
		datatype: "WikibaseItem"
	},
	{
		property: "P1314",
		label: "number of spans",
		datatype: "Quantity"
	},
	{
		property: "P1315",
		label: "People Australia ID",
		datatype: "ExternalId"
	},
	{
		property: "P1316",
		label: "SMDB ID",
		datatype: "ExternalId"
	},
	{
		property: "P1317",
		label: "floruit",
		datatype: "Time"
	},
	{
		property: "P1318",
		label: "proved by",
		datatype: "WikibaseItem"
	},
	{
		property: "P1319",
		label: "earliest date",
		datatype: "Time"
	},
	{
		property: "P1320",
		label: "OpenCorporates ID",
		datatype: "ExternalId"
	},
	{
		property: "P1321",
		label: "place of origin (Switzerland)",
		datatype: "WikibaseItem"
	},
	{
		property: "P1322",
		label: "dual to",
		datatype: "WikibaseItem"
	},
	{
		property: "P1323",
		label: "Terminologia Anatomica 98 ID",
		datatype: "ExternalId"
	},
	{
		property: "P1324",
		label: "source code repository",
		datatype: "Url"
	},
	{
		property: "P1325",
		label: "external data available at",
		datatype: "Url"
	},
	{
		property: "P1326",
		label: "latest date",
		datatype: "Time"
	},
	{
		property: "P1327",
		label: "professional or sports partner",
		datatype: "WikibaseItem"
	},
	{
		property: "P1329",
		label: "phone number",
		datatype: "String"
	},
	{
		property: "P1330",
		label: "MusicBrainz instrument ID",
		datatype: "ExternalId"
	},
	{
		property: "P1331",
		label: "PACE member ID",
		datatype: "ExternalId"
	},
	{
		property: "P1332",
		label: "coordinate of northernmost point",
		datatype: "GlobeCoordinate"
	},
	{
		property: "P1333",
		label: "coordinate of southernmost point",
		datatype: "GlobeCoordinate"
	},
	{
		property: "P1334",
		label: "coordinate of easternmost point",
		datatype: "GlobeCoordinate"
	},
	{
		property: "P1335",
		label: "coordinate of westernmost point",
		datatype: "GlobeCoordinate"
	},
	{
		property: "P1336",
		label: "territory claimed by",
		datatype: "WikibaseItem"
	},
	{
		property: "P1338",
		label: "EPSG ID",
		datatype: "ExternalId"
	},
	{
		property: "P1339",
		label: "number of injured",
		datatype: "Quantity"
	},
	{
		property: "P1340",
		label: "eye color",
		datatype: "WikibaseItem"
	},
	{
		property: "P1341",
		label: "Italian Chamber of Deputies dati ID",
		datatype: "ExternalId"
	},
	{
		property: "P1342",
		label: "number of seats",
		datatype: "Quantity"
	},
	{
		property: "P1343",
		label: "described by source",
		datatype: "WikibaseItem"
	},
	{
		property: "P1344",
		label: "participant of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1345",
		label: "number of victims made by killer",
		datatype: "Quantity"
	},
	{
		property: "P1346",
		label: "winner",
		datatype: "WikibaseItem"
	},
	{
		property: "P1347",
		label: "military casualty classification",
		datatype: "WikibaseItem"
	},
	{
		property: "P1348",
		label: "AlgaeBase URL",
		datatype: "Url"
	},
	{
		property: "P1349",
		label: "ploidy",
		datatype: "WikibaseItem"
	},
	{
		property: "P1350",
		label: "number of matches played",
		datatype: "Quantity"
	},
	{
		property: "P1351",
		label: "number of points/goals/set scored",
		datatype: "Quantity"
	},
	{
		property: "P1352",
		label: "ranking",
		datatype: "Quantity"
	},
	{
		property: "P1353",
		label: "original spelling",
		datatype: "String"
	},
	{
		property: "P1354",
		label: "shown with features",
		datatype: "WikibaseItem"
	},
	{
		property: "P1355",
		label: "number of wins",
		datatype: "Quantity"
	},
	{
		property: "P1356",
		label: "losses",
		datatype: "Quantity"
	},
	{
		property: "P1357",
		label: "matches/games drawn/tied",
		datatype: "Quantity"
	},
	{
		property: "P1358",
		label: "points for",
		datatype: "Quantity"
	},
	{
		property: "P1359",
		label: "number of points/goals conceded",
		datatype: "Quantity"
	},
	{
		property: "P1360",
		label: "Monte Carlo Particle Number",
		datatype: "String"
	},
	{
		property: "P1362",
		label: "Theaterlexikon der Schweiz online ID",
		datatype: "ExternalId"
	},
	{
		property: "P1363",
		label: "points/goal scored by",
		datatype: "WikibaseItem"
	},
	{
		property: "P1364",
		label: "ITTF ID",
		datatype: "ExternalId"
	},
	{
		property: "P1365",
		label: "replaces",
		datatype: "WikibaseItem"
	},
	{
		property: "P1366",
		label: "replaced by",
		datatype: "WikibaseItem"
	},
	{
		property: "P1367",
		label: "Art UK artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P1368",
		label: "LNB ID",
		datatype: "ExternalId"
	},
	{
		property: "P1369",
		label: "Iranian National Heritage registration number",
		datatype: "ExternalId"
	},
	{
		property: "P1370",
		label: "IHSI ID",
		datatype: "ExternalId"
	},
	{
		property: "P1371",
		label: "ASI Monument ID",
		datatype: "ExternalId"
	},
	{
		property: "P1372",
		label: "binding of software library",
		datatype: "WikibaseItem"
	},
	{
		property: "P1373",
		label: "daily patronage",
		datatype: "Quantity"
	},
	{
		property: "P1375",
		label: "NSK ID",
		datatype: "ExternalId"
	},
	{
		property: "P1376",
		label: "capital of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1377",
		label: "MTR station code",
		datatype: "ExternalId"
	},
	{
		property: "P1378",
		label: "China railway TMIS station code",
		datatype: "ExternalId"
	},
	{
		property: "P1380",
		label: "UglyBridges.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P1381",
		label: "bridgehunter.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P1382",
		label: "coincident with",
		datatype: "WikibaseItem"
	},
	{
		property: "P1383",
		label: "contains settlement",
		datatype: "WikibaseItem"
	},
	{
		property: "P1385",
		label: "Enciclopédia Açoriana ID",
		datatype: "ExternalId"
	},
	{
		property: "P1386",
		label: "Japanese High School Code",
		datatype: "ExternalId"
	},
	{
		property: "P1387",
		label: "political alignment",
		datatype: "WikibaseItem"
	},
	{
		property: "P1388",
		label: "German regional key",
		datatype: "ExternalId"
	},
	{
		property: "P1389",
		label: "product certification",
		datatype: "WikibaseItem"
	},
	{
		property: "P1390",
		label: "match time of event",
		datatype: "Quantity"
	},
	{
		property: "P1391",
		label: "Index Fungorum ID",
		datatype: "ExternalId"
	},
	{
		property: "P1392",
		label: "ComicBookDB ID",
		datatype: "ExternalId"
	},
	{
		property: "P1393",
		label: "proxy",
		datatype: "WikibaseItem"
	},
	{
		property: "P1394",
		label: "Glottolog code",
		datatype: "ExternalId"
	},
	{
		property: "P1395",
		label: "National Cancer Institute ID",
		datatype: "ExternalId"
	},
	{
		property: "P1396",
		label: "Linguasphere code",
		datatype: "String"
	},
	{
		property: "P3798",
		label: "Star Wars Databank ID",
		datatype: "ExternalId"
	},
	{
		property: "P3799",
		label: "Safsal player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3800",
		label: "Safsal coach ID",
		datatype: "ExternalId"
	},
	{
		property: "P3801",
		label: "INEGI municipality ID",
		datatype: "ExternalId"
	},
	{
		property: "P3802",
		label: "Launchpad.net project ID",
		datatype: "ExternalId"
	},
	{
		property: "P3803",
		label: "original film format",
		datatype: "WikibaseItem"
	},
	{
		property: "P3804",
		label: "TV Guide show ID",
		datatype: "ExternalId"
	},
	{
		property: "P3805",
		label: "Tax-exempt heritage asset ID",
		datatype: "ExternalId"
	},
	{
		property: "P3806",
		label: "Mapa place ID",
		datatype: "ExternalId"
	},
	{
		property: "P3807",
		label: "S2A3 Biographical Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P3808",
		label: "The Numbers movie ID",
		datatype: "ExternalId"
	},
	{
		property: "P3809",
		label: "YerelNET district ID",
		datatype: "ExternalId"
	},
	{
		property: "P3810",
		label: "Parks.it ID",
		datatype: "ExternalId"
	},
	{
		property: "P3811",
		label: "Evidence & Conclusion Ontology ID",
		datatype: "ExternalId"
	},
	{
		property: "P3812",
		label: "Elle.fr person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3813",
		label: "Bivouac.com pass ID",
		datatype: "ExternalId"
	},
	{
		property: "P3814",
		label: "BoF person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3815",
		label: "volcano observatory",
		datatype: "WikibaseItem"
	},
	{
		property: "P3816",
		label: "film script",
		datatype: "WikibaseItem"
	},
	{
		property: "P3817",
		label: "FI WarSampo person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3818",
		label: "KMRB film rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P3819",
		label: "FI WarSampo army unit ID",
		datatype: "ExternalId"
	},
	{
		property: "P3820",
		label: "Flanders Arts Institute venue ID",
		datatype: "ExternalId"
	},
	{
		property: "P3821",
		label: "Bangla Movie Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P3822",
		label: "rules for classification",
		datatype: "WikibaseItem"
	},
	{
		property: "P3823",
		label: "Ethnologue language status",
		datatype: "WikibaseItem"
	},
	{
		property: "P3824",
		label: "VTJ-PRT building ID",
		datatype: "ExternalId"
	},
	{
		property: "P3825",
		label: "United States Statutes at Large citation",
		datatype: "ExternalId"
	},
	{
		property: "P3826",
		label: "Welsh Rugby Union player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3827",
		label: "JSTOR topic ID",
		datatype: "ExternalId"
	},
	{
		property: "P3828",
		label: "wears",
		datatype: "WikibaseItem"
	},
	{
		property: "P3829",
		label: "Publons author ID",
		datatype: "ExternalId"
	},
	{
		property: "P3830",
		label: "CueTracker player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3831",
		label: "object has role",
		datatype: "WikibaseItem"
	},
	{
		property: "P3832",
		label: "Europeana Fashion Vocabulary ID",
		datatype: "ExternalId"
	},
	{
		property: "P3833",
		label: "diaspora",
		datatype: "WikibaseItem"
	},
	{
		property: "P3834",
		label: "RTC film rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P3835",
		label: "Mendeley person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3836",
		label: "Pinterest username",
		datatype: "ExternalId"
	},
	{
		property: "P3837",
		label: "United States Public Law",
		datatype: "ExternalId"
	},
	{
		property: "P3838",
		label: "Tab4u song ID",
		datatype: "ExternalId"
	},
	{
		property: "P3839",
		label: "Tab4u artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P3840",
		label: "slope rating",
		datatype: "Quantity"
	},
	{
		property: "P3841",
		label: "Human Phenotype Ontology ID",
		datatype: "ExternalId"
	},
	{
		property: "P3842",
		label: "located in present-day administrative territorial entity",
		datatype: "WikibaseItem"
	},
	{
		property: "P3843",
		label: "DLV athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3844",
		label: "Deutsche Synchronkartei film ID",
		datatype: "ExternalId"
	},
	{
		property: "P3845",
		label: "TV Guide person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3846",
		label: "DBC author ID",
		datatype: "ExternalId"
	},
	{
		property: "P3847",
		label: "Open Library subject ID",
		datatype: "ExternalId"
	},
	{
		property: "P3848",
		label: "Irish Rugby Football Union ID",
		datatype: "ExternalId"
	},
	{
		property: "P3849",
		label: "LombardiaBeniCulturali institution ID",
		datatype: "ExternalId"
	},
	{
		property: "P3850",
		label: "LombardiaBeniCulturali toponym ID",
		datatype: "ExternalId"
	},
	{
		property: "P3851",
		label: "cinenacional.com movie ID",
		datatype: "ExternalId"
	},
	{
		property: "P3852",
		label: "FlyBase Gene ID",
		datatype: "ExternalId"
	},
	{
		property: "P3853",
		label: "Rat Genome Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P3854",
		label: "Soundtrack Collector ID",
		datatype: "ExternalId"
	},
	{
		property: "P3855",
		label: "LombardiaBeniCulturali artwork ID",
		datatype: "ExternalId"
	},
	{
		property: "P3856",
		label: "Quebec municipalities geographical code",
		datatype: "ExternalId"
	},
	{
		property: "P3857",
		label: "cinenacional.com person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3858",
		label: "route diagram",
		datatype: "WikibaseItem"
	},
	{
		property: "P3859",
		label: "Environment Ontology ID",
		datatype: "ExternalId"
	},
	{
		property: "P3860",
		label: "Wormbase Gene ID",
		datatype: "ExternalId"
	},
	{
		property: "P3861",
		label: "iTunes app ID",
		datatype: "ExternalId"
	},
	{
		property: "P3862",
		label: "MyDramaList name ID",
		datatype: "ExternalId"
	},
	{
		property: "P3863",
		label: "Italian Navy Lighthouses and Beacons ID",
		datatype: "ExternalId"
	},
	{
		property: "P3864",
		label: "suicide rate",
		datatype: "Quantity"
	},
	{
		property: "P3865",
		label: "type of reference",
		datatype: "WikibaseItem"
	},
	{
		property: "P3866",
		label: "LAWA waterbody ID",
		datatype: "ExternalId"
	},
	{
		property: "P3867",
		label: "Israel Chess Federation player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3868",
		label: "MyDramaList title ID",
		datatype: "ExternalId"
	},
	{
		property: "P3869",
		label: "IAFD female performer ID",
		datatype: "ExternalId"
	},
	{
		property: "P3870",
		label: "ZFIN Gene ID",
		datatype: "ExternalId"
	},
	{
		property: "P3871",
		label: "tributary orientation",
		datatype: "WikibaseItem"
	},
	{
		property: "P3872",
		label: "patronage",
		datatype: "Quantity"
	},
	{
		property: "P3874",
		label: "Justia Patents inventor ID",
		datatype: "ExternalId"
	},
	{
		property: "P3875",
		label: "Justia Patents company ID",
		datatype: "ExternalId"
	},
	{
		property: "P3876",
		label: "category for alumni of educational institution",
		datatype: "WikibaseItem"
	},
	{
		property: "P3877",
		label: "HappyCow restaurant ID",
		datatype: "ExternalId"
	},
	{
		property: "P3878",
		label: "Soundex",
		datatype: "String"
	},
	{
		property: "P3879",
		label: "Cologne phonetics",
		datatype: "String"
	},
	{
		property: "P3880",
		label: "Caverphone",
		datatype: "String"
	},
	{
		property: "P3881",
		label: "National Track & Field Hall of Fame athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3882",
		label: "Tilastopaja female athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3883",
		label: "Red Bull athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3884",
		label: "Tilastopaja male athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3885",
		label: "History of Modern Biomedicine ID",
		datatype: "ExternalId"
	},
	{
		property: "P3886",
		label: "number of perpetrators",
		datatype: "Quantity"
	},
	{
		property: "P3887",
		label: "KVAB member ID",
		datatype: "ExternalId"
	},
	{
		property: "P3888",
		label: "Boijmans artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P3889",
		label: "Swiss Federal Archives ID",
		datatype: "ExternalId"
	},
	{
		property: "P3890",
		label: "MetaboLights Compound ID",
		datatype: "ExternalId"
	},
	{
		property: "P3891",
		label: "observing time available",
		datatype: "Quantity"
	},
	{
		property: "P3892",
		label: "PictoRight ID-Droit de suite",
		datatype: "ExternalId"
	},
	{
		property: "P3893",
		label: "public domain date",
		datatype: "Time"
	},
	{
		property: "P3894",
		label: "OSTI article ID",
		datatype: "ExternalId"
	},
	{
		property: "P3895",
		label: "INAO product ID",
		datatype: "ExternalId"
	},
	{
		property: "P3896",
		label: "geoshape",
		datatype: "GeoShape"
	},
	{
		property: "P3897",
		label: "Ladies European Tour ID",
		datatype: "ExternalId"
	},
	{
		property: "P3898",
		label: "Hotels.com hotel ID",
		datatype: "ExternalId"
	},
	{
		property: "P3280",
		label: "BanQ author ID",
		datatype: "ExternalId"
	},
	{
		property: "P3281",
		label: "French National Assembly Lobbyist ID",
		datatype: "ExternalId"
	},
	{
		property: "P3283",
		label: "Bandcamp artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P3284",
		label: "Yahoo! Japan Talent Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P3285",
		label: "Mathematics Subject Classification ID",
		datatype: "ExternalId"
	},
	{
		property: "P3286",
		label: "Squash Info ID",
		datatype: "ExternalId"
	},
	{
		property: "P3288",
		label: "World Spider Catalog ID",
		datatype: "ExternalId"
	},
	{
		property: "P3289",
		label: "Cellosaurus ID",
		datatype: "ExternalId"
	},
	{
		property: "P3290",
		label: "biography at the Landtag of Mecklenburg-Vorpommern",
		datatype: "ExternalId"
	},
	{
		property: "P3291",
		label: "DocCheck Flexikon En ID",
		datatype: "ExternalId"
	},
	{
		property: "P3292",
		label: "DocCheck Flexikon De ID",
		datatype: "ExternalId"
	},
	{
		property: "P3293",
		label: "BALaT image ID",
		datatype: "ExternalId"
	},
	{
		property: "P3294",
		label: "encoding",
		datatype: "WikibaseItem"
	},
	{
		property: "P3295",
		label: "code",
		datatype: "String"
	},
	{
		property: "P3296",
		label: "DRÚSOP ID",
		datatype: "ExternalId"
	},
	{
		property: "P3297",
		label: "Flemish Parliament person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3298",
		label: "Belgian Senate person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3299",
		label: "student register of the University of Helsinki ID (1640–1852)",
		datatype: "ExternalId"
	},
	{
		property: "P3300",
		label: "musical conductor",
		datatype: "WikibaseItem"
	},
	{
		property: "P3301",
		label: "broadcast by",
		datatype: "WikibaseItem"
	},
	{
		property: "P3302",
		label: "Open Media Database film ID",
		datatype: "ExternalId"
	},
	{
		property: "P3303",
		label: "third-party formatter URL",
		datatype: "String"
	},
	{
		property: "P3304",
		label: "NGS pumping station ID",
		datatype: "ExternalId"
	},
	{
		property: "P3305",
		label: "KINENOTE person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3306",
		label: "ICAA rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P3307",
		label: "Galiciana Author ID",
		datatype: "ExternalId"
	},
	{
		property: "P3308",
		label: "lib.reviews ID",
		datatype: "ExternalId"
	},
	{
		property: "P3309",
		label: "SummitPost mountain ID",
		datatype: "ExternalId"
	},
	{
		property: "P3310",
		label: "muscle action",
		datatype: "WikibaseItem"
	},
	{
		property: "P3311",
		label: "plan image",
		datatype: "CommonsMedia"
	},
	{
		property: "P3314",
		label: "365chess player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3315",
		label: "chesstempo ID",
		datatype: "ExternalId"
	},
	{
		property: "P3316",
		label: "ICCF player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3318",
		label: "Patrimonio Inmueble de Andalucía ID",
		datatype: "ExternalId"
	},
	{
		property: "P3320",
		label: "board member",
		datatype: "WikibaseItem"
	},
	{
		property: "P3321",
		label: "male form of label",
		datatype: "Monolingualtext"
	},
	{
		property: "P3322",
		label: "Vlinderstichting-ID",
		datatype: "ExternalId"
	},
	{
		property: "P3323",
		label: "opponent during disputation",
		datatype: "WikibaseItem"
	},
	{
		property: "P3324",
		label: "petit-patrimoine.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P3325",
		label: "student register of the University of Helsinki ID (1853–1899)",
		datatype: "ExternalId"
	},
	{
		property: "P3326",
		label: "World Waterfall Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P3327",
		label: "Réserves naturelles de France ID",
		datatype: "ExternalId"
	},
	{
		property: "P3328",
		label: "wurvoc.org measure ID",
		datatype: "ExternalId"
	},
	{
		property: "P3329",
		label: "CIViC variant ID",
		datatype: "ExternalId"
	},
	{
		property: "P3330",
		label: "Supermodels.nl ID",
		datatype: "ExternalId"
	},
	{
		property: "P3331",
		label: "HGVS nomenclature",
		datatype: "ExternalId"
	},
	{
		property: "P3332",
		label: "ACM Digital Library citation ID",
		datatype: "ExternalId"
	},
	{
		property: "P3333",
		label: "ACM Digital Library event ID",
		datatype: "ExternalId"
	},
	{
		property: "P3335",
		label: "hazard on site",
		datatype: "WikibaseItem"
	},
	{
		property: "P3337",
		label: "generation time",
		datatype: "Quantity"
	},
	{
		property: "P3338",
		label: "Encyclopedia of Surfing ID",
		datatype: "ExternalId"
	},
	{
		property: "P3339",
		label: "World Surf League ID",
		datatype: "ExternalId"
	},
	{
		property: "P3340",
		label: "Kvikmyndir film ID",
		datatype: "ExternalId"
	},
	{
		property: "P3341",
		label: "Kvikmyndir person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3342",
		label: "significant person",
		datatype: "WikibaseItem"
	},
	{
		property: "P3343",
		label: "legislation.gov.uk ID",
		datatype: "ExternalId"
	},
	{
		property: "P3344",
		label: "Vote Smart ID",
		datatype: "ExternalId"
	},
	{
		property: "P3345",
		label: "RxNorm CUI",
		datatype: "ExternalId"
	},
	{
		property: "P3346",
		label: "HKMDb person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3347",
		label: "PermID",
		datatype: "ExternalId"
	},
	{
		property: "P3348",
		label: "National Library of Greece ID",
		datatype: "ExternalId"
	},
	{
		property: "P3349",
		label: "designed to carry",
		datatype: "WikibaseItem"
	},
	{
		property: "P3350",
		label: "WHO international non-proprietary names ID",
		datatype: "ExternalId"
	},
	{
		property: "P3351",
		label: "Adult Film Database person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3352",
		label: "musipedia tune ID",
		datatype: "ExternalId"
	},
	{
		property: "P3353",
		label: "National Recreation Trails Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P3354",
		label: "positive therapeutic predictor",
		datatype: "WikibaseItem"
	},
	{
		property: "P3355",
		label: "negative therapeutic predictor",
		datatype: "WikibaseItem"
	},
	{
		property: "P3356",
		label: "positive diagnostic predictor",
		datatype: "WikibaseItem"
	},
	{
		property: "P3357",
		label: "negative diagnostic predictor",
		datatype: "WikibaseItem"
	},
	{
		property: "P3358",
		label: "positive prognostic predictor",
		datatype: "WikibaseItem"
	},
	{
		property: "P3359",
		label: "negative prognostic predictor",
		datatype: "WikibaseItem"
	},
	{
		property: "P3360",
		label: "Nobel Prize People Nomination ID",
		datatype: "ExternalId"
	},
	{
		property: "P3361",
		label: "PictoRight ID code",
		datatype: "ExternalId"
	},
	{
		property: "P3362",
		label: "operating income",
		datatype: "Quantity"
	},
	{
		property: "P3363",
		label: "Tennis HoF player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3364",
		label: "stereoisomer of",
		datatype: "WikibaseItem"
	},
	{
		property: "P3365",
		label: "Enciclopedia Treccani ID",
		datatype: "ExternalId"
	},
	{
		property: "P3366",
		label: "GECD person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3367",
		label: "GECD film ID",
		datatype: "ExternalId"
	},
	{
		property: "P3368",
		label: "Prabook ID",
		datatype: "ExternalId"
	},
	{
		property: "P3370",
		label: "Géopatronyme ID",
		datatype: "ExternalId"
	},
	{
		property: "P3371",
		label: "Observatoire du Patrimoine Religieux ID",
		datatype: "ExternalId"
	},
	{
		property: "P3372",
		label: "Auckland Art Gallery artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P3373",
		label: "sibling",
		datatype: "WikibaseItem"
	},
	{
		property: "P3374",
		label: "endianness",
		datatype: "WikibaseItem"
	},
	{
		property: "P3375",
		label: "GECD Firmen-ID",
		datatype: "ExternalId"
	},
	{
		property: "P3376",
		label: "Enterprise number (Belgium)",
		datatype: "ExternalId"
	},
	{
		property: "P3377",
		label: "Bloomberg private company ID",
		datatype: "ExternalId"
	},
	{
		property: "P3378",
		label: "Merck Index reaction ID",
		datatype: "ExternalId"
	},
	{
		property: "P3379",
		label: "Model Manual ID",
		datatype: "ExternalId"
	},
	{
		property: "P3380",
		label: "FAO 2007 genetic resource ID",
		datatype: "ExternalId"
	},
	{
		property: "P3381",
		label: "File Format Wiki page ID",
		datatype: "ExternalId"
	},
	{
		property: "P3382",
		label: "GeneDB ID",
		datatype: "ExternalId"
	},
	{
		property: "P3383",
		label: "film poster",
		datatype: "CommonsMedia"
	},
	{
		property: "P3385",
		label: "Japan Sumo Association ID",
		datatype: "ExternalId"
	},
	{
		property: "P3386",
		label: "French Sculpture Census work ID",
		datatype: "ExternalId"
	},
	{
		property: "P3387",
		label: "minimum frequency of audible sound",
		datatype: "Quantity"
	},
	{
		property: "P3388",
		label: "LittleSis people ID",
		datatype: "ExternalId"
	},
	{
		property: "P3389",
		label: "Royal Swedish Academy of Letters member ID",
		datatype: "ExternalId"
	},
	{
		property: "P1397",
		label: "State Catalogue of Geographical Names (Russia) ID",
		datatype: "ExternalId"
	},
	{
		property: "P1398",
		label: "structure replaces",
		datatype: "WikibaseItem"
	},
	{
		property: "P1399",
		label: "convicted of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1400",
		label: "FCC Facility ID",
		datatype: "ExternalId"
	},
	{
		property: "P1401",
		label: "bug tracking system",
		datatype: "Url"
	},
	{
		property: "P1402",
		label: "Foundational Model of Anatomy ID",
		datatype: "String"
	},
	{
		property: "P1403",
		label: "original combination",
		datatype: "WikibaseItem"
	},
	{
		property: "P1404",
		label: "World Glacier Inventory ID",
		datatype: "ExternalId"
	},
	{
		property: "P1406",
		label: "script directionality",
		datatype: "WikibaseItem"
	},
	{
		property: "P1407",
		label: "MusicBrainz series ID",
		datatype: "ExternalId"
	},
	{
		property: "P1408",
		label: "licensed to broadcast to",
		datatype: "WikibaseItem"
	},
	{
		property: "P1409",
		label: "Cycling Archives cyclist ID",
		datatype: "ExternalId"
	},
	{
		property: "P1410",
		label: "number of representatives in an organization/legislature",
		datatype: "Quantity"
	},
	{
		property: "P1411",
		label: "nominated for",
		datatype: "WikibaseItem"
	},
	{
		property: "P1412",
		label: "languages spoken, written or signed",
		datatype: "WikibaseItem"
	},
	{
		property: "P1414",
		label: "GUI toolkit or framework",
		datatype: "WikibaseItem"
	},
	{
		property: "P1415",
		label: "Oxford Biography Index Number",
		datatype: "ExternalId"
	},
	{
		property: "P1416",
		label: "affiliation",
		datatype: "WikibaseItem"
	},
	{
		property: "P1417",
		label: "Encyclopædia Britannica Online ID",
		datatype: "ExternalId"
	},
	{
		property: "P1418",
		label: "orbits completed",
		datatype: "Quantity"
	},
	{
		property: "P1419",
		label: "shape",
		datatype: "WikibaseItem"
	},
	{
		property: "P1420",
		label: "taxon synonym",
		datatype: "WikibaseItem"
	},
	{
		property: "P1421",
		label: "GRIN URL",
		datatype: "Url"
	},
	{
		property: "P1422",
		label: "Sandrart.net person ID",
		datatype: "ExternalId"
	},
	{
		property: "P1423",
		label: "template's main topic",
		datatype: "WikibaseItem"
	},
	{
		property: "P1424",
		label: "topic's main template",
		datatype: "WikibaseItem"
	},
	{
		property: "P1425",
		label: "ecoregion (WWF)",
		datatype: "WikibaseItem"
	},
	{
		property: "P1427",
		label: "start point",
		datatype: "WikibaseItem"
	},
	{
		property: "P1428",
		label: "Lost Art-ID",
		datatype: "ExternalId"
	},
	{
		property: "P1429",
		label: "has pet",
		datatype: "WikibaseItem"
	},
	{
		property: "P1430",
		label: "OpenPlaques subject ID",
		datatype: "ExternalId"
	},
	{
		property: "P1431",
		label: "executive producer",
		datatype: "WikibaseItem"
	},
	{
		property: "P1432",
		label: "B-side",
		datatype: "WikibaseItem"
	},
	{
		property: "P1433",
		label: "published in",
		datatype: "WikibaseItem"
	},
	{
		property: "P1434",
		label: "takes place in fictional universe",
		datatype: "WikibaseItem"
	},
	{
		property: "P1435",
		label: "heritage designation",
		datatype: "WikibaseItem"
	},
	{
		property: "P1436",
		label: "collection or exhibition size",
		datatype: "Quantity"
	},
	{
		property: "P1437",
		label: "plea",
		datatype: "WikibaseItem"
	},
	{
		property: "P1438",
		label: "Jewish Encyclopedia ID (Russian)",
		datatype: "String"
	},
	{
		property: "P1439",
		label: "Norsk filmografi ID",
		datatype: "ExternalId"
	},
	{
		property: "P1440",
		label: "FIDE ID",
		datatype: "ExternalId"
	},
	{
		property: "P1441",
		label: "present in work",
		datatype: "WikibaseItem"
	},
	{
		property: "P1442",
		label: "image of grave",
		datatype: "CommonsMedia"
	},
	{
		property: "P1443",
		label: "score method",
		datatype: "WikibaseItem"
	},
	{
		property: "P1444",
		label: "destination point",
		datatype: "WikibaseItem"
	},
	{
		property: "P1445",
		label: "fictional universe described in",
		datatype: "WikibaseItem"
	},
	{
		property: "P1446",
		label: "number of missing",
		datatype: "Quantity"
	},
	{
		property: "P1447",
		label: "Sports-Reference.com Olympic athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P1448",
		label: "official name",
		datatype: "Monolingualtext"
	},
	{
		property: "P1449",
		label: "nickname",
		datatype: "Monolingualtext"
	},
	{
		property: "P1450",
		label: "Sandbox Monolingual text",
		datatype: "Monolingualtext"
	},
	{
		property: "P1451",
		label: "motto text",
		datatype: "Monolingualtext"
	},
	{
		property: "P1453",
		label: "catholic.ru ID",
		datatype: "ExternalId"
	},
	{
		property: "P1454",
		label: "legal form",
		datatype: "WikibaseItem"
	},
	{
		property: "P1455",
		label: "list of works",
		datatype: "WikibaseItem"
	},
	{
		property: "P1456",
		label: "list of monuments",
		datatype: "WikibaseItem"
	},
	{
		property: "P1457",
		label: "absolute magnitude",
		datatype: "Quantity"
	},
	{
		property: "P1458",
		label: "color index",
		datatype: "Quantity"
	},
	{
		property: "P1459",
		label: "Cadw Building ID",
		datatype: "ExternalId"
	},
	{
		property: "P1460",
		label: "NIEA building ID",
		datatype: "ExternalId"
	},
	{
		property: "P1461",
		label: "Patientplus ID",
		datatype: "String"
	},
	{
		property: "P1462",
		label: "standards body",
		datatype: "WikibaseItem"
	},
	{
		property: "P1463",
		label: "PRDL Author ID",
		datatype: "ExternalId"
	},
	{
		property: "P1464",
		label: "category for people born here",
		datatype: "WikibaseItem"
	},
	{
		property: "P1465",
		label: "category for people who died here",
		datatype: "WikibaseItem"
	},
	{
		property: "P1466",
		label: "WALS lect code",
		datatype: "ExternalId"
	},
	{
		property: "P1467",
		label: "WALS genus code",
		datatype: "ExternalId"
	},
	{
		property: "P1468",
		label: "WALS family code",
		datatype: "ExternalId"
	},
	{
		property: "P1469",
		label: "FIFA player ID",
		datatype: "ExternalId"
	},
	{
		property: "P1470",
		label: "maximum glide ratio",
		datatype: "Quantity"
	},
	{
		property: "P1471",
		label: "reporting mark",
		datatype: "String"
	},
	{
		property: "P1472",
		label: "Commons Creator page",
		datatype: "String"
	},
	{
		property: "P1473",
		label: "Nupill Literatura Digital - Author",
		datatype: "ExternalId"
	},
	{
		property: "P1474",
		label: "Nupill Literatura Digital - Document",
		datatype: "ExternalId"
	},
	{
		property: "P1476",
		label: "title",
		datatype: "Monolingualtext"
	},
	{
		property: "P1477",
		label: "birth name",
		datatype: "Monolingualtext"
	},
	{
		property: "P1478",
		label: "has immediate cause",
		datatype: "WikibaseItem"
	},
	{
		property: "P1479",
		label: "has contributing factor",
		datatype: "WikibaseItem"
	},
	{
		property: "P1480",
		label: "sourcing circumstances",
		datatype: "WikibaseItem"
	},
	{
		property: "P1481",
		label: "vici.org ID",
		datatype: "ExternalId"
	},
	{
		property: "P1482",
		label: "Stack Exchange tag",
		datatype: "Url"
	},
	{
		property: "P1483",
		label: "kulturnoe-nasledie.ru ID",
		datatype: "ExternalId"
	},
	{
		property: "P1529",
		label: "Gertrude identifier",
		datatype: "ExternalId"
	},
	{
		property: "P1531",
		label: "parent(s) of this hybrid",
		datatype: "WikibaseItem"
	},
	{
		property: "P1532",
		label: "country for sport",
		datatype: "WikibaseItem"
	},
	{
		property: "P1533",
		label: "family name identical to this given name",
		datatype: "WikibaseItem"
	},
	{
		property: "P1534",
		label: "end cause",
		datatype: "WikibaseItem"
	},
	{
		property: "P1535",
		label: "used by",
		datatype: "WikibaseItem"
	},
	{
		property: "P1536",
		label: "immediate cause of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1537",
		label: "contributing factor of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1538",
		label: "number of households",
		datatype: "Quantity"
	},
	{
		property: "P1539",
		label: "female population",
		datatype: "Quantity"
	},
	{
		property: "P1540",
		label: "male population",
		datatype: "Quantity"
	},
	{
		property: "P1541",
		label: "Cycling Quotient male cyclist ID",
		datatype: "ExternalId"
	},
	{
		property: "P1542",
		label: "cause of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1543",
		label: "monogram",
		datatype: "CommonsMedia"
	},
	{
		property: "P1544",
		label: "Federal Register Document Number",
		datatype: "ExternalId"
	},
	{
		property: "P1545",
		label: "series ordinal",
		datatype: "String"
	},
	{
		property: "P1546",
		label: "motto",
		datatype: "WikibaseItem"
	},
	{
		property: "P1547",
		label: "depends on software",
		datatype: "WikibaseItem"
	},
	{
		property: "P3899",
		label: "Medium username",
		datatype: "ExternalId"
	},
	{
		property: "P3900",
		label: "CONICET person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3901",
		label: "ADAGP artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P3902",
		label: "had as last meal",
		datatype: "WikibaseItem"
	},
	{
		property: "P3903",
		label: "column",
		datatype: "String"
	},
	{
		property: "P3904",
		label: "VIVC grape variety ID",
		datatype: "ExternalId"
	},
	{
		property: "P3905",
		label: "GINCO ID",
		datatype: "ExternalId"
	},
	{
		property: "P3906",
		label: "Ishim ID",
		datatype: "ExternalId"
	},
	{
		property: "P3907",
		label: "LoJ peak ID",
		datatype: "ExternalId"
	},
	{
		property: "P3908",
		label: "Reprezentacija ID",
		datatype: "ExternalId"
	},
	{
		property: "P3909",
		label: "last words",
		datatype: "Monolingualtext"
	},
	{
		property: "P3910",
		label: "Bollywood Hungama person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3911",
		label: "STW Thesaurus for Economics ID",
		datatype: "ExternalId"
	},
	{
		property: "P3912",
		label: "newspaper format",
		datatype: "WikibaseItem"
	},
	{
		property: "P3913",
		label: "MobyGames developer ID",
		datatype: "ExternalId"
	},
	{
		property: "P3914",
		label: "GuideStar Israel organization ID",
		datatype: "ExternalId"
	},
	{
		property: "P3915",
		label: "Athletics Australia athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3916",
		label: "UNESCO Thesaurus ID",
		datatype: "ExternalId"
	},
	{
		property: "P3917",
		label: "IPA number order",
		datatype: "Quantity"
	},
	{
		property: "P3918",
		label: "Répertoire national des associations identifier",
		datatype: "ExternalId"
	},
	{
		property: "P3919",
		label: "contributed to published work",
		datatype: "WikibaseItem"
	},
	{
		property: "P3920",
		label: "Canadian Coastguard Lighthouse ID",
		datatype: "ExternalId"
	},
	{
		property: "P3921",
		label: "Wikidata SPARQL query equivalent",
		datatype: "String"
	},
	{
		property: "P3922",
		label: "light sector",
		datatype: "String"
	},
	{
		property: "P3923",
		label: "Diamond League athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3924",
		label: "Track and Field Statistics female athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3925",
		label: "Track and Field Statistics male athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3926",
		label: "USATF athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3927",
		label: "eWRC-results.com racer ID",
		datatype: "ExternalId"
	},
	{
		property: "P3928",
		label: "MotoGP racer ID",
		datatype: "ExternalId"
	},
	{
		property: "P3929",
		label: "V&A art work ID",
		datatype: "ExternalId"
	},
	{
		property: "P3930",
		label: "Rallye-info.com driver or co-driver ID",
		datatype: "ExternalId"
	},
	{
		property: "P3931",
		label: "copyright owner",
		datatype: "WikibaseItem"
	},
	{
		property: "P3932",
		label: "Digital Valencian Library author ID",
		datatype: "ExternalId"
	},
	{
		property: "P3933",
		label: "Cinema ID",
		datatype: "ExternalId"
	},
	{
		property: "P3934",
		label: "face value",
		datatype: "Quantity"
	},
	{
		property: "P3935",
		label: "Chamber of Deputies of Italy storia ID",
		datatype: "ExternalId"
	},
	{
		property: "P3936",
		label: "NFF person profile ID",
		datatype: "ExternalId"
	},
	{
		property: "P3937",
		label: "Reactome pathway ID",
		datatype: "ExternalId"
	},
	{
		property: "P3938",
		label: "named by",
		datatype: "WikibaseItem"
	},
	{
		property: "P3939",
		label: "ESTC citation number",
		datatype: "ExternalId"
	},
	{
		property: "P3940",
		label: "OlimpBase Chess Olympiad player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3941",
		label: "Israel Antiquities Authority ID",
		datatype: "ExternalId"
	},
	{
		property: "P3942",
		label: "Bmx-results.com rider ID",
		datatype: "ExternalId"
	},
	{
		property: "P3943",
		label: "Tumblr ID",
		datatype: "ExternalId"
	},
	{
		property: "P3944",
		label: "Old Bailey Proceedings ID",
		datatype: "ExternalId"
	},
	{
		property: "P3945",
		label: "RANM member ID",
		datatype: "ExternalId"
	},
	{
		property: "P3946",
		label: "Directorio Grierson ID",
		datatype: "ExternalId"
	},
	{
		property: "P3948",
		label: "MLL player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3949",
		label: "Juwra.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P3950",
		label: "narrower external class",
		datatype: "Url"
	},
	{
		property: "P3951",
		label: "BioRxiv ID",
		datatype: "ExternalId"
	},
	{
		property: "P3952",
		label: "Stereo Ve Mono artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P3953",
		label: "ALPG golfer ID",
		datatype: "ExternalId"
	},
	{
		property: "P3954",
		label: "Italian Senate ID",
		datatype: "ExternalId"
	},
	{
		property: "P3955",
		label: "NLL player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3956",
		label: "National Academy of Medicine (France) MemberID",
		datatype: "ExternalId"
	},
	{
		property: "P3957",
		label: "RealGM basket-ball player ID",
		datatype: "ExternalId"
	},
	{
		property: "P3958",
		label: "ENARD athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P3959",
		label: "NNL work ID",
		datatype: "ExternalId"
	},
	{
		property: "P3960",
		label: "Base biographique AUTOR ID",
		datatype: "ExternalId"
	},
	{
		property: "P3961",
		label: "Unifrance film ID",
		datatype: "ExternalId"
	},
	{
		property: "P3962",
		label: "Global Trade Item Number",
		datatype: "ExternalId"
	},
	{
		property: "P3963",
		label: "Clochers de France ID",
		datatype: "ExternalId"
	},
	{
		property: "P3964",
		label: "BDCYL authority ID",
		datatype: "ExternalId"
	},
	{
		property: "P3965",
		label: "Bridgeman artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P3966",
		label: "programming paradigm",
		datatype: "WikibaseItem"
	},
	{
		property: "P3967",
		label: "final event",
		datatype: "WikibaseItem"
	},
	{
		property: "P3968",
		label: "CETS number",
		datatype: "ExternalId"
	},
	{
		property: "P3969",
		label: "signed form",
		datatype: "WikibaseItem"
	},
	{
		property: "P3970",
		label: "channel number",
		datatype: "String"
	},
	{
		property: "P3971",
		label: "PASE Domesday person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3972",
		label: "PASE Domesday place",
		datatype: "ExternalId"
	},
	{
		property: "P3973",
		label: "PIM authority ID",
		datatype: "ExternalId"
	},
	{
		property: "P3974",
		label: "nature preserve in North Rhine-Westphalia ID",
		datatype: "ExternalId"
	},
	{
		property: "P3975",
		label: "secretary general",
		datatype: "WikibaseItem"
	},
	{
		property: "P3976",
		label: "BVMC work ID",
		datatype: "ExternalId"
	},
	{
		property: "P3977",
		label: "Songkick venue ID",
		datatype: "ExternalId"
	},
	{
		property: "P3978",
		label: "IECIC 2015 ID",
		datatype: "ExternalId"
	},
	{
		property: "P3979",
		label: "Unifrance company ID",
		datatype: "ExternalId"
	},
	{
		property: "P3980",
		label: "Unifrance person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3981",
		label: "Misjonsarkiv person ID",
		datatype: "ExternalId"
	},
	{
		property: "P3982",
		label: "TA98 Latin term",
		datatype: "ExternalId"
	},
	{
		property: "P3983",
		label: "sports league level",
		datatype: "Quantity"
	},
	{
		property: "P3984",
		label: "subreddit",
		datatype: "ExternalId"
	},
	{
		property: "P3985",
		label: "supports programming language",
		datatype: "WikibaseItem"
	},
	{
		property: "P3986",
		label: "Sequence Ontology ID",
		datatype: "ExternalId"
	},
	{
		property: "P3987",
		label: "SHARE Catalogue author ID",
		datatype: "ExternalId"
	},
	{
		property: "P3988",
		label: "National Library Board Singapore ID",
		datatype: "ExternalId"
	},
	{
		property: "P3989",
		label: "members have occupation",
		datatype: "WikibaseItem"
	},
	{
		property: "P3990",
		label: "EKATTE place ID",
		datatype: "ExternalId"
	},
	{
		property: "P3991",
		label: "Austrian Textbook ID",
		datatype: "ExternalId"
	},
	{
		property: "P3992",
		label: "SSB urban settlement number",
		datatype: "ExternalId"
	},
	{
		property: "P3993",
		label: "Vitaskrá ID",
		datatype: "ExternalId"
	},
	{
		property: "P3994",
		label: "racon signal",
		datatype: "String"
	},
	{
		property: "P3995",
		label: "Filmweb.pl ID",
		datatype: "ExternalId"
	},
	{
		property: "P3996",
		label: "Bait La Zemer Ha-Ivri song ID",
		datatype: "ExternalId"
	},
	{
		property: "P3997",
		label: "Bait La Zemer Ha-Ivri artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P3998",
		label: "Censo-Guía archive ID",
		datatype: "ExternalId"
	},
	{
		property: "P3999",
		label: "date of official closure",
		datatype: "Time"
	},
	{
		property: "P1548",
		label: "maximum Strahler number",
		datatype: "Quantity"
	},
	{
		property: "P1549",
		label: "demonym",
		datatype: "Monolingualtext"
	},
	{
		property: "P1550",
		label: "Orphanet ID",
		datatype: "ExternalId"
	},
	{
		property: "P1551",
		label: "Exceptional heritage of Wallonia ID",
		datatype: "ExternalId"
	},
	{
		property: "P1552",
		label: "has quality",
		datatype: "WikibaseItem"
	},
	{
		property: "P1553",
		label: "Yandex.Music artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P1554",
		label: "UBERON ID",
		datatype: "ExternalId"
	},
	{
		property: "P1555",
		label: "Executive Order number",
		datatype: "ExternalId"
	},
	{
		property: "P1556",
		label: "zbMATH author ID",
		datatype: "ExternalId"
	},
	{
		property: "P1557",
		label: "manifestation of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1558",
		label: "tempo marking",
		datatype: "WikibaseItem"
	},
	{
		property: "P1559",
		label: "name in native language",
		datatype: "Monolingualtext"
	},
	{
		property: "P1560",
		label: "given name version for other gender",
		datatype: "WikibaseItem"
	},
	{
		property: "P1561",
		label: "number of survivors",
		datatype: "Quantity"
	},
	{
		property: "P1562",
		label: "AllMovie movie ID",
		datatype: "ExternalId"
	},
	{
		property: "P1563",
		label: "MacTutor id (biographies)",
		datatype: "ExternalId"
	},
	{
		property: "P1564",
		label: "At the Circulating Library ID",
		datatype: "ExternalId"
	},
	{
		property: "P1565",
		label: "Enciclopedia de la Literatura en México ID",
		datatype: "ExternalId"
	},
	{
		property: "P1566",
		label: "GeoNames ID",
		datatype: "ExternalId"
	},
	{
		property: "P1567",
		label: "NIS/INS code",
		datatype: "ExternalId"
	},
	{
		property: "P1568",
		label: "domain",
		datatype: "WikibaseItem"
	},
	{
		property: "P1571",
		label: "codomain",
		datatype: "WikibaseItem"
	},
	{
		property: "P1573",
		label: "BBC Genome ID",
		datatype: "ExternalId"
	},
	{
		property: "P1574",
		label: "exemplar of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1575",
		label: "RISS catalog",
		datatype: "ExternalId"
	},
	{
		property: "P1576",
		label: "lifestyle",
		datatype: "WikibaseItem"
	},
	{
		property: "P1577",
		label: "Gregory-Aland-Number",
		datatype: "ExternalId"
	},
	{
		property: "P1578",
		label: "Gmelin number",
		datatype: "ExternalId"
	},
	{
		property: "P1579",
		label: "Beilstein Registry Number",
		datatype: "ExternalId"
	},
	{
		property: "P1580",
		label: "University of Barcelona authority ID",
		datatype: "ExternalId"
	},
	{
		property: "P1581",
		label: "official blog",
		datatype: "Url"
	},
	{
		property: "P1582",
		label: "natural product of taxon",
		datatype: "WikibaseItem"
	},
	{
		property: "P1583",
		label: "MalaCards ID",
		datatype: "ExternalId"
	},
	{
		property: "P1584",
		label: "Pleiades ID",
		datatype: "ExternalId"
	},
	{
		property: "P1585",
		label: "Brazilian municipality code",
		datatype: "ExternalId"
	},
	{
		property: "P1586",
		label: "Catalan object of cultural interest ID",
		datatype: "ExternalId"
	},
	{
		property: "P1587",
		label: "Slovene Cultural Heritage Register ID",
		datatype: "ExternalId"
	},
	{
		property: "P1588",
		label: "desa code of Indonesia",
		datatype: "String"
	},
	{
		property: "P1589",
		label: "deepest point",
		datatype: "WikibaseItem"
	},
	{
		property: "P1590",
		label: "number of casualties",
		datatype: "Quantity"
	},
	{
		property: "P1591",
		label: "defendant",
		datatype: "WikibaseItem"
	},
	{
		property: "P1592",
		label: "prosecutor",
		datatype: "WikibaseItem"
	},
	{
		property: "P1593",
		label: "defender",
		datatype: "WikibaseItem"
	},
	{
		property: "P1594",
		label: "judge",
		datatype: "WikibaseItem"
	},
	{
		property: "P1595",
		label: "charge",
		datatype: "WikibaseItem"
	},
	{
		property: "P1596",
		label: "penalty",
		datatype: "WikibaseItem"
	},
	{
		property: "P1598",
		label: "consecrator",
		datatype: "WikibaseItem"
	},
	{
		property: "P1599",
		label: "Cambridge Alumni Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P1600",
		label: "code Inventari del Patrimoni Arquitectònic de Catalunya",
		datatype: "ExternalId"
	},
	{
		property: "P1601",
		label: "Esperantist ID",
		datatype: "ExternalId"
	},
	{
		property: "P1602",
		label: "Art UK venue ID",
		datatype: "ExternalId"
	},
	{
		property: "P1603",
		label: "number of cases",
		datatype: "Quantity"
	},
	{
		property: "P1604",
		label: "biosafety level",
		datatype: "WikibaseItem"
	},
	{
		property: "P1605",
		label: "has natural reservoir",
		datatype: "WikibaseItem"
	},
	{
		property: "P1606",
		label: "natural reservoir of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1607",
		label: "Dialnet author ID",
		datatype: "ExternalId"
	},
	{
		property: "P1608",
		label: "Dialnet book ID",
		datatype: "ExternalId"
	},
	{
		property: "P1609",
		label: "Dialnet journal",
		datatype: "ExternalId"
	},
	{
		property: "P1610",
		label: "Dialnet article",
		datatype: "ExternalId"
	},
	{
		property: "P1611",
		label: "NATO code for grade",
		datatype: "WikibaseItem"
	},
	{
		property: "P1612",
		label: "Commons Institution page",
		datatype: "String"
	},
	{
		property: "P1613",
		label: "IRC channel",
		datatype: "Url"
	},
	{
		property: "P1614",
		label: "History of Parliament ID",
		datatype: "ExternalId"
	},
	{
		property: "P1615",
		label: "CLARA-ID",
		datatype: "ExternalId"
	},
	{
		property: "P1616",
		label: "SIREN number",
		datatype: "ExternalId"
	},
	{
		property: "P1617",
		label: "BBC Things ID",
		datatype: "ExternalId"
	},
	{
		property: "P1618",
		label: "sport number",
		datatype: "String"
	},
	{
		property: "P1619",
		label: "date of official opening",
		datatype: "Time"
	},
	{
		property: "P1620",
		label: "plaintiff",
		datatype: "WikibaseItem"
	},
	{
		property: "P1621",
		label: "detail map",
		datatype: "CommonsMedia"
	},
	{
		property: "P1622",
		label: "driving side",
		datatype: "WikibaseItem"
	},
	{
		property: "P1624",
		label: "MarineTraffic Port ID",
		datatype: "ExternalId"
	},
	{
		property: "P1625",
		label: "has melody",
		datatype: "WikibaseItem"
	},
	{
		property: "P1626",
		label: "Thai cultural heritage ID",
		datatype: "ExternalId"
	},
	{
		property: "P1627",
		label: "Ethnologue.com code",
		datatype: "ExternalId"
	},
	{
		property: "P1628",
		label: "equivalent property",
		datatype: "Url"
	},
	{
		property: "P1629",
		label: "subject item of this property",
		datatype: "WikibaseItem"
	},
	{
		property: "P1630",
		label: "formatter URL",
		datatype: "String"
	},
	{
		property: "P1631",
		label: "China Vitae ID",
		datatype: "ExternalId"
	},
	{
		property: "P1632",
		label: "Hermann-Mauguin notation",
		datatype: "ExternalId"
	},
	{
		property: "P1635",
		label: "religious name",
		datatype: "Monolingualtext"
	},
	{
		property: "P1636",
		label: "date of baptism in early childhood",
		datatype: "Time"
	},
	{
		property: "P1637",
		label: "undercarriage",
		datatype: "WikibaseItem"
	},
	{
		property: "P1638",
		label: "codename",
		datatype: "Monolingualtext"
	},
	{
		property: "P1639",
		label: "pendant of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1640",
		label: "curator",
		datatype: "WikibaseItem"
	},
	{
		property: "P1641",
		label: "port",
		datatype: "Quantity"
	},
	{
		property: "P1642",
		label: "acquisition transaction",
		datatype: "WikibaseItem"
	},
	{
		property: "P1643",
		label: "departure transaction",
		datatype: "WikibaseItem"
	},
	{
		property: "P1644",
		label: "EgliseInfo ID",
		datatype: "ExternalId"
	},
	{
		property: "P1645",
		label: "NIST/CODATA ID",
		datatype: "ExternalId"
	},
	{
		property: "P1646",
		label: "mandatory qualifier",
		datatype: "WikibaseProperty"
	},
	{
		property: "P1647",
		label: "subproperty of",
		datatype: "WikibaseProperty"
	},
	{
		property: "P1648",
		label: "Dictionary of Welsh Biography ID",
		datatype: "ExternalId"
	},
	{
		property: "P1649",
		label: "KMDb person ID",
		datatype: "ExternalId"
	},
	{
		property: "P1650",
		label: "BBF ID",
		datatype: "ExternalId"
	},
	{
		property: "P1651",
		label: "YouTube video ID",
		datatype: "ExternalId"
	},
	{
		property: "P1652",
		label: "referee",
		datatype: "WikibaseItem"
	},
	{
		property: "P1653",
		label: "TERYT municipality code",
		datatype: "ExternalId"
	},
	{
		property: "P1654",
		label: "wing configuration",
		datatype: "WikibaseItem"
	},
	{
		property: "P4000",
		label: "has fruit type",
		datatype: "WikibaseItem"
	},
	{
		property: "P4001",
		label: "Latvian Protected Nature Territory URL",
		datatype: "Url"
	},
	{
		property: "P4002",
		label: "WFD Ecological status",
		datatype: "WikibaseItem"
	},
	{
		property: "P4003",
		label: "official Facebook page",
		datatype: "ExternalId"
	},
	{
		property: "P4004",
		label: "shield image",
		datatype: "CommonsMedia"
	},
	{
		property: "P4005",
		label: "Bavarikon ID",
		datatype: "ExternalId"
	},
	{
		property: "P4006",
		label: "overrules",
		datatype: "WikibaseItem"
	},
	{
		property: "P4007",
		label: "DBS ID",
		datatype: "ExternalId"
	},
	{
		property: "P4008",
		label: "Early Aviators people ID",
		datatype: "ExternalId"
	},
	{
		property: "P4009",
		label: "RKY national built heritage environment ID",
		datatype: "ExternalId"
	},
	{
		property: "P4010",
		label: "GDP (PPP)",
		datatype: "Quantity"
	},
	{
		property: "P4011",
		label: "Semantic Scholar paper ID",
		datatype: "ExternalId"
	},
	{
		property: "P4012",
		label: "Semantic Scholar author ID",
		datatype: "ExternalId"
	},
	{
		property: "P4013",
		label: "Giphy username",
		datatype: "ExternalId"
	},
	{
		property: "P4014",
		label: "Australian Statistical Geography 2011 ID",
		datatype: "ExternalId"
	},
	{
		property: "P4015",
		label: "Vimeo username",
		datatype: "ExternalId"
	},
	{
		property: "P4016",
		label: "SlideShare username",
		datatype: "ExternalId"
	},
	{
		property: "P4017",
		label: "Ustream username",
		datatype: "ExternalId"
	},
	{
		property: "P4018",
		label: "The Arabidopsis Information Resource Accession",
		datatype: "ExternalId"
	},
	{
		property: "P4019",
		label: "USL player ID",
		datatype: "ExternalId"
	},
	{
		property: "P4020",
		label: "dimension",
		datatype: "Math"
	},
	{
		property: "P4021",
		label: "danskefilm animated film ID",
		datatype: "ExternalId"
	},
	{
		property: "P4022",
		label: "danskefilm TV series ID",
		datatype: "ExternalId"
	},
	{
		property: "P4023",
		label: "DFB datacenter player ID",
		datatype: "ExternalId"
	},
	{
		property: "P4024",
		label: "ADW taxon ID",
		datatype: "ExternalId"
	},
	{
		property: "P4025",
		label: "Pinakothek artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P4026",
		label: "Cullum number",
		datatype: "ExternalId"
	},
	{
		property: "P4027",
		label: "DNCI work ID",
		datatype: "ExternalId"
	},
	{
		property: "P4028",
		label: "Google Scholar paper ID",
		datatype: "ExternalId"
	},
	{
		property: "P4029",
		label: "Latvian Protected Nature Territory ID",
		datatype: "ExternalId"
	},
	{
		property: "P4030",
		label: "PLU Code",
		datatype: "ExternalId"
	},
	{
		property: "P4031",
		label: "Hungarian NGO ID",
		datatype: "ExternalId"
	},
	{
		property: "P4032",
		label: "reviewed by",
		datatype: "WikibaseItem"
	},
	{
		property: "P4033",
		label: "Mastodon address",
		datatype: "ExternalId"
	},
	{
		property: "P4034",
		label: "Shironet artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P4035",
		label: "Shironet song ID",
		datatype: "ExternalId"
	},
	{
		property: "P4036",
		label: "field of view",
		datatype: "Quantity"
	},
	{
		property: "P4037",
		label: "South Australian Heritage Register Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P4038",
		label: "Danish List of Lights and Fog signals ID",
		datatype: "ExternalId"
	},
	{
		property: "P4039",
		label: "Rock.com.ar biography ID",
		datatype: "ExternalId"
	},
	{
		property: "P4040",
		label: "Rock.com.ar artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P4041",
		label: "Rock.com.ar album ID",
		datatype: "ExternalId"
	},
	{
		property: "P4042",
		label: "ESBL athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P4043",
		label: "emulates",
		datatype: "WikibaseItem"
	},
	{
		property: "P4044",
		label: "therapeutic area",
		datatype: "WikibaseItem"
	},
	{
		property: "P4045",
		label: "Sandbox-Tabular data",
		datatype: "TabularData"
	},
	{
		property: "P4046",
		label: "SIMC place ID",
		datatype: "ExternalId"
	},
	{
		property: "P4047",
		label: "Sandbox-Geographic shape",
		datatype: "GeoShape"
	},
	{
		property: "P4048",
		label: "J.League manager ID",
		datatype: "ExternalId"
	},
	{
		property: "P4050",
		label: "EspritBleu athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P4051",
		label: "Ukrainian regulations base ID",
		datatype: "ExternalId"
	},
	{
		property: "P4052",
		label: "Academia.edu institutional ID",
		datatype: "ExternalId"
	},
	{
		property: "P4053",
		label: "Deutsche Olympiamannschaft athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P4054",
		label: "Canadian Olympic Committee athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P4055",
		label: "Norwegian List of Lights ID",
		datatype: "ExternalId"
	},
	{
		property: "P4056",
		label: "New Zealand Olympic Committee athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P4057",
		label: "Irish Sites and Monuments Record ID",
		datatype: "ExternalId"
	},
	{
		property: "P4058",
		label: "FINESS medical facility ID",
		datatype: "ExternalId"
	},
	{
		property: "P4059",
		label: "Irish National Monument ID",
		datatype: "ExternalId"
	},
	{
		property: "P4060",
		label: "Brazilian Olympic Committee athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P4061",
		label: "LTOK athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P4062",
		label: "ČOV athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P4063",
		label: "United States Olympic Committee athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P4065",
		label: "COA athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P4066",
		label: "MOB athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P4067",
		label: "COSR athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P4068",
		label: "CIS Chinese Athletes Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P4069",
		label: "CONI athlete ID",
		datatype: "ExternalId"
	},
	{
		property: "P4070",
		label: "identifier shared with",
		datatype: "WikibaseItem"
	},
	{
		property: "P4071",
		label: "Zemereshet artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P4072",
		label: "Zemereshet song ID",
		datatype: "ExternalId"
	},
	{
		property: "P4073",
		label: "Wikia wiki ID",
		datatype: "ExternalId"
	},
	{
		property: "P4074",
		label: "FFN swimmer ID",
		datatype: "ExternalId"
	},
	{
		property: "P4075",
		label: "Czech Monument Catalogue Number",
		datatype: "ExternalId"
	},
	{
		property: "P4076",
		label: "WorldSBK.com racer identifier",
		datatype: "ExternalId"
	},
	{
		property: "P4077",
		label: "Pizmonet ID",
		datatype: "ExternalId"
	},
	{
		property: "P4078",
		label: "SKIP code",
		datatype: "String"
	},
	{
		property: "P4079",
		label: "Theatres Trust Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P4080",
		label: "number of houses",
		datatype: "Quantity"
	},
	{
		property: "P4081",
		label: "BHL creator ID",
		datatype: "ExternalId"
	},
	{
		property: "P4082",
		label: "image captured with",
		datatype: "WikibaseItem"
	},
	{
		property: "P4083",
		label: "NPS unit ID",
		datatype: "ExternalId"
	},
	{
		property: "P4084",
		label: "MyAnimeList people ID",
		datatype: "ExternalId"
	},
	{
		property: "P4085",
		label: "MyAnimeList character ID",
		datatype: "ExternalId"
	},
	{
		property: "P4086",
		label: "MyAnimeList anime ID",
		datatype: "ExternalId"
	},
	{
		property: "P4087",
		label: "MyAnimeList manga ID",
		datatype: "ExternalId"
	},
	{
		property: "P4088",
		label: "Irish National Inventory of Architectural Heritage ID",
		datatype: "ExternalId"
	},
	{
		property: "P4089",
		label: "Global Terrorism Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P4090",
		label: "Biodiversity Repository ID",
		datatype: "ExternalId"
	},
	{
		property: "P4091",
		label: "Irish Grid Reference",
		datatype: "ExternalId"
	},
	{
		property: "P4092",
		label: "checksum",
		datatype: "String"
	},
	{
		property: "P4093",
		label: "Australian Statistical Geography 2016 ID",
		datatype: "ExternalId"
	},
	{
		property: "P4094",
		label: "Australian Standard Geographic Classification 2006 ID",
		datatype: "ExternalId"
	},
	{
		property: "P4095",
		label: "Principal Galaxies Catalogue ID",
		datatype: "ExternalId"
	},
	{
		property: "P4096",
		label: "RePEc institute ID",
		datatype: "ExternalId"
	},
	{
		property: "P4097",
		label: "MuseScore ID",
		datatype: "ExternalId"
	},
	{
		property: "P4098",
		label: "BVMC place id",
		datatype: "ExternalId"
	},
	{
		property: "P4099",
		label: "metrically compatible typeface",
		datatype: "WikibaseItem"
	},
	{
		property: "P4100",
		label: "parliamentary group",
		datatype: "WikibaseItem"
	},
	{
		property: "P4101",
		label: "dissertation submitted to",
		datatype: "WikibaseItem"
	},
	{
		property: "P4102",
		label: "Atlas of Hillforts ID",
		datatype: "ExternalId"
	},
	{
		property: "P4103",
		label: "assets under management",
		datatype: "Quantity"
	},
	{
		property: "P4104",
		label: "Carnegie Hall agent ID",
		datatype: "ExternalId"
	},
	{
		property: "P4105",
		label: "EGF rating",
		datatype: "Quantity"
	},
	{
		property: "P4106",
		label: "Finnish archaeological heritage ID",
		datatype: "ExternalId"
	},
	{
		property: "P4107",
		label: "Framalibre ID",
		datatype: "ExternalId"
	},
	{
		property: "P4108",
		label: "Gedbas genealogy person ID",
		datatype: "ExternalId"
	},
	{
		property: "P4109",
		label: "URN-NBN",
		datatype: "ExternalId"
	},
	{
		property: "P4110",
		label: "Crunchyroll ID",
		datatype: "ExternalId"
	},
	{
		property: "P4111",
		label: "danskefilm TV Christmas calendar",
		datatype: "ExternalId"
	},
	{
		property: "P4112",
		label: "danskfilmogtv person",
		datatype: "ExternalId"
	},
	{
		property: "P4113",
		label: "FRED time-series ID",
		datatype: "ExternalId"
	},
	{
		property: "P4114",
		label: "ADK member ID",
		datatype: "ExternalId"
	},
	{
		property: "P4115",
		label: "INSPIRE ID",
		datatype: "ExternalId"
	},
	{
		property: "P4116",
		label: "JewAge person ID",
		datatype: "ExternalId"
	},
	{
		property: "P4117",
		label: "National Record of the Historic Environment ID",
		datatype: "ExternalId"
	},
	{
		property: "P4118",
		label: "NLS-FI Geographic Name ID",
		datatype: "ExternalId"
	},
	{
		property: "P4119",
		label: "NLS Geographic Names Place ID",
		datatype: "ExternalId"
	},
	{
		property: "P4120",
		label: "Ontario Heritage Act Register ID",
		datatype: "ExternalId"
	},
	{
		property: "P4121",
		label: "openAIP ID",
		datatype: "ExternalId"
	},
	{
		property: "P4122",
		label: "PalDat plant ID",
		datatype: "ExternalId"
	},
	{
		property: "P4123",
		label: "French National Assembly ID",
		datatype: "ExternalId"
	},
	{
		property: "P4124",
		label: "Who's Who in France biography ID",
		datatype: "ExternalId"
	},
	{
		property: "P4125",
		label: "Titan ID",
		datatype: "ExternalId"
	},
	{
		property: "P4126",
		label: "ESEC person ID",
		datatype: "ExternalId"
	},
	{
		property: "P4127",
		label: "EmbassyPages.com ID",
		datatype: "ExternalId"
	},
	{
		property: "P4128",
		label: "NPSN Indonesian school ID",
		datatype: "ExternalId"
	},
	{
		property: "P4129",
		label: "Cinema Treasures ID",
		datatype: "ExternalId"
	},
	{
		property: "P4130",
		label: "USHMM person ID",
		datatype: "ExternalId"
	},
	{
		property: "P4131",
		label: "annual energy output",
		datatype: "Quantity"
	},
	{
		property: "P4132",
		label: "linguistic typology",
		datatype: "WikibaseItem"
	},
	{
		property: "P4133",
		label: "Patrimonioculturale-ER ID",
		datatype: "ExternalId"
	},
	{
		property: "P4135",
		label: "maximum age",
		datatype: "Quantity"
	},
	{
		property: "P4136",
		label: "WIGOS station ID",
		datatype: "ExternalId"
	},
	{
		property: "P4137",
		label: "muzzle velocity",
		datatype: "Quantity"
	},
	{
		property: "P4138",
		label: "Treasury of Lives ID",
		datatype: "ExternalId"
	},
	{
		property: "P4139",
		label: "National Assembly of Nigeria ID",
		datatype: "ExternalId"
	},
	{
		property: "P4140",
		label: "energy storage capacity",
		datatype: "Quantity"
	},
	{
		property: "P4141",
		label: "Gatehouse Gazetteer place ID",
		datatype: "ExternalId"
	},
	{
		property: "P4142",
		label: "RIWAQ Registry of Historic Buildings in Palestine ID",
		datatype: "ExternalId"
	},
	{
		property: "P4143",
		label: "Finnish List of Lights ID",
		datatype: "ExternalId"
	},
	{
		property: "P4144",
		label: "Atheneum artwork ID",
		datatype: "ExternalId"
	},
	{
		property: "P4145",
		label: "Atheneum person ID",
		datatype: "ExternalId"
	},
	{
		property: "P4146",
		label: "Atheneum museum ID",
		datatype: "ExternalId"
	},
	{
		property: "P4147",
		label: "conjugate acid",
		datatype: "WikibaseItem"
	},
	{
		property: "P4149",
		label: "conjugate base",
		datatype: "WikibaseItem"
	},
	{
		property: "P4150",
		label: "weather history",
		datatype: "TabularData"
	},
	{
		property: "P4151",
		label: "game mechanics",
		datatype: "WikibaseItem"
	},
	{
		property: "P4152",
		label: "file format identification pattern",
		datatype: "String"
	},
	{
		property: "P4153",
		label: "offset",
		datatype: "Quantity"
	},
	{
		property: "P4154",
		label: "National Forest Foundation ID",
		datatype: "ExternalId"
	},
	{
		property: "P4155",
		label: "separator",
		datatype: "WikibaseProperty"
	},
	{
		property: "P4156",
		label: "Czech Registration ID",
		datatype: "ExternalId"
	},
	{
		property: "P4157",
		label: "MEG ID",
		datatype: "ExternalId"
	},
	{
		property: "P4158",
		label: "autores.ar id",
		datatype: "ExternalId"
	},
	{
		property: "P4159",
		label: "WeRelate person ID",
		datatype: "ExternalId"
	},
	{
		property: "P4160",
		label: "Michelin Restaurants ID",
		datatype: "ExternalId"
	},
	{
		property: "P4161",
		label: "Michelin Voyages ID",
		datatype: "ExternalId"
	},
	{
		property: "P4162",
		label: "AUR package",
		datatype: "ExternalId"
	},
	{
		property: "P4163",
		label: "magnification",
		datatype: "Quantity"
	},
	{
		property: "P4164",
		label: "National Baseball Hall of Fame and Museum ID",
		datatype: "ExternalId"
	},
	{
		property: "P4165",
		label: "CODECS ID",
		datatype: "ExternalId"
	},
	{
		property: "P4166",
		label: "Georgian National Register of Monuments ID",
		datatype: "ExternalId"
	},
	{
		property: "P4167",
		label: "Dagens Næringsliv topic ID",
		datatype: "ExternalId"
	},
	{
		property: "P4168",
		label: "IEDB Epitope ID",
		datatype: "ExternalId"
	},
	{
		property: "P4169",
		label: "YCBA agent ID",
		datatype: "ExternalId"
	},
	{
		property: "P4170",
		label: "eParks unit ID",
		datatype: "ExternalId"
	},
	{
		property: "P4171",
		label: "World Heritage Tentative List ID",
		datatype: "ExternalId"
	},
	{
		property: "P4172",
		label: "America's Byways road ID",
		datatype: "ExternalId"
	},
	{
		property: "P4173",
		label: "Instagram location ID",
		datatype: "ExternalId"
	},
	{
		property: "P4174",
		label: "Wikimedia username",
		datatype: "ExternalId"
	},
	{
		property: "P4175",
		label: "Patreon person ID",
		datatype: "ExternalId"
	},
	{
		property: "P4176",
		label: "effective firing range",
		datatype: "Quantity"
	},
	{
		property: "P4177",
		label: "Finnish National Gallery person ID",
		datatype: "ExternalId"
	},
	{
		property: "P4178",
		label: "Beazley Archive Pottery Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P4179",
		label: "tabular population",
		datatype: "TabularData"
	},
	{
		property: "P1656",
		label: "unveiled by",
		datatype: "WikibaseItem"
	},
	{
		property: "P1657",
		label: "MPAA film rating",
		datatype: "WikibaseItem"
	},
	{
		property: "P1659",
		label: "see also",
		datatype: "WikibaseProperty"
	},
	{
		property: "P1660",
		label: "has index case",
		datatype: "WikibaseItem"
	},
	{
		property: "P1661",
		label: "Alexa rank",
		datatype: "Quantity"
	},
	{
		property: "P1662",
		label: "DOI Prefix",
		datatype: "ExternalId"
	},
	{
		property: "P1663",
		label: "ProCyclingStats cyclist ID",
		datatype: "ExternalId"
	},
	{
		property: "P1664",
		label: "Cycling Database ID",
		datatype: "ExternalId"
	},
	{
		property: "P1665",
		label: "Chess Games ID",
		datatype: "ExternalId"
	},
	{
		property: "P1666",
		label: "Chess Club ID",
		datatype: "ExternalId"
	},
	{
		property: "P1667",
		label: "TGN ID",
		datatype: "ExternalId"
	},
	{
		property: "P1668",
		label: "ATCvet",
		datatype: "ExternalId"
	},
	{
		property: "P1669",
		label: "CONA ID",
		datatype: "ExternalId"
	},
	{
		property: "P1670",
		label: "LAC ID",
		datatype: "ExternalId"
	},
	{
		property: "P1671",
		label: "route number",
		datatype: "String"
	},
	{
		property: "P1672",
		label: "this taxon is source of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1673",
		label: "general formula",
		datatype: "String"
	},
	{
		property: "P1674",
		label: "number confirmed",
		datatype: "Quantity"
	},
	{
		property: "P1675",
		label: "number probable",
		datatype: "Quantity"
	},
	{
		property: "P1676",
		label: "number suspected",
		datatype: "Quantity"
	},
	{
		property: "P1677",
		label: "index case of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1678",
		label: "has vertex figure",
		datatype: "WikibaseItem"
	},
	{
		property: "P1679",
		label: "Art UK artwork ID",
		datatype: "ExternalId"
	},
	{
		property: "P1680",
		label: "subtitle",
		datatype: "Monolingualtext"
	},
	{
		property: "P1683",
		label: "quote",
		datatype: "Monolingualtext"
	},
	{
		property: "P1684",
		label: "inscription",
		datatype: "Monolingualtext"
	},
	{
		property: "P1685",
		label: "Pokémon browser number",
		datatype: "String"
	},
	{
		property: "P1686",
		label: "for work",
		datatype: "WikibaseItem"
	},
	{
		property: "P1687",
		label: "Wikidata property",
		datatype: "WikibaseProperty"
	},
	{
		property: "P1688",
		label: "AniDB ID",
		datatype: "ExternalId"
	},
	{
		property: "P1689",
		label: "central government debt as a percent of GDP",
		datatype: "Quantity"
	},
	{
		property: "P1690",
		label: "ICD-10-PCS",
		datatype: "ExternalId"
	},
	{
		property: "P1691",
		label: "operations and procedures key (OPS)",
		datatype: "ExternalId"
	},
	{
		property: "P1692",
		label: "ICD-9-CM",
		datatype: "String"
	},
	{
		property: "P1693",
		label: "Terminologia Embryologica",
		datatype: "ExternalId"
	},
	{
		property: "P1694",
		label: "Terminologia Histologica",
		datatype: "ExternalId"
	},
	{
		property: "P1695",
		label: "NLP ID",
		datatype: "ExternalId"
	},
	{
		property: "P1696",
		label: "inverse of",
		datatype: "WikibaseProperty"
	},
	{
		property: "P1697",
		label: "total valid votes",
		datatype: "Quantity"
	},
	{
		property: "P1699",
		label: "SkyscraperPage building id",
		datatype: "ExternalId"
	},
	{
		property: "P1700",
		label: "SIPA ID",
		datatype: "ExternalId"
	},
	{
		property: "P1702",
		label: "IGESPAR ID",
		datatype: "ExternalId"
	},
	{
		property: "P1703",
		label: "is pollinated by",
		datatype: "WikibaseItem"
	},
	{
		property: "P1704",
		label: "is pollinator of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1705",
		label: "native label",
		datatype: "Monolingualtext"
	},
	{
		property: "P1706",
		label: "together with",
		datatype: "WikibaseItem"
	},
	{
		property: "P1707",
		label: "DAAO ID",
		datatype: "ExternalId"
	},
	{
		property: "P1708",
		label: "LfDS object ID",
		datatype: "ExternalId"
	},
	{
		property: "P1709",
		label: "equivalent class",
		datatype: "Url"
	},
	{
		property: "P1710",
		label: "Sächsische Biografie",
		datatype: "ExternalId"
	},
	{
		property: "P1711",
		label: "British Museum person-institution",
		datatype: "ExternalId"
	},
	{
		property: "P1712",
		label: "Metacritic ID",
		datatype: "ExternalId"
	},
	{
		property: "P1713",
		label: "biography at the Bundestag of Germany",
		datatype: "Url"
	},
	{
		property: "P1714",
		label: "Journalisted ID",
		datatype: "ExternalId"
	},
	{
		property: "P1715",
		label: "RKD/ESD (Slovenia) ID",
		datatype: "ExternalId"
	},
	{
		property: "P1716",
		label: "brand",
		datatype: "WikibaseItem"
	},
	{
		property: "P1717",
		label: "SANDRE ID",
		datatype: "ExternalId"
	},
	{
		property: "P1721",
		label: "pinyin transliteration",
		datatype: "String"
	},
	{
		property: "P1725",
		label: "beats per minute",
		datatype: "Quantity"
	},
	{
		property: "P1726",
		label: "Florentine musea Inventario 1890  ID",
		datatype: "ExternalId"
	},
	{
		property: "P1727",
		label: "Flora of North America taxon ID",
		datatype: "ExternalId"
	},
	{
		property: "P1728",
		label: "AllMusic artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P1729",
		label: "AllMusic album ID",
		datatype: "ExternalId"
	},
	{
		property: "P1730",
		label: "AllMusic song ID",
		datatype: "ExternalId"
	},
	{
		property: "P1731",
		label: "Fach",
		datatype: "WikibaseItem"
	},
	{
		property: "P1732",
		label: "Naturbase ID",
		datatype: "ExternalId"
	},
	{
		property: "P1733",
		label: "Steam Application ID",
		datatype: "ExternalId"
	},
	{
		property: "P1734",
		label: "oath of office date",
		datatype: "Time"
	},
	{
		property: "P1735",
		label: "Comedien.ch ID",
		datatype: "ExternalId"
	},
	{
		property: "P1736",
		label: "Information Center for Israeli Art artist ID",
		datatype: "ExternalId"
	},
	{
		property: "P1738",
		label: "Merck Index monograph",
		datatype: "ExternalId"
	},
	{
		property: "P1739",
		label: "CiNii book ID",
		datatype: "ExternalId"
	},
	{
		property: "P1740",
		label: "category for films shot at this location",
		datatype: "WikibaseItem"
	},
	{
		property: "P1741",
		label: "GTAA ID",
		datatype: "ExternalId"
	},
	{
		property: "P1743",
		label: "Bradley and Fletcher checklist number",
		datatype: "ExternalId"
	},
	{
		property: "P1744",
		label: "Agassiz checklist number",
		datatype: "ExternalId"
	},
	{
		property: "P1745",
		label: "VASCAN ID",
		datatype: "ExternalId"
	},
	{
		property: "P1746",
		label: "ZooBank nomenclatural act",
		datatype: "ExternalId"
	},
	{
		property: "P1747",
		label: "Flora of China ID",
		datatype: "ExternalId"
	},
	{
		property: "P1748",
		label: "NCI Thesaurus ID",
		datatype: "String"
	},
	{
		property: "P1749",
		label: "Parlement & Politiek ID",
		datatype: "ExternalId"
	},
	{
		property: "P1750",
		label: "name day",
		datatype: "WikibaseItem"
	},
	{
		property: "P1751",
		label: "Art UK collection ID",
		datatype: "ExternalId"
	},
	{
		property: "P1752",
		label: "scale",
		datatype: "Quantity"
	},
	{
		property: "P1753",
		label: "list related to category",
		datatype: "WikibaseItem"
	},
	{
		property: "P1754",
		label: "category related to list",
		datatype: "WikibaseItem"
	},
	{
		property: "P1755",
		label: "Aviation Safety Network accident ID",
		datatype: "ExternalId"
	},
	{
		property: "P1760",
		label: "Aviation Safety Network Wikibase Occurrence",
		datatype: "ExternalId"
	},
	{
		property: "P1761",
		label: "Watson & Dallwitz family ID",
		datatype: "ExternalId"
	},
	{
		property: "P1762",
		label: "Hornbostel-Sachs classification",
		datatype: "String"
	},
	{
		property: "P1763",
		label: "National Pipe Organ Register ID",
		datatype: "ExternalId"
	},
	{
		property: "P1764",
		label: "Flemish organization for Immovable Heritage relict ID",
		datatype: "ExternalId"
	},
	{
		property: "P1766",
		label: "place name sign",
		datatype: "CommonsMedia"
	},
	{
		property: "P1769",
		label: "denkXweb identifier",
		datatype: "ExternalId"
	},
	{
		property: "P1770",
		label: "Romania LMI code",
		datatype: "ExternalId"
	},
	{
		property: "P1771",
		label: "Integrated Postsecondary Education Data System ID",
		datatype: "ExternalId"
	},
	{
		property: "P1772",
		label: "USDA PLANTS ID",
		datatype: "ExternalId"
	},
	{
		property: "P1773",
		label: "attributed to",
		datatype: "WikibaseItem"
	},
	{
		property: "P1774",
		label: "workshop of",
		datatype: "WikibaseItem"
	},
	{
		property: "P1775",
		label: "follower of",
		datatype: "WikibaseItem"
	}
];
var config = {
	property: property
};

var EntityType = new graphql.GraphQLObjectType({
  name: 'Entity',
  description: `Wikidata entity.`,
  fields: () =>
    Object.assign(
      {
        id: {
          description: `Wikidata's item id, for exampe Q42.`,
          type: graphql.GraphQLString
        },
        label: {
          type: graphql.GraphQLString,
          args: {
            lang: {
              name: 'lang',
              type: new graphql.GraphQLNonNull(graphql.GraphQLString)
            }
          }
        }
      },
      _generateNamedPropertyList()
    )
});

const _generateNamedPropertyList = () => {
  let fields = {};
  config.property.forEach(({ property, label, datatype }) => {
    const fieldName = _genFieldNameByLabel(label);
    fields[fieldName] = {
      type: new graphql.GraphQLList(graphql.GraphQLString)
    };
  });

  return fields
};

const _genFieldNameByLabel = label => {
  // genertate property name
  // maximum frequency of audible sound =>  maximum_frequency_of_audible_sound

  // remove some diacritics as in https://www.wikidata.org/wiki/Property:P380
  let newLabel = diacritics.remove(label);

  newLabel = newLabel
    .toLowerCase()
    .replace(/[,()\/\.]/g, '')
    .replace(/[-–]/g, '_') // https://www.wikidata.org/wiki/Property:P2170
    .replace(/[']/g, '_')
    .replace(/[:]/g, '_')
    .replace(/[+]/g, '_')
    .replace(/[&]/g, '_')
    .replace(/[!]/g, '_');

  // https://www.wikidata.org/wiki/Property:P3605
  if (!isNaN(newLabel[0])) {
    newLabel = `p_${newLabel}`;
  }
  return newLabel.split(' ').join('_')
};

const _genFieldNameByLabel$1 = label => {
  // genertate property name
  // maximum frequency of audible sound =>  maximum_frequency_of_audible_sound

  // remove some diacritics as in https://www.wikidata.org/wiki/Property:P380
  let newLabel = diacritics.remove(label);

  newLabel = newLabel
    .toLowerCase()
    .replace(/[,()\/\.]/g, '')
    .replace(/[-–]/g, '_') // https://www.wikidata.org/wiki/Property:P2170
    .replace(/[']/g, '_')
    .replace(/[:]/g, '_')
    .replace(/[+]/g, '_')
    .replace(/[&]/g, '_')
    .replace(/[!]/g, '_');

  // https://www.wikidata.org/wiki/Property:P3605
  if (!isNaN(newLabel[0])) {
    newLabel = `p_${newLabel}`;
  }
  return newLabel.split(' ').join('_')
};
const properties = {};
for (let { property, label, datatype } of config.property) {
  properties[property] = _genFieldNameByLabel$1(label);
}

const client = new DataLoader__default['default'](ids => {
  return getItemsByIds(ids)
});

const getItemsByIds = ids => {
  const url = wdk__default['default'].getEntities({
    ids: ids,
    format: 'json'
  });

  return axios__default['default']
    .get(url)
    .then(function (response) {
      return response.data.entities
    })
    .then(res => {
      return ids.map(id => {
        return new Entity(res[id])
      })
    })
};

class Entity {
  constructor(rawData) {
    this.rawData = rawData;
    this.id = rawData.id;
    this.labels = rawData.labels;
    this._processClaims();
  }

  label({ lang }) {
    const label = this.labels[lang];
    return label && label.value
  }

  _processClaims() {
    const claims = this.rawData.claims;
    for (let key in claims) {
      let label = this._getPropertyLabel(key);
      if (label) {
        this[label] = this._processClaimItems(claims[key]);
      }
    }
  }

  _processClaimItems(value) {
    return value.map(item => {
      return this._processClaimItem(item)
    })
  }

  _processClaimItem(item) {
    // TODO: dealing with other types
    const mainsnak = item.mainsnak;
    return this._processMainSnak(mainsnak)
  }

  async _processMainSnak(mainsnak) {
    switch (mainsnak.datatype) {
      case 'wikibase-item':
        const itemId = mainsnak.datavalue.value.id;
        const url = wdk__default['default'].getEntities({
          ids: itemId,
          format: 'json'
        });

        return await axios__default['default']
          .get(url)
          .then(function (response) {
            return response.data.entities
          })
          .then(res => {
            console.log(res[itemId].labels['en'].value);
            return res[itemId].labels['en'].value
          })
      case 'time':
        // TODO: add a time type
        return mainsnak.datavalue.value.time.toString()
      case 'external-id':
      case 'string':
        return mainsnak.datavalue.value
      default:
        return mainsnak.datavalue.value
    }
  }

  _getPropertyLabel(id) {
    return properties[id]
  }
}

var schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    description: `The query root, from which multiple types of Wikidata
requests can be made.`,
    fields: () => ({
      entity: {
        type: EntityType,
        args: {
          id: { type: graphql.GraphQLString }
        },
        resolve: (_, { id }) => {
          return client.load(id)
        }
      }
    })
  })
});

const app = express__default['default']();
const port = 4000;

app.use(
  '/graph',
  expressGraphql.graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
