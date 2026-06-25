using Umbraco.Cms.Core.DeliveryApi;
using Umbraco.Cms.Core.Logging;
using Umbraco.Cms.Core.Models.Blocks;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.PublishedCache;
using Umbraco.Extensions;

namespace NestingContently.Umbraco.Editor;

public class NestingContentlyBlockListPropertyValueConverter : BlockListPropertyValueConverter
{
    private readonly IPublishedValueFallback _publishedValueFallback;

    public NestingContentlyBlockListPropertyValueConverter(
        IProfilingLogger proflog,
        BlockEditorConverter blockConverter,
        IContentTypeService contentTypeService,
        IApiElementBuilder apiElementBuilder,
        IJsonSerializer jsonSerializer,
        BlockListPropertyValueConstructorCache constructorCache,
        IVariationContextAccessor variationContextAccessor,
        BlockEditorVarianceHandler blockEditorVarianceHandler,
        ILanguageService languageService,
        IPropertyRenderingContextAccessor propertyRenderingContextAccessor,
        IPublishedValueFallback publishedValueFallback)
        : base(
            proflog,
            blockConverter,
            contentTypeService,
            apiElementBuilder,
            jsonSerializer,
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

        // Single-block mode returns a single item; nothing to filter.
        if (converted is not BlockListModel model)
        {
            return converted;
        }

        return new BlockListModel(
            model.Where(i => i.Settings?.IsVisible(_publishedValueFallback) ?? i.Content.IsVisible(_publishedValueFallback)).ToList());
    }
}
