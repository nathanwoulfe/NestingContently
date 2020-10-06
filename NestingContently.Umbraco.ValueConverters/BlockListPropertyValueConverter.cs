using System.Linq;
using Umbraco.Core.Logging;
using Umbraco.Core.Models.Blocks;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
using Umbraco.Web;
using Umbraco.Web.PropertyEditors.ValueConverters;

namespace NestingContently.Umbraco.ValueConverters
{
	public class BlockListPropertyValueConverter : global::Umbraco.Web.PropertyEditors.ValueConverters.BlockListPropertyValueConverter
	{
		public BlockListPropertyValueConverter(IProfilingLogger proflog, BlockEditorConverter blockConverter)
			: base(proflog, blockConverter)
		{ }

		public override object ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object inter, bool preview)
		{
			var model = (BlockListModel)base.ConvertIntermediateToObject(owner, propertyType, referenceCacheLevel, inter, preview);
			if (model != null)
			{
				// The property is currently only supported on content
				var list = model.Where(i => i.Content.IsVisible()).ToList();
				
				return new BlockListModel(list);
			}

			return model;
		}
	}
}
