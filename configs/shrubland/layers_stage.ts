import { generateRCMAPFolderLayer, generateBoundary } from './layerGenerators';
import { FeatureInfo, Source, Legend, AdditionalAttributes, Timeseries } from './layerInterface';

import BITHeightLegend from '../../assets/images/shrubland/legends/BIT_component_height_legend.png';
import DepartureLegend from '../../assets/images/shrubland/legends/EP_departure_legend.png';
import RCMAPCoverLegend from '../../assets/images/shrubland/legends/RCMAP_cover_legend.png';
import legendConfidence from '../../assets/images/shrubland/legends/legend_confidence.png';
import legendPercentCover from '../../assets/images/shrubland/legends/legend_percentCover.png';

import TrendsBreakPoint from '../../assets/images/shrubland/legends/break_point_count.png';
import TrendsLinearSlope from '../../assets/images/shrubland/legends/linear_slope_break_point.png';
import TrendsIntensity from '../../assets/images/shrubland/legends/total_change_intensity_index.png';
import TrendsBreakYear from '../../assets/images/shrubland/legends/year_of_most_recent_break.png';

const dmsdata = 'https://dmsdata.cr.usgs.gov/geoserver/';
const mrlc = 'https://devmrlc.cr.usgs.gov/geoserver/';
const geoengine = 'https://stagegeoengine.cr.usgs.gov/api/rest/version/5.0/config';

const dmsdataWMS = dmsdata.concat('wms?');
const dmsdataWCS = dmsdata.concat('wcs?');
const dmsdataGWC = dmsdata.concat('gwc/service/wms?');

const mrlcWMS = mrlc.concat('wms?');
const mrlcWFS = mrlc.concat('wfs?');
const mrlcWCS = mrlc.concat('wcs?');

const dmsDataSource: Source = {
  wms: dmsdataWMS,
  wcs: dmsdataWCS,
  gwc: dmsdataGWC,
};

const mrlcSource: Source = {
  wms: mrlcWMS,
  wcs: mrlcWCS,
  wfs: mrlcWFS,
};
const mrlcSourceWMSWFS: Source = {
  wms: mrlcWMS,
  wfs: mrlcWFS,
};

const featureInfoPalette: FeatureInfo = {
  PALETTE_INDEX: {
    displayName: 'Pixel Value',
    displayValue: null,
    value: null,
    mapValues: [],
  },
};

const featureInfoGray: FeatureInfo = {
  GRAY_INDEX: {
    displayName: 'Pixel Value',
    displayValue: null,
    value: null,
    mapValues: [],
  },
};

const rcmapCoverLegend: Legend = { customImageURL: RCMAPCoverLegend, title: '' };
const ecologicalPotentialLegend: Legend = { customImageURL: DepartureLegend, title: 'Ecological Potential Component Cover Departure' };
const componentCoverLegend: Legend = { customImageURL: RCMAPCoverLegend, title: 'Component Cover' };
const heightLegend: Legend = { customImageURL: BITHeightLegend, title: '2016 Sagebrush Height' };
const exoticLegendConf: Legend = { customImageURL: legendConfidence, title: '' };
const exoticLegendCover: Legend = { customImageURL: legendPercentCover, title: '' };

const additionalAttributes: AdditionalAttributes = {
  format: 'yyyy',
  statistic: 'data',
  rasterDataset: '',
};

const timeseries: Timeseries = {
  type: 'year',
  format: 'f1',
  source: geoengine,
  start: {
    period: `shrubland.{{rasterDataset}}.start.day`,
    month: '',
    year: `shrubland.{{rasterDataset}}.start.year`,
  },
  end: {
    period: `shrubland.{{rasterDataset}}.end.day`,
    month: '',
    year: `shrubland.{{rasterDataset}}.end.year`,
  },
};

const wcsOutputSRS = 'EPSG:3857';

const rcmapTimeSeriesLayerValues = {
  source: dmsDataSource,
  featureInfo: featureInfoPalette,
  legend: rcmapCoverLegend,
  wcsOutputSRS,
  additionalAttributes,
  timeseries,
};

export const layers = {
  overlays: [
    {
      type: 'folder',
      title: 'RCMAP Time Series',
      expanded: false,
      folder: [
        generateRCMAPFolderLayer({
          display: true,
          id: 'anhb_westernconus_year_data',
          title: 'RCMAP Annual Herbaceous',
          description:
            'Annual Herbaceous is a continuous field component including grasses and forbs whose life history is complete in one growing season. This component is primarily dominated by annual invasive species including Cheatgrass (Bromus tectorum), Medusahead (Taeniatherum caput-medusae), Red Brome (Bromus rebens), or annual mustards such as Tumble Mustard (Sisymbrium altissimum) and Tansy Mustard (Descurainia pinnata). But may contain substantial native annual herbaceous vegetation at higher elevations and in California. This component is nested within Herbaceous as a secondary component.',
          name: 'rcmap_annual_herbaceous_YYYY',
          wmstName: 'mrlc_anhb_westernconus_year_data:anhb_westernconus_year_data',
          source: dmsDataSource,
          featureInfo: featureInfoPalette,
          legend: rcmapCoverLegend,
          wcsOutputSRS,
          additionalAttributes,
          timeseries,
          downloadCat: 'Annual Herb',
        }),
        generateRCMAPFolderLayer({
          id: 'shrub_westernconus_year_data',
          title: 'RCMAP Shrub',
          description:
            'Shrub is a continuous field component encompassing all shrub species discriminated by the presence of woody stems and < 6-m in height.',
          name: 'rcmap_shrub_YYYY',
          wmstName: 'mrlc_shrub_westernconus_year_data:shrub_westernconus_year_data',
          source: dmsDataSource,
          featureInfo: featureInfoPalette,
          legend: rcmapCoverLegend,
          wcsOutputSRS,
          additionalAttributes,
          timeseries,
          downloadCat: 'Shrub',
        }),
        generateRCMAPFolderLayer({
          id: 'litter_westernconus_year_data',
          title: 'RCMAP Litter',
          description:
            'Litter is a continuous field component including dead standing woody vegetation, detached plant organic matter and biological soil crusts.',
          name: 'rcmap_litter_YYYY',
          wmstName: 'mrlc_litter_westernconus_year_data:litter_westernconus_year_data',
          source: dmsDataSource,
          featureInfo: featureInfoPalette,
          legend: rcmapCoverLegend,
          wcsOutputSRS,
          additionalAttributes,
          timeseries,
          downloadCat: 'Litter',
        }),
        generateRCMAPFolderLayer({
          id: 'sage_westernconus_year_data',
          title: 'RCMAP Sagebrush',
          description:
            'Sagebrush is a continuous field component encompassing almost all species of Sagebrush (Artemisia spp.) including Big Sagebrush (A tridentata spp.), Low Sagebrush (A arbuscular), Black Sagebrush (A nova), Three-tip Sagebrush (A triparta) and Silver Sagebrush (A cana). This component is nested within Shrub as a secondary component. Excludes the low stature prairie sage (A. frigida) and white sagebrush (A. ludoviciana).',
          name: 'rcmap_sagebrush_YYYY',
          wmstName: 'mrlc_sage_westernconus_year_data:sage_westernconus_year_data',
          source: dmsDataSource,
          featureInfo: featureInfoPalette,
          legend: rcmapCoverLegend,
          wcsOutputSRS,
          additionalAttributes,
          timeseries,
          downloadCat: 'Sagebrush',
        }),
        generateRCMAPFolderLayer({
          id: 'bare_westernconus_year_data',
          title: 'RCMAP Bare Ground',
          description: 'Bare Ground is a continuous field component including exposed soil, sand and rocks.',
          name: 'rcmap_bare_ground_YYYY',
          wmstName: 'mrlc_bare_westernconus_year_data:bare_westernconus_year_data',
          source: dmsDataSource,
          featureInfo: featureInfoPalette,
          legend: rcmapCoverLegend,
          wcsOutputSRS,
          additionalAttributes,
          timeseries,
          downloadCat: 'Bare Ground',
        }),
        generateRCMAPFolderLayer({
          id: 'herb_westernconus_year_data',
          title: 'RCMAP Herbaceous',
          description:
            'Herbaceous is a continuous field component consisting of grasses, forbs and cacti which were photosynthetically active at any point in the year of mapping',
          name: 'rcmap_herbaceous_YYYY',
          wmstName: 'mrlc_herb_westernconus_year_data:herb_westernconus_year_data',
          source: dmsDataSource,
          featureInfo: featureInfoPalette,
          legend: rcmapCoverLegend,
          wcsOutputSRS,
          additionalAttributes,
          timeseries,
          downloadCat: 'Herbaceous',
        }),
        generateRCMAPFolderLayer({
          id: 'non-sagebrush-shrub_westernconus_year_data',
          title: 'RCMAP Non-sagebrush Shrub',
          description:
            'Non-sagebrush Shrub is a continuous field component encompassing all shrub species not of the sagebrush (Artemisia spp) genus. Shrubs, in general, are discriminated by the presence of woody stems and < 6-m in height.',
          name: 'rcmap_non_sagebrush_shrub_YYYY',
          wmstName: 'mrlc_non-sagebrush-shrub_westernconus_year_data:non-sagebrush-shrub_westernconus_year_data',
          source: dmsDataSource,
          featureInfo: featureInfoPalette,
          legend: rcmapCoverLegend,
          wcsOutputSRS,
          additionalAttributes,
          timeseries,
          downloadCat: 'Non-sagebrush Shrub',
        }),
        generateRCMAPFolderLayer({
          id: 'per-herb_westernconus_year_data',
          title: 'RCMAP Perennial Herbaceous',
          description:
            'Perennial Herbaceous is a continuous field component consisting of grasses, forbs and cacti which were photosynthetically active at any point in the year of mapping and whose lifecycle includes more than one growing season (includes biennials).',
          name: 'rcmap_perennial_herbaceous_YYYY',
          wmstName: 'mrlc_per-herb_westernconus_year_data:per-herb_westernconus_year_data',
          source: dmsDataSource,
          featureInfo: featureInfoPalette,
          legend: rcmapCoverLegend,
          wcsOutputSRS,
          additionalAttributes,
          timeseries,
          downloadCat: 'Perennial Herbaceous',
        }),
      ],
    },
    {
      type: 'folder',
      title: 'RCMAP Time Series Trends',
      expanded: false,
      folder: [
        {
          type: 'folder',
          title: 'Breakpoint Count',
          expanded: false,
          downloadCat: 'Breakpoint Count',
          folder: [
            generateRCMAPFolderLayer({
              title: 'Annual Herbaceous',
              name: 'mrlc_display:rcmap_annual_herbaceous_break_point',
              source: mrlcSource,
              legend: { customImageURL: TrendsBreakPoint },
              featureInfo: featureInfoPalette,
            }),
            generateRCMAPFolderLayer({
              title: 'Bare Ground',
              name: 'mrlc_display:rcmap_bare_ground_break_point',
              source: mrlcSource,
              legend: { customImageURL: TrendsBreakPoint },
              featureInfo: featureInfoPalette,
            }),
            generateRCMAPFolderLayer({
              title: 'Herbaceous',
              name: 'mrlc_display:rcmap_herbaceous_break_point',
              source: mrlcSource,
              legend: { customImageURL: TrendsBreakPoint },
              featureInfo: featureInfoPalette,
            }),
            generateRCMAPFolderLayer({
              title: 'Litter',
              name: 'mrlc_display:rcmap_litter_break_point',
              source: mrlcSource,
              legend: { customImageURL: TrendsBreakPoint },
              featureInfo: featureInfoPalette,
            }),
            generateRCMAPFolderLayer({
              title: 'Non Sagebrush Shrub',
              name: 'mrlc_display:rcmap_non_sagebrush_shrub_break_point',
              source: mrlcSource,
              legend: { customImageURL: TrendsBreakPoint },
              featureInfo: featureInfoPalette,
            }),
            generateRCMAPFolderLayer({
              title: 'Perennial Herbaceous',
              name: 'mrlc_display:rcmap_perennial_herbaceous_break_point',
              source: mrlcSource,
              legend: { customImageURL: TrendsBreakPoint },
              featureInfo: featureInfoPalette,
            }),
            generateRCMAPFolderLayer({
              title: 'Sagebrush',
              name: 'mrlc_display:rcmap_sagebrush_break_point',
              source: mrlcSource,
              legend: { customImageURL: TrendsBreakPoint },
              featureInfo: featureInfoPalette,
            }),
            generateRCMAPFolderLayer({
              title: 'Shrub',
              name: 'mrlc_display:rcmap_shrub_break_point',
              source: mrlcSource,
              legend: { customImageURL: TrendsBreakPoint },
              featureInfo: featureInfoPalette,
            }),
          ],
        },
        {
          type: 'folder',
          title: 'Slope of Linear Model',
          expanded: false,
          downloadCat: 'Slope of Linear Model',
          folder: [
            generateRCMAPFolderLayer({
              title: 'Annual Herbaceous',
              name: 'mrlc_display:rcmap_annual_herbaceous_linear_model_slope',
              source: mrlcSource,
              legend: { customImageURL: TrendsLinearSlope },
              featureInfo: featureInfoGray,
            }),
            generateRCMAPFolderLayer({
              title: 'Bare Ground',
              name: 'mrlc_display:rcmap_bare_ground_linear_model_slope',
              source: mrlcSource,
              legend: { customImageURL: TrendsLinearSlope },
              featureInfo: featureInfoGray,
            }),
            generateRCMAPFolderLayer({
              title: 'Herbaceous',
              name: 'mrlc_display:rcmap_herbaceous_linear_model_slope',
              source: mrlcSource,
              legend: { customImageURL: TrendsLinearSlope },
              featureInfo: featureInfoGray,
            }),
            generateRCMAPFolderLayer({
              title: 'Litter',
              name: 'mrlc_display:rcmap_litter_linear_model_slope',
              source: mrlcSource,
              legend: { customImageURL: TrendsLinearSlope },
              featureInfo: featureInfoGray,
            }),
            generateRCMAPFolderLayer({
              title: 'Non Sagebrush Shrub',
              name: 'mrlc_display:rcmap_non_sagebrush_shrub_linear_model_slope',
              source: mrlcSource,
              legend: { customImageURL: TrendsLinearSlope },
              featureInfo: featureInfoGray,
            }),
            generateRCMAPFolderLayer({
              title: 'Perennial Herbaceous',
              name: 'mrlc_display:rcmap_perennial_herbaceous_linear_model_slope',
              source: mrlcSource,
              legend: { customImageURL: TrendsLinearSlope },
              featureInfo: featureInfoGray,
            }),
            generateRCMAPFolderLayer({
              title: 'Sagebrush',
              name: 'mrlc_display:rcmap_sagebrush_linear_model_slope',
              source: mrlcSource,
              legend: { customImageURL: TrendsLinearSlope },
              featureInfo: featureInfoGray,
            }),
            generateRCMAPFolderLayer({
              title: 'Shrub',
              name: 'mrlc_display:rcmap_shrub_linear_model_slope',
              source: mrlcSource,
              legend: { customImageURL: TrendsLinearSlope },
              featureInfo: featureInfoGray,
            }),
          ],
        },
        {
          type: 'folder',
          title: 'Year of Most Recent Break',
          expanded: false,
          downloadCat: 'Year of Most Recent Break',
          folder: [
            generateRCMAPFolderLayer({
              title: 'Annual Herbaceous',
              name: 'mrlc_display:rcmap_annual_herbaceous_most_recent_break_point',
              source: mrlcSource,
              legend: { customImageURL: TrendsBreakYear },
              featureInfo: featureInfoGray,
            }),
            generateRCMAPFolderLayer({
              title: 'Bare Ground',
              name: 'mrlc_display:rcmap_bare_ground_most_recent_break_point',
              source: mrlcSource,
              legend: { customImageURL: TrendsBreakYear },
              featureInfo: featureInfoGray,
            }),
            generateRCMAPFolderLayer({
              title: 'Herbaceous',
              name: 'mrlc_display:rcmap_herbaceous_most_recent_break_point',
              source: mrlcSource,
              legend: { customImageURL: TrendsBreakYear },
              featureInfo: featureInfoGray,
            }),
            generateRCMAPFolderLayer({
              title: 'Litter',
              name: 'mrlc_display:rcmap_litter_most_recent_break_point',
              source: mrlcSource,
              legend: { customImageURL: TrendsBreakYear },
              featureInfo: featureInfoGray,
            }),
            generateRCMAPFolderLayer({
              title: 'Non Sagebrush Shrub',
              name: 'mrlc_display:rcmap_non_sagebrush_shrub_most_recent_break_point',
              source: mrlcSource,
              legend: { customImageURL: TrendsBreakYear },
              featureInfo: featureInfoGray,
            }),
            generateRCMAPFolderLayer({
              title: 'Perennial Herbaceous',
              name: 'mrlc_display:rcmap_perennial_herbaceous_most_recent_break_point',
              source: mrlcSource,
              legend: { customImageURL: TrendsBreakYear },
              featureInfo: featureInfoGray,
            }),
            generateRCMAPFolderLayer({
              title: 'Sagebrush',
              name: 'mrlc_display:rcmap_sagebrush_most_recent_break_point',
              source: mrlcSource,
              legend: { customImageURL: TrendsBreakYear },
              featureInfo: featureInfoGray,
            }),
            generateRCMAPFolderLayer({
              title: 'Shrub',
              name: 'mrlc_display:rcmap_shrub_most_recent_break_point',
              source: mrlcSource,
              legend: { customImageURL: TrendsBreakYear },
              featureInfo: featureInfoGray,
            }),
          ],
        },
        generateRCMAPFolderLayer({
          title: 'Total Change Intensity Index',
          name: 'mrlc_display:rcmap_total_change_intensity_index',
          source: mrlcSource,
          legend: { customImageURL: TrendsIntensity },
          featureInfo: featureInfoPalette,
          downloadCat: 'Total Change Intensity Index',
        }),
      ],
    },
    {
      type: 'folder',
      title: 'RCMAP Ecological Potential (EP)',
      expanded: false,
      folder: [
        generateRCMAPFolderLayer({
          title: '2018 EP Departure Bare Ground Cover',
          id: '2018_bare_ground_departure_20210331',
          name: 'mrlc_display:2018_departure_bare_ground_cover',
          source: mrlcSourceWMSWFS,
          legend: ecologicalPotentialLegend,
          featureInfo: featureInfoGray,
          downloadCat: 'Ecological Potential Cover Departure',
        }),
        generateRCMAPFolderLayer({
          title: '2018 EP Departure Litter Cover',
          id: '2018_litter_departure_20210331',
          name: 'mrlc_display:2018_departure_litter_cover',
          source: mrlcSourceWMSWFS,
          legend: ecologicalPotentialLegend,
          featureInfo: featureInfoGray,
          downloadCat: 'Ecological Potential Cover Departure',
        }),
        generateRCMAPFolderLayer({
          title: '2018 EP Departure Perennial Herbaceous Cover',
          id: '2018_perennial_herbaceous_departure_20210331',
          name: 'mrlc_display:2018_departure_per_herb_cover',
          source: mrlcSourceWMSWFS,
          legend: ecologicalPotentialLegend,
          featureInfo: featureInfoGray,
          downloadCat: 'Ecological Potential Cover Departure',
        }),
        generateRCMAPFolderLayer({
          title: '2018 EP Departure Sagebrush Cover',
          id: '2018_sagebrush_departure_20210331',
          name: 'mrlc_display:2018_departure_sagebrush_cover',
          source: mrlcSourceWMSWFS,
          legend: ecologicalPotentialLegend,
          featureInfo: featureInfoGray,
          downloadCat: 'Ecological Potential Cover Departure',
        }),
        generateRCMAPFolderLayer({
          title: '2018 EP Departure Shrub Cover',
          id: '2018_shrub_departure_20210331',
          name: 'mrlc_display:2018_departure_shrub_cover',
          source: mrlcSourceWMSWFS,
          legend: ecologicalPotentialLegend,
          featureInfo: featureInfoGray,
          downloadCat: 'Ecological Potential Cover Departure',
        }),
        generateRCMAPFolderLayer({
          title: 'EP Bare Ground Cover',
          id: 'ecological_potential_bare_ground_cover_20210331',
          name: 'mrlc_display:ecological_potential_bare_cover',
          source: mrlcSourceWMSWFS,
          legend: componentCoverLegend,
          featureInfo: featureInfoPalette,
          downloadCat: 'Ecological Potential Cover',
        }),
        generateRCMAPFolderLayer({
          title: 'EP Litter Cover',
          id: 'ecological_potential_litter_cover_20210331',
          name: 'mrlc_display:ecological_potential_litter_cover',
          source: mrlcSourceWMSWFS,
          legend: componentCoverLegend,
          featureInfo: featureInfoPalette,
          downloadCat: 'Ecological Potential Cover',
        }),
        generateRCMAPFolderLayer({
          title: 'EP Perennial Herbaceous Cover',
          id: 'ecological_potential_perennial_herbaceous_cover_20210331',
          name: 'mrlc_display:ecological_potential_perennial_herbaceous_cover',
          source: mrlcSourceWMSWFS,
          legend: componentCoverLegend,
          featureInfo: featureInfoPalette,
          downloadCat: 'Ecological Potential Cover',
        }),
        generateRCMAPFolderLayer({
          title: 'EP Sagebrush Cover',
          id: 'ecological_potential_sagebrush_cover_20210331',
          name: 'mrlc_display:ecological_potential_sagebrush_cover',
          source: mrlcSourceWMSWFS,
          legend: componentCoverLegend,
          featureInfo: featureInfoPalette,
          downloadCat: 'Ecological Potential Cover',
        }),
        generateRCMAPFolderLayer({
          title: 'EP Shrub Cover',
          id: 'ecological_potential_shrub_cover_20210331',
          name: 'mrlc_display:ecological_potential_shrub_cover',
          source: mrlcSourceWMSWFS,
          legend: componentCoverLegend,
          featureInfo: featureInfoPalette,
          downloadCat: 'Ecological Potential Cover',
        }),
      ],
    },
    {
      type: 'folder',
      title: 'RCMAP Basemap',
      expanded: false,
      downloadCat: 'Shrubland-basemap(2016)',
      folder: [
        generateRCMAPFolderLayer({
          title: '2016 Annual Herbaceous Cover',
          id: 'nlcd_2016_annual_herbaceous_shrubland_fractional_component_20200715',
          name: 'mrlc_display:NLCD_2016_Annual_Herb_Shrubland_Fractional_Component',
          description:
            'Annual Herbaceous is a continuous field component including grasses and forbs whose life history is complete in one growing season. This component is primarily dominated by annual invasive species including Cheatgrass (Bromus tectorum), Medusahead (Taeniatherum caput-medusae), Red Brome (Bromus rebens), or annual mustards such as Tumble Mustard (Sisymbrium altissimum) and Tansy Mustard (Descurainia pinnata). But may contain substantial native annual herbaceous vegetation at higher elevations and in California. This component is nested within Herbaceous as a secondary component.',
          source: mrlcSource,
          legend: rcmapCoverLegend,
          featureInfo: featureInfoPalette,
        }),
        generateRCMAPFolderLayer({
          title: '2016 Bare Ground Cover',
          id: 'nlcd_2016_bare_ground_shrubland_fractional_component_20200715',
          name: 'mrlc_display:NLCD_2016_Bare_Ground_Shrubland_Fractional_Component',
          description: 'Bare Ground is a continuous field component including exposed soil, sand and rocks.',
          source: mrlcSource,
          legend: rcmapCoverLegend,
          featureInfo: featureInfoPalette,
        }),
        generateRCMAPFolderLayer({
          title: '2016 Big Sagebrush Cover',
          id: 'allconusUsgs2016ShrublandBigSagebrush',
          name: 'mrlc_display:NLCD_2016_Big_Sagebrush_Shrubland_Fractional_Component',
          description:
            'Big Sagebrush is a continuous field component dominated by Big Sagebrush (A tridentata spp.) may include Three-tip Sagebrush (A triparta) and Silver Sagebrush (A cana). This component is nested within Shrub and Sagebrush as a secondary component.',
          source: mrlcSource,
          legend: rcmapCoverLegend,
          featureInfo: featureInfoPalette,
        }),
        generateRCMAPFolderLayer({
          title: '2016 Herbaceous Cover',
          id: 'allconusUsgs2016ShrublandHerbaceous',
          name: 'mrlc_display:NLCD_2016_Herbaceous_Shrubland_Fractional_Component',
          description:
            'Herbaceous is a continuous field component consisting of grasses, forbs and cacti which were photosynthetically active at any point in the year of mapping',
          source: mrlcSource,
          legend: rcmapCoverLegend,
          featureInfo: featureInfoPalette,
        }),
        generateRCMAPFolderLayer({
          title: '2016 Litter Cover',
          id: 'allconusUsgs2016ShrublandLitter',
          name: 'mrlc_display:NLCD_2016_Litter_Shrubland_Fractional_Component',
          description:
            'Litter is a continuous field component including dead standing woody vegetation, detached plant organic matter and biological soil crusts.',
          source: mrlcSource,
          legend: rcmapCoverLegend,
          featureInfo: featureInfoPalette,
        }),
        generateRCMAPFolderLayer({
          title: '2016 Sagebrush Cover',
          id: 'allconusUsgs2016ShrublandSagebrush',
          name: 'mrlc_display:NLCD_2016_Sagebrush_Shrubland_Fractional_Component',
          description:
            'Sagebrush is a continuous field component encompassing almost all species of Sagebrush (Artemisia spp.) including Big Sagebrush (A tridentata spp.), Low Sagebrush (A arbuscular), Black Sagebrush (A nova), Three-tip Sagebrush (A triparta) and Silver Sagebrush (A cana). This component is nested within Shrub as a secondary component. Excludes the low stature prairie sage (A. frigida) and white sagebrush (A. ludoviciana).',
          source: mrlcSource,
          legend: rcmapCoverLegend,
          featureInfo: featureInfoPalette,
        }),
        generateRCMAPFolderLayer({
          title: '2016 Sagebrush Height',
          id: 'allconusUsgs2016ShrublandSagebrushHeight',
          name: 'mrlc_display:NLCD_2016_Sagebrush_Height_Shrubland_Fractional_Component',
          description:
            'Sagebrush Height is the average height of all Shrub in centimeters. This component only occurs where the Shrub component has a prediction.',
          source: mrlcSource,
          legend: heightLegend,
          featureInfo: featureInfoPalette,
        }),
        generateRCMAPFolderLayer({
          title: '2016 Shrub Cover',
          id: 'allconusUsgs2016ShrublandShrub',
          name: 'mrlc_display:NLCD_2016_Shrub_Shrubland_Fractional_Component',
          description:
            'Shrub is a continuous field component encompassing all shrub species discriminated by the presence of woody stems and < 6-m in height.',
          source: mrlcSource,
          legend: rcmapCoverLegend,
          featureInfo: featureInfoPalette,
        }),
        generateRCMAPFolderLayer({
          title: '2016 Shrub Height',
          id: 'allconusUsgs2016ShrublandShrubHeight',
          name: 'mrlc_display:NLCD_2016_Shrub_Height_Shrubland_Fractional_Component',
          description:
            'Shrub Height is the average height of all Shrub in centimeters. This component only occurs where the Shrub component has a prediction.',
          source: mrlcSource,
          legend: heightLegend,
          featureInfo: featureInfoPalette,
        }),
      ],
    },
    {
      type: 'folder',
      title: 'Exotic Annual Grass',
      expanded: false,
      folder: [
        generateRCMAPFolderLayer({
          id: 'ExoticAnnualGrass_July012022_Confidence',
          title: 'July 01, 2022 Confidence',
          description:
            'This data provides modelling confidence for each mapped pixel of exotic annual grasses (EAG) fractional cover predicted on July 1, 2022. Confidence Level is unitless, ranges from 0 (low confidence) to 10 (high confidence).',
          name: 'mrlc_display:ExoticAnnualGrass_July012022_Confidence',
          source: mrlcSourceWMSWFS,
          featureInfo: featureInfoGray,
          legend: exoticLegendConf,
          downloadCat: 'Exotic Annual Grass - July 01, 2022',
        }),
        generateRCMAPFolderLayer({
          id: 'ExoticAnnualGrass_July012022_PercentCover',
          title: 'July 01, 2022 Percent Cover',
          description:
            'This data provides early estimates of 2022 exotic annual grasses (EAG) fractional cover predicted on July 1 using satellite observation data available until June 23. EAG is a continuous field consisting of abundance of non-native grass species whose life history is complete in one growing season. Cheatgrass (Bromus tectorum) is a dominant species, but this dataset also includes Bromus arvensis L., Bromus briziformis Fisch. & C.A. Mey. Bromus catharticus Vahl, Bromus commutatus Schrad, Bromus diandrus Roth, Bromus hordeaceus L., Bromus hordeaceus spp. Hordeaceus, Bromus japonicus Thunb, Bromus madritensis L., Bromus madritensis L. ssp. rubens (L.) Duvin, Bromus racemosus L., Bromus rubens L., Bromus secalinus L., Bromus texensis (Shear) Hitchc, and medusahead (Taeniatherum caput-medusae (L.) Nevski).',
          name: 'mrlc_display:ExoticAnnualGrass_July012022_PercentCover',
          source: mrlcSourceWMSWFS,
          featureInfo: featureInfoGray,
          legend: exoticLegendCover,
          downloadCat: 'Exotic Annual Grass - July 01, 2022',
        }),
        generateRCMAPFolderLayer({
          id: 'ExoticAnnualGrass_June152022_Confidence',
          title: 'June 15, 2022 Confidence',
          description:
            'This data provides modelling confidence for each mapped pixel of exotic annual grasses (EAG) fractional cover predicted on June 15, 2022. Confidence Level is unitless, ranges from 0 (low confidence) to 10 (high confidence).',
          name: 'mrlc_display:ExoticAnnualGrass_June152022_Confidence',
          source: mrlcSourceWMSWFS,
          featureInfo: featureInfoGray,
          legend: exoticLegendConf,
          downloadCat: 'Exotic Annual Grass - June 15, 2022',
        }),
        generateRCMAPFolderLayer({
          id: 'ExoticAnnualGrass_June152022_PercentCover',
          title: 'June 15, 2022 Percent Cover',
          description:
            'This data provides early estimates of 2022 exotic annual grasses (EAG) fractional cover predicted on June 15 using satellite observation data available until June 11. EAG is a continuous field consisting of abundance of non-native grass species whose life history is complete in one growing season. Cheatgrass (Bromus tectorum) is a dominant species, but this dataset also includes Bromus arvensis L., Bromus briziformis Fisch. & C.A. Mey. Bromus catharticus Vahl, Bromus commutatus Schrad, Bromus diandrus Roth, Bromus hordeaceus L., Bromus hordeaceus spp. Hordeaceus, Bromus japonicus Thunb, Bromus madritensis L., Bromus madritensis L. ssp. rubens (L.) Duvin, Bromus racemosus L., Bromus rubens L., Bromus secalinus L., Bromus texensis (Shear) Hitchc, and medusahead (Taeniatherum caput-medusae (L.) Nevski).',
          name: 'mrlc_display:ExoticAnnualGrass_June152022_PercentCover',
          source: mrlcSourceWMSWFS,
          featureInfo: featureInfoGray,
          legend: exoticLegendCover,
          downloadCat: 'Exotic Annual Grass - June 15, 2022',
        }),
        generateRCMAPFolderLayer({
          id: 'ExoticAnnualGrass_June032022_Confidence',
          title: 'June 03, 2022 Confidence',
          description:
            'This data provides modelling confidence for each mapped pixel of exotic annual grasses (EAG) fractional cover predicted on June 3, 2022. Confidence Level is unitless, ranges from 0 (low confidence) to 10 (high confidence).',
          name: 'mrlc_display:ExoticAnnualGrass_June032022_Confidence',
          source: mrlcSourceWMSWFS,
          featureInfo: featureInfoGray,
          legend: exoticLegendConf,
          downloadCat: 'Exotic Annual Grass - June 03, 2022',
        }),
        generateRCMAPFolderLayer({
          id: 'ExoticAnnualGrass_June032022_PercentCover',
          title: 'June 03, 2022 Percent Cover',
          description:
            'This data provides early estimates of 2022 exotic annual grasses (EAG) fractional cover predicted on June 3 using satellite observation data available until May 27. EAG is a continuous field consisting of abundance of non-native grass species whose life history is complete in one growing season. Cheatgrass (Bromus tectorum) is a dominant species, but this dataset also includes Bromus arvensis L., Bromus briziformis Fisch. & C.A. Mey. Bromus catharticus Vahl, Bromus commutatus Schrad, Bromus diandrus Roth, Bromus hordeaceus L., Bromus hordeaceus spp. Hordeaceus, Bromus japonicus Thunb, Bromus madritensis L., Bromus madritensis L. ssp. rubens (L.) Duvin, Bromus racemosus L., Bromus rubens L., Bromus secalinus L., Bromus texensis (Shear) Hitchc, and medusahead (Taeniatherum caput-medusae (L.) Nevski).',
          name: 'mrlc_display:ExoticAnnualGrass_June032022_PercentCover',
          source: mrlcSourceWMSWFS,
          featureInfo: featureInfoGray,
          legend: exoticLegendCover,
          downloadCat: 'Exotic Annual Grass - June 03, 2022',
        }),
        generateRCMAPFolderLayer({
          id: 'ExoticAnnualGrass_May182022_Confidence',
          title: 'May 18, 2022 Confidence',
          description:
            'This data provides modelling confidence for each mapped pixel of exotic annual grasses (EAG) fractional cover predicted on May 18, 2022. Confidence Level is unitless, ranges from 0 (low confidence) to 10 (high confidence).',
          name: 'mrlc_display:ExoticAnnualGrass_May182022_Confidence',
          source: mrlcSourceWMSWFS,
          featureInfo: featureInfoGray,
          legend: exoticLegendConf,
          downloadCat: 'Exotic Annual Grass - May 18, 2022',
        }),
        generateRCMAPFolderLayer({
          id: 'ExoticAnnualGrass_May182022_PercentCover',
          title: 'May 18, 2022 Confidence',
          description:
            'This data provides early estimates of 2022 exotic annual grasses (EAG) fractional cover predicted on May 18 using satellite observation data available until May 13. EAG is a continuous field consisting of abundance of non-native grass species whose life history is complete in one growing season. Cheatgrass (Bromus tectorum) is a dominant species, but this dataset also includes Bromus arvensis L., Bromus briziformis Fisch. & C.A. Mey. Bromus catharticus Vahl, Bromus commutatus Schrad, Bromus diandrus Roth, Bromus hordeaceus L., Bromus hordeaceus spp. Hordeaceus, Bromus japonicus Thunb, Bromus madritensis L., Bromus madritensis L. ssp. rubens (L.) Duvin, Bromus racemosus L., Bromus rubens L., Bromus secalinus L., Bromus texensis (Shear) Hitchc, and medusahead (Taeniatherum caput-medusae (L.) Nevski).',
          name: 'mrlc_display:ExoticAnnualGrass_May182022_PercentCover',
          source: mrlcSourceWMSWFS,
          featureInfo: featureInfoGray,
          legend: exoticLegendCover,
          downloadCat: 'Exotic Annual Grass - May 18, 2022',
        }),
        generateRCMAPFolderLayer({
          id: 'ExoticAnnualGrass_May062022_Confidence',
          title: 'May 06, 2022 Confidence',
          description:
            'This data provides modelling confidence for each mapped pixel of exotic annual grasses (EAG) fractional cover predicted on May 6, 2022. Confidence Level is unitless, ranges from 0 (low confidence) to 10 (high confidence).',
          source: mrlcSourceWMSWFS,
          featureInfo: featureInfoGray,
          legend: exoticLegendConf,
          downloadCat: 'Exotic Annual Grass - May 06, 2022',
        }),
        generateRCMAPFolderLayer({
          id: 'ExoticAnnualGrass_May062022_PercentCover',
          title: 'May 06, 2022 Percent Cover',
          description:
            'This data provides early estimates of 2022 exotic annual grasses (EAG) fractional cover predicted on May 6 using satellite observation data available until April 29. EAG is a continuous field consisting of abundance of non-native grass species whose life history is complete in one growing season. Cheatgrass (Bromus tectorum) is a dominant species, but this dataset also includes Bromus arvensis L., Bromus briziformis Fisch. & C.A. Mey. Bromus catharticus Vahl, Bromus commutatus Schrad, Bromus diandrus Roth, Bromus hordeaceus L., Bromus hordeaceus spp. Hordeaceus, Bromus japonicus Thunb, Bromus madritensis L., Bromus madritensis L. ssp. rubens (L.) Duvin, Bromus racemosus L., Bromus rubens L., Bromus secalinus L., Bromus texensis (Shear) Hitchc, and medusahead (Taeniatherum caput-medusae (L.) Nevski).',
          source: mrlcSourceWMSWFS,
          featureInfo: featureInfoGray,
          legend: exoticLegendCover,
          downloadCat: 'Exotic Annual Grass - May 06, 2022',
        }),
        generateRCMAPFolderLayer({
          id: 'ExoticAnnualGrass_July2021_Confidence_WM',
          title: 'July 2021 Confidence',
          description:
            'This data provides modelling confidence for each mapped pixel of exotic annual grasses (EAG) fractional cover predicted on July 1, 2021. Confidence Level is unitless, ranges from 0 (low confidence) to 10 (high confidence).',
          name: 'mrlc_display:ExoticAnnualGrass_July2021_Confidence_WM',
          source: mrlcSourceWMSWFS,
          featureInfo: featureInfoGray,
          legend: exoticLegendConf,
          downloadCat: 'Exotic Annual Grass - July 2021',
        }),
        generateRCMAPFolderLayer({
          id: 'ExoticAnnualGrass_july2021_percentCover',
          title: 'July 2021 Percent Cover',
          description:
            'This data provides early estimates of 2021 exotic annual grasses (EAG) fractional cover predicted on July 1st using satellite observation data available until June 28th. EAG is a continuous field consisting of abundance of non-native grass species whose life history is complete in one growing season. Cheatgrass (Bromus tectorum) is a dominant species but this dataset also includes Bromus arvensis L., Bromus briziformis, Bromus catharticus Vahl, Bromus commutatus, Bromus diandrus, Bromus hordeaceus L., Bromus hordeaceus spp. Hordeaceus, Bromus japonicus, Bromus madritensis L., Bromus madritensis L. ssp. rubens (L.) Duvin, Bromus racemosus, Bromus rubens L., Bromus secalinus L., Bromus texensis (Shear) Hitch, and medusahead (Taeniatherum caput-medusae).',
          name: 'mrlc_display:ExoticAnnualGrass_July2021_PercentCover_WM',
          source: mrlcSourceWMSWFS,
          featureInfo: featureInfoGray,
          legend: exoticLegendCover,
          downloadCat: 'Exotic Annual Grass - July 2021',
        }),
        generateRCMAPFolderLayer({
          id: 'ExoticAnnualGrass_may2021_confidence',
          title: 'May 2021 Confidence',
          description:
            'This data provides modelling confidence for each mapped pixel of exotic annual grasses (EAG) fractional cover predicted on May 3, 2021. Confidence Level is unitless, ranges from 0 (low confidence) to 10 (high confidence).',
          name: 'mrlc_display:ExoticAnnualGrass_May2021_Confidence_WM',
          source: mrlcSourceWMSWFS,
          featureInfo: featureInfoGray,
          legend: exoticLegendConf,
          downloadCat: 'Exotic Annual Grass - May 2021',
        }),
        generateRCMAPFolderLayer({
          id: 'ExoticAnnualGrass_may2021_percentCover',
          title: 'May 2021 Percent Cover',
          description:
            'This data provides early estimates of 2021 exotic annual grasses (EAG) fractional cover predicted on May 3rd using satellite observation data available until April 26th. EAG is a continuous field consisting of abundance of non-native grass species whose life history is complete in one growing season. Cheatgrass (Bromus tectorum) is a dominant species but this dataset also includes Bromus arvensis L., Bromus briziformis, Bromus catharticus Vahl, Bromus commutatus, Bromus diandrus, Bromus hordeaceus L., Bromus hordeaceus spp. Hordeaceus, Bromus japonicus, Bromus madritensis L., Bromus madritensis L. ssp. rubens (L.) Duvin, Bromus racemosus, Bromus rubens L., Bromus secalinus L., Bromus texensis (Shear) Hitch, and medusahead (Taeniatherum caput-medusae).',
          name: 'mrlc_display:ExoticAnnualGrass_May2021_PercentCover_WM',
          source: mrlcSourceWMSWFS,
          featureInfo: featureInfoGray,
          legend: exoticLegendCover,
          downloadCat: 'Exotic Annual Grass - May 2021',
        }),
      ],
    },
  ],
  boundaries: [
    {
      type: 'folder',
      title: 'Boundaries',
      expanded: true,
      folder: [
        generateBoundary({
          id: 'shapefile_BLM_USFS_Pastures',
          name: 'mrlc_shapefile_BLM_USFS_Pastures:shapefile_BLM_USFS_Pastures',
          title: 'BLM USFS Pastures',
          source: dmsDataSource,
          includeManager: true,
        }),
        generateBoundary({
          id: 'shapefile_USFS_BLM_Allotments_wm',
          name: 'mrlc_shapefile_USFS_BLM_Allotments_wm:shapefile_USFS_BLM_Allotments_wm',
          title: 'USFS BLM Allotments',
          source: dmsDataSource,
          includeManager: true,
        }),
        generateBoundary({
          id: 'shapefile_HUC_level_6',
          name: 'mrlc_shapefile_HUC_level_6:shapefile_HUC_level_6',
          title: 'HUC Level 6',
          source: dmsDataSource,
        }),
        generateBoundary({
          id: 'shapefile_HUC_level_8',
          name: 'mrlc_shapefile_HUC_level_8:shapefile_HUC_level_8',
          title: 'HUC Level 8',
          source: dmsDataSource,
        }),
        generateBoundary({
          id: 'shapefile_HUC_level_10',
          name: 'mrlc_shapefile_HUC_level_10:shapefile_HUC_level_10',
          title: 'HUC Level 10',
          source: dmsDataSource,
        }),
        generateBoundary({
          id: 'shapefile_BLM_Priority_Habitat_Area',
          name: 'mrlc_shapefile_BLM_Priority_Habitat_Area:shapefile_BLM_Priority_Habitat_Area',
          title: 'BLM Priority Habitat Area',
          source: dmsDataSource,
        }),
        generateBoundary({
          id: 'shapefile_BLM_herd_managment_area',
          name: 'mrlc_shapefile_BLM_herd_managment_area:shapefile_BLM_herd_managment_area',
          title: 'BLM Herd Management Area',
          source: dmsDataSource,
        }),
      ],
    },
  ],
  baselayers: [
    {
      type: 'folder',
      title: 'Base Layers',
      expanded: true,
      folder: [
        {
          type: 'layer',
          name: 'stamen',
          title: 'Stamen Terrain',
          loadOnly: false,
          display: true,
          mask: false,
          srs: 'EPSG:3857',
          loaded: 'true',
          brand: 'stamen',
          layer: 'terrain',
          comments: 'imagery set values can be Road,Aerial,AerialWithLabels,collinsBart,ordnanceSurvey',
        },
        {
          type: 'layer',
          name: 'Aerial Imagery',
          title: 'Aerial Imagery',
          description: '',
          loadOnly: false,
          display: false,
          mask: false,
          srs: 'EPSG:3857',
          loaded: 'true',
          brand: 'osm',
          source: {
            url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}',
          },
          comments: '',
        },
        {
          type: 'layer',
          id: 'allStates',
          name: 'mrlc_display:mrlc_cb_2016_us_state_5m_web_mercator',
          title: 'National Atlas States',
          source: {
            wms: mrlcWMS,
            wfs: mrlcWFS,
          },
          loadOnly: false,
          display: true,
          mask: false,
          srs: 'EPSG:3857',
        },
        {
          type: 'layer',
          id: 'allCounties',
          name: 'mrlc_display:mrlc_uscounties',
          title: 'National Atlas Counties 2001',
          source: {
            wms: mrlcWMS,
            wfs: mrlcWFS,
          },
          loadOnly: false,
          display: false,
          mask: false,
          zIndex: 0,
          srs: 'EPSG:3857',
          featureInfo: {
            COUNTY: {
              displayName: 'County Name',
              displayValue: null,
              value: null,
              mapValues: [],
            },
            STATE: {
              displayName: 'State',
              displayValue: null,
              value: null,
              mapValues: [],
            },
            AREA_: {
              displayName: 'Area',
              displayValue: null,
              value: null,
              mapValues: [],
              significantDigits: 6,
            },
            PERIMETER: {
              displayName: 'Perimeter',
              displayValue: null,
              value: null,
              mapValues: [],
              significantDigits: 6,
            },
          },
        },
      ],
    },
  ],
};
