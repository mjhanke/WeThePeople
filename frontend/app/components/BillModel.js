/*
  Contains functions for processing bills for display
*/
export class BillModel {
  /* Returns reader-friendly topic of bill */
  getTopic(bill) {
    var topic;
    if (bill.primary_subject === '') {
      topic = bill.committees
        .replace(new RegExp('Senate '), '')
        .replace(new RegExp(' Committee'), '');
    }
    else {
      topic = bill.primary_subject;
    }
    topic = topic
      .replace(new RegExp(' and.*'), '')
      .replace(new RegExp(",.*"), "")
      .replace(new RegExp('&#39;'), '');
    return topic;
  }

  getTitle(bill) {
    var content =
    capitalizeFirstLetter(
      bill.title
      .replace(new RegExp('(A bill )'), '')
      .replace(new RegExp('(to )'), '')
      .replace(new RegExp('(A resolution )'), '')
      .replace(new RegExp('(A joint resolution )'), '')
    );

    if (content[content.length - 1]== '.') {
      content = content.slice(0, -1);
    }
    return content;
  }

  /* Returns reader-friendly topic of bill */
  function getTopic(bill) {
    var topic;
    if (bill.subjects_top_term === '') {
      topic = bill.committees.committee
        .replace(new RegExp('Senate '), '')
        .replace(new RegExp(' Committee'), '');
    }
    else {
      topic = bill.subjects_top_term;
    }
    topic = topic
      .replace(new RegExp(' and.*'), '')
      .replace(new RegExp(",.*"), "")
      .replace(new RegExp('&#39;'), '');
    return topic;
  }

  function getTitle(bill) {
    var content =
    capitalizeFirstLetter(
      bill.official_title
      .replace(new RegExp('(A bill )'), '')
      .replace(new RegExp('(to )'), '')
      .replace(new RegExp('(A resolution )'), '')
      .replace(new RegExp('(A joint resolution )'), '')
      .replace(new RegExp('(, and for other purposes)'), '')
      .replace(new RegExp('(amend )'), 'change ')
    );
    return content;
  }

  function getLatestActivityDate(bill) {
    var date = moment(bill.actions[bill.actions.length - 1].acted_at).format('YYYY-MM-DD');
    /*
    var friendlyDate = moment(date).format('MMMM D');
    var action = friendlyDate + ': ' + bill.latest_major_action
      .replace(new RegExp('(Read twice and referred )'),
        'Read aloud to the Senate and sent ');
      */
    return date;
  }

  capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

}
