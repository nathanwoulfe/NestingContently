using Umbraco.Cms.Core.Logging;
using Umbraco.Cms.Core.Models.Blocks;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Extensions;

namespace NestingContently.Umbraco.ValueConverters;

public class NC_BlockGridPropertyValueConverter : BlockGridPropertyValueConverter
{
    public NC_BlockGridPropertyValueConverter(IProfilingLogger logger, BlockEditorConverter blockConverter, IJsonSerializer jsonSerializer)
        : base(logger, blockConverter, jsonSerializer)
    {

    }

    public override object? ConvertIntermediateToObject(
        IPublishedElement owner,
        IPublishedPropertyType propertyType,
        PropertyCacheLevel referenceCacheLevel,
        object? inter,
        bool preview)
    {
        var model = (BlockGridModel?)base.ConvertIntermediateToObject(owner, propertyType, referenceCacheLevel, inter, preview);

        if (model is null)
        {
            return null;
        }

        var blockGridItems = model.Where(i => i.Settings.IsVisible()).ToList();

        RemoveHiddenAreas(blockGridItems);

        return new BlockGridModel(blockGridItems, model.GridColumns);

        static void RemoveHiddenAreas(IEnumerable<BlockGridItem> blockGridItems)
        {
            foreach (BlockGridItem? blockGridItem in blockGridItems)
            {
                List<BlockGridArea> collectedAreas = new();
                foreach (BlockGridArea area in blockGridItem.Areas)
                {
                    List<BlockGridItem> collectedItems = new();
                    foreach (BlockGridItem item in area)
                    {
                        if (item.Settings.IsVisible())
                        {
                            collectedItems.Add(item);
                        }
                    }

                    if (collectedItems.Any())
                    {
                        RemoveHiddenAreas(collectedItems);
                        collectedAreas.Add(new(collectedItems, area.Alias, area.RowSpan, area.ColumnSpan));
                    }
                }

                blockGridItem.Areas = collectedAreas;
            }
        }
    }
}
