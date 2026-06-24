using Umbraco.Cms.Core.DeliveryApi;
using Umbraco.Cms.Core.Logging;
using Umbraco.Cms.Core.Models.Blocks;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Services;
using Umbraco.Extensions;

namespace NestingContently.Umbraco.Editor;

public class NestingContentlyBlockGridPropertyValueConverter : BlockGridPropertyValueConverter
{
    private readonly IPublishedValueFallback _publishedValueFallback;

    public NestingContentlyBlockGridPropertyValueConverter(
        IProfilingLogger proflog,
        BlockEditorConverter blockConverter,
        IJsonSerializer jsonSerializer,
        IApiElementBuilder apiElementBuilder,
        BlockGridPropertyValueConstructorCache constructorCache,
        IVariationContextAccessor variationContextAccessor,
        BlockEditorVarianceHandler blockEditorVarianceHandler,
        ILanguageService languageService,
        IPropertyRenderingContextAccessor propertyRenderingContextAccessor,
        IPublishedValueFallback publishedValueFallback)
        : base(
            proflog,
            blockConverter,
            jsonSerializer,
            apiElementBuilder,
            constructorCache,
            variationContextAccessor,
            blockEditorVarianceHandler,
            languageService,
            propertyRenderingContextAccessor)
    {
        _publishedValueFallback = publishedValueFallback;
    }

    public override object? ConvertIntermediateToObject(
        IPublishedElement owner,
        IPublishedPropertyType propertyType,
        PropertyCacheLevel referenceCacheLevel,
        object? inter,
        bool preview)
    {
        var converted = base.ConvertIntermediateToObject(owner, propertyType, referenceCacheLevel, inter, preview);

        if (converted is not BlockGridModel model)
        {
            return converted;
        }

        var blockGridItems = model
            .Where(i => i.Settings?.IsVisible(_publishedValueFallback) ?? i.Content.IsVisible(_publishedValueFallback))
            .ToList();

        RemoveHiddenAreas(blockGridItems);

        return new BlockGridModel(blockGridItems, model.GridColumns);

        void RemoveHiddenAreas(IEnumerable<BlockGridItem> items)
        {
            foreach (BlockGridItem? blockGridItem in items)
            {
                List<BlockGridArea> collectedAreas = new();
                foreach (BlockGridArea area in blockGridItem.Areas)
                {
                    IEnumerable<BlockGridItem> collectedItems =
                        area.Where(x => x.Settings?.IsVisible(_publishedValueFallback) ?? x.Content.IsVisible(_publishedValueFallback)).ToList();

                    if (collectedItems.Any())
                    {
                        RemoveHiddenAreas(collectedItems);
                        collectedAreas.Add(new(collectedItems.ToList(), area.Alias, area.RowSpan, area.ColumnSpan));
                    }
                }

                blockGridItem.Areas = collectedAreas;
            }
        }
    }
}
