using Umbraco.Cms.Core.Logging;
using Umbraco.Cms.Core.Models.Blocks;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;
using Umbraco.Cms.Core.Services;
using Umbraco.Extensions;

namespace NestingContently.Umbraco.Editor;

public class NestingContentlyBlockListPropertyValueConverter : BlockListPropertyValueConverter
{
    public NestingContentlyBlockListPropertyValueConverter(
        IProfilingLogger logger,
        IContentTypeService contentTypeService,
        BlockEditorConverter blockConverter)
        : base(logger, blockConverter, contentTypeService)
    {
    }

    public override object? ConvertIntermediateToObject(
        IPublishedElement owner,
        IPublishedPropertyType propertyType,
        PropertyCacheLevel referenceCacheLevel,
        object? inter,
        bool preview)
    {
        var model = (BlockListModel?)base.ConvertIntermediateToObject(owner, propertyType, referenceCacheLevel, inter, preview);

        if (model is null)
        {
            return null;
        }

        return new BlockListModel(model.Where(i => i.Settings?.IsVisible() ?? i.Content.IsVisible()).ToList());
    }
}
