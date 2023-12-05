-- AUTO-GENERATED BY schema-ddl DO NOT EDIT
-- Generator: schema-ddl 0.3.1
-- Generated: 2016-07-04 14:54

CREATE SCHEMA IF NOT EXISTS atomic;

CREATE TABLE IF NOT EXISTS atomic.com_newscgp_aka_1 (
    "schema_vendor"              VARCHAR(128)  ENCODE RUNLENGTH NOT NULL,
    "schema_name"                VARCHAR(128)  ENCODE RUNLENGTH NOT NULL,
    "schema_format"              VARCHAR(128)  ENCODE RUNLENGTH NOT NULL,
    "schema_version"             VARCHAR(128)  ENCODE RUNLENGTH NOT NULL,
    "root_id"                    CHAR(36)      ENCODE RAW       NOT NULL,
    "root_tstamp"                TIMESTAMP     ENCODE LZO       NOT NULL,
    "ref_root"                   VARCHAR(255)  ENCODE RUNLENGTH NOT NULL,
    "ref_tree"                   VARCHAR(1500) ENCODE RUNLENGTH NOT NULL,
    "ref_parent"                 VARCHAR(255)  ENCODE RUNLENGTH NOT NULL,
    "browser_ads_ppid"           VARCHAR(4096) ENCODE LZO,
    "browser_ads_provider"       VARCHAR(4096) ENCODE LZO,
    "browser_analytics_id"       VARCHAR(4096) ENCODE LZO,
    "browser_analytics_provider" VARCHAR(4096) ENCODE LZO,
    "browser_dmp_id"             VARCHAR(4096) ENCODE LZO,
    "browser_dmp_provider"       VARCHAR(4096) ENCODE LZO,
    "browser_ncg_id"             VARCHAR(4096) ENCODE LZO,
    "user_id"                    VARCHAR(4096) ENCODE LZO,
    "user_memtype"               VARCHAR(4096) ENCODE LZO,
    "user_newsletter_id"         VARCHAR(4096) ENCODE LZO,
    "user_newsletter_provider"   VARCHAR(4096) ENCODE LZO,
    "user_provider"              VARCHAR(4096) ENCODE LZO,
    FOREIGN KEY (root_id) REFERENCES atomic.events(event_id)
)
DISTSTYLE KEY
DISTKEY (root_id)
SORTKEY (root_tstamp);

COMMENT ON TABLE atomic.com_newscgp_aka_1 IS 'iglu:com.newscgp/aka/jsonschema/1-0-0';
