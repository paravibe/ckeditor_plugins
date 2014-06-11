(function ($) {

  "use strict";

  Drupal.behaviors.dialog = {
    attach: function (context, settings) {

      Drupal.dialog = {
        /**
         * Variable storing the current dialog's save callback.
         */
        saveCallback: null,

        /**
         * Open a dialog for a Drupal-based plugin.
         *
         * This dynamically loads jQuery UI (if necessary) using the Drupal AJAX
         * framework, then opens a dialog at the specified Drupal path.
         *
         * @param editor
         *   The CKEditor instance that is opening the dialog.
         * @param string url
         *   The URL that contains the contents of the dialog.
         * @param Object existingValues
         *   Existing values that will be sent via POST to the url for the dialog
         *   contents.
         * @param Function saveCallback
         *   A function to be called upon saving the dialog.
         * @param Object dialogSettings
         *   An object containing settings to be passed to the jQuery UI.
         */
        openDialog: function (editor, url, existingValues, saveCallback, dialogSettings) {
          // Locate a suitable place to display our loading indicator.
          var $target = $(editor.container.$);
          if (editor.elementMode === CKEDITOR.ELEMENT_MODE_REPLACE) {
            $target = $target.find('.cke_contents');
          }

          // Remove any previous loading indicator.
          $target.css('position', 'relative').find('.ckeditor-dialog-loading').remove();

          // Add a consistent dialog class.
          var classes = dialogSettings.dialogClass ? dialogSettings.dialogClass.split(' ') : [];
          classes.push('editor-dialog');
          dialogSettings.dialogClass = classes.join(' ');

          // Add a "Loading…" message, hide it underneath the CKEditor toolbar, create
          var $content = $('<div class="ckeditor-dialog-loading"><span style="top: -40px;" class="ckeditor-dialog-loading-link"><a>' + Drupal.t('Loading...') + '</a></span></div>');
          $content.appendTo($target);

          var element = $('<div class="dialog-content"></div>');
          element.appendTo('body');

          dialogSettings.close = function() {
            $(this).dialog('destroy');
            $('.dialog-content').remove();
            $content.remove();
          }

          $.ajax({
            url: url,
            success: function (data) {
              $('.dialog-content').html(data).dialog(dialogSettings);
            }
          });

          // After a short delay, show "Loading…" message.
          window.setTimeout(function () {
            $content.find('span').animate({ top: '0px' });
          }, 100);

          // Store the save callback to be executed when this dialog is closed.
          Drupal.dialog.saveCallback = saveCallback;
        }
      };
    }
  }
})(jQuery);
